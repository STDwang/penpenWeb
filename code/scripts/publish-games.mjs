#!/usr/bin/env node
/**
 * 游戏构建产物发布器（白名单防线）
 *
 * 把私有项目的 Web 构建产物同步到公开橱窗仓库，同步前逐文件校验：
 *   1. 只放行构建产物后缀，源码 / 工程配置 / 密钥类文件一律拒绝；
 *   2. 扫描文本文件里的私钥、GitHub Token、云厂商 AccessKey 等特征；
 *   3. 全量校验通过后才会写入，任何一项失败都不会改动目标目录。
 *
 * 用法（默认演练，不写盘）：
 *   node scripts/publish-games.mjs --game=darkfairytale --source=D:\tmp_godot\out\dft-latest
 *   node scripts/publish-games.mjs --game=meowmatch   --source=E:\AiGame\MeowMatch\build\web-mobile-release --apply
 *
 * 目标目录默认取 SHOWCASE_DIR，未设置时为 D:/tmp_godot/site。
 */
import fs from "node:fs";
import path from "node:path";

/** 允许进入公开仓库的产物后缀。Cocos 的 import 元数据是 .json，Godot 的 worklet 是 .js。 */
const ALLOW_EXT = new Set([
  ".html", ".js", ".mjs", ".wasm", ".pck", ".css", ".bin", ".json", ".txt",
  ".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".ico", ".avif",
  ".wav", ".mp3", ".ogg", ".m4a", ".glb", ".gltf", ".ttf", ".woff", ".woff2",
]);

/** 明确禁止的文件名（即使后缀碰巧在白名单里）。 */
const DENY_BASENAME = [
  /^project\.godot$/i, /^export_presets\.cfg$/i, /^package(-lock)?\.json$/i,
  /^tsconfig.*\.json$/i, /^\.gitmodules$/i, /^\.env($|\.)/i,
  /^(credentials|secrets)(\.|$)/i, /\.(pem|key|p12|pfx)$/i,
  /^npm-debug\.log$/i,
];

/** 只扫小的文本文件，避免误判二进制资源。 */
const SECRET_PATTERNS = [
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  /gh[pousr]_[A-Za-z0-9]{20,}/,
  /AKIA[0-9A-Z]{16}/,
  /xox[baprs]-[A-Za-z0-9-]{10,}/,
];
const SCAN_LIMIT = 1024 * 1024;

const VALID_GAMES = new Set(["darkfairytale", "dreamscape", "meowmatch", "mistloop"]);

function parseArgs(argv) {
  const out = { apply: false };
  for (const arg of argv) {
    if (arg === "--apply") out.apply = true;
    else if (arg.startsWith("--")) {
      const [key, ...rest] = arg.slice(2).split("=");
      out[key.replace(/-/g, "_")] = rest.join("=");
    }
  }
  return out;
}

function walk(dir) {
  const result = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...walk(full));
    else if (entry.isFile()) result.push(full);
  }
  return result;
}

function verify(source, files) {
  const problems = [];
  let bytes = 0;
  let scanned = 0;
  for (const file of files) {
    const rel = path.relative(source, file).split(path.sep).join("/");
    const ext = path.extname(file).toLowerCase();
    const base = path.basename(file);
    const stat = fs.statSync(file);
    bytes += stat.size;

    if (!ALLOW_EXT.has(ext)) {
      problems.push(`${rel} — 后缀 ${ext || "(无)"} 不在产物白名单内`);
      continue;
    }
    if (DENY_BASENAME.some((re) => re.test(base))) {
      problems.push(`${rel} — 工程 / 密钥类文件名被禁止`);
      continue;
    }
    if (stat.size > SCAN_LIMIT || !/\.(json|js|html|css|txt|mjs)$/i.test(ext)) continue;
    const text = fs.readFileSync(file, "utf8");
    scanned += 1;
    for (const pattern of SECRET_PATTERNS) {
      if (pattern.test(text)) {
        problems.push(`${rel} — 疑似凭据（${pattern.source.slice(0, 28)}…）`);
        break;
      }
    }
  }
  return { problems, bytes, scanned };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const { game, source } = args;
  if (!game || !source) {
    console.error("用法: node scripts/publish-games.mjs --game=<slug> --source=<构建目录> [--apply]");
    process.exit(2);
  }
  if (!VALID_GAMES.has(game)) {
    console.error(`未知游戏 ${game}；可选：${[...VALID_GAMES].join(", ")}`);
    process.exit(2);
  }
  const src = path.resolve(source);
  if (!fs.existsSync(src) || !fs.statSync(src).isDirectory()) {
    console.error(`源目录不存在：${src}`);
    process.exit(2);
  }
  const showcase = path.resolve(process.env.SHOWCASE_DIR || "D:/tmp_godot/site");
  const target = path.join(showcase, game);
  if (!fs.existsSync(path.join(showcase, "games.json"))) {
    console.error(`目标不是橱窗仓库（缺 games.json）：${showcase}`);
    process.exit(2);
  }

  const files = walk(src);
  const { problems, bytes, scanned } = verify(src, files);
  console.log(`游戏：${game}`);
  console.log(`源：${src}`);
  console.log(`目标：${target}`);
  console.log(`文件：${files.length} 个，合计 ${(bytes / 1048576).toFixed(1)} MiB，凭据扫描 ${scanned} 个文本文件`);
  if (problems.length) {
    console.error(`\n校验失败，共 ${problems.length} 项，未写入任何文件：`);
    for (const p of problems.slice(0, 30)) console.error("  ✗ " + p);
    if (problems.length > 30) console.error(`  … 另有 ${problems.length - 30} 项`);
    process.exit(1);
  }
  console.log("✓ 白名单与凭据校验通过");

  const incoming = new Set(files.map((f) => path.relative(src, f).split(path.sep).join("/")));
  const stale = fs.existsSync(target)
    ? walk(target).filter((f) => !incoming.has(path.relative(target, f).split(path.sep).join("/")))
    : [];
  console.log(`同步计划：复制 ${files.length} 个文件，清理 ${stale.length} 个旧文件`);
  if (!args.apply) {
    console.log("这是演练（dry-run）。确认无误后加 --apply 执行写入。");
    return;
  }

  fs.mkdirSync(target, { recursive: true });
  for (const file of files) {
    const rel = path.relative(src, file);
    const dest = path.join(target, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(file, dest);
  }
  for (const file of stale) fs.rmSync(file, { force: true });
  // 清理同步后残留的空目录
  const dirs = [];
  (function collect(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) { const p = path.join(dir, entry.name); collect(p); dirs.push(p); }
    }
  })(target);
  for (const dir of dirs) {
    try { fs.rmdirSync(dir); } catch { /* 非空目录保留 */ }
  }
  console.log(`完成：${game} 已同步到 ${target}`);
}

main();
