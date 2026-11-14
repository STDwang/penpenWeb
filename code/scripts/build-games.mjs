#!/usr/bin/env node
/**
 * 从私有仓库最新代码一键重建两款私有游戏的 Web 产物，并同步到公开橱窗。
 *
 * 这是「私有仓库构建 → 只把产物推到 public 仓库」的本地自动化实现。
 * 没有放在 GitHub Actions 里跑，是因为 Cocos Creator 3.8 是桌面应用
 * （需要本机安装、授权与 GUI 运行时），CI 上无法可靠构建；
 * 公开仓库侧的 .github/workflows/verify-artifacts.yml 负责入库拦截，两者配合。
 *
 * 用法：
 *   npm run games:build                          # 构建 darkfairytale + meowmatch
 *   npm run games:build -- --game=darkfairytale  # 只构建其中一个
 *   npm run games:build -- --obfuscate           # 构建后对 Cocos 产物做混淆
 *
 * 路径均可用环境变量覆盖：DFT_REPO / MEOW_REPO / SHOWCASE_DIR / OUT_DIR /
 * GODOT_EXE / CREATOR_EXE / IMGTOOL_DIR。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const SCRIPTS_DIR = path.dirname(fileURLToPath(import.meta.url));
const CODE_DIR = path.dirname(SCRIPTS_DIR);

const CFG = {
  dftRepo: process.env.DFT_REPO || "D:/tmp_godot/DarkFairyTale",
  meowRepo: process.env.MEOW_REPO || "E:/AiGame/MeowMatch",
  showcase: process.env.SHOWCASE_DIR || "D:/tmp_godot/site",
  outDir: process.env.OUT_DIR || "D:/tmp_godot/out",
  godot: process.env.GODOT_EXE || "D:/software/Godot_v4.7.2-stable_win64/Godot_v4.7.2-stable_win64.exe",
  creator: process.env.CREATOR_EXE || "D:/software/cocos/editors/Creator/3.8.8/CocosCreator.exe",
  imgtool: process.env.IMGTOOL_DIR || "D:/tmp_godot/imgtool/node_modules",
};

function cliArgs() {
  const out = { game: "all", obfuscate: false };
  for (const a of process.argv.slice(2)) {
    if (a === "--obfuscate") out.obfuscate = true;
    else if (a.startsWith("--")) {
      const [k, ...rest] = a.slice(2).split("=");
      out[k.replace(/-/g, "_")] = rest.join("=");
    }
  }
  return out;
}

function run(label, cmd, argv, opts = {}) {
  console.log(`\n[${label}] ${cmd} ${argv.join(" ")}`);
  const env = { ...process.env };
  for (const key of opts.cleanEnv || []) delete env[key];
  const result = spawnSync(cmd, argv, {
    encoding: "utf8",
    cwd: opts.cwd || CODE_DIR,
    env,
    timeout: opts.timeout || 600000,
  });
  if (result.error) throw new Error(`${label} 启动失败：${result.error.message}`);
  if (result.stdout?.trim()) console.log(result.stdout.trim().slice(-1000));
  if (result.stderr?.trim()) console.log(result.stderr.trim().slice(-600));
  const accepted = opts.accept || [0];
  if (!accepted.includes(result.status)) throw new Error(`${label} 退出码 ${result.status}`);
  return result;
}

function publish(game, source) {
  run(`发布/${game}`, process.execPath, [
    path.join(SCRIPTS_DIR, "publish-games.mjs"),
    `--game=${game}`, `--source=${source}`, "--apply",
  ], { cwd: CODE_DIR });
}

/** Godot：同步到私有仓库 main → headless 导出 Web（关闭线程，兼容 GitHub Pages）。 */
function buildDarkFairyTale() {
  const out = path.join(CFG.outDir, "dft-latest");
  fs.mkdirSync(out, { recursive: true });
  run("Godot/拉取最新 main", "git", ["-C", CFG.dftRepo, "fetch", "origin", "-q"]);
  run("Godot/切到 main", "git", ["-C", CFG.dftRepo, "reset", "--hard", "origin/main", "-q"]);

  const preset = path.join(CFG.dftRepo, "export_presets.cfg");
  if (!fs.existsSync(preset)) {
    fs.writeFileSync(preset, [
      "[preset.0]", "", 'name="Web"', 'platform="Web"', "runnable=true",
      'custom_features=""', 'export_filter="all_resources"', 'include_filter=""',
      'exclude_filter=""', 'export_path=""', "", "[preset.0.options]", "",
      "variant/thread_support=false", "",
    ].join("\n"));
    console.log("已生成默认 Web 导出预设（thread_support=false）");
  }
  run("Godot/Web 导出", CFG.godot, [
    "--headless", "--path", CFG.dftRepo, "--export-release", "Web",
    path.join(out, "index.html"),
  ]);
  if (!fs.existsSync(path.join(out, "index.pck"))) throw new Error("Godot 导出缺少 index.pck");
  publish("darkfairytale", out);
  return out;
}

function walk(dir) {
  const all = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) all.push(...walk(p));
    else if (e.isFile()) all.push(p);
  }
  return all;
}

/** Cocos：临时 release 配置 → Creator 命令行构建 → 发布参数 → PNG 自适应量化。 */
async function buildMeowMatch(obfuscate) {
  const cfgSrc = path.join(CFG.meowRepo, "config", "build-web.json");
  const cfgTmp = path.join(CFG.meowRepo, "config", "build-web-release.json");
  const cfg = JSON.parse(fs.readFileSync(cfgSrc, "utf8"));
  cfg.debug = false;
  cfg.outputName = "web-mobile-release";
  fs.writeFileSync(cfgTmp, JSON.stringify(cfg, null, 2));
  try {
    // 36 是 Creator 命令行构建成功的退出码；必须清掉 WorkBuddy 注入的 Electron 变量，
    // 否则 exe 会以 Node 模式启动并报 "bad option: --project"。
    run("Cocos/发布构建", CFG.creator, [
      "--project", CFG.meowRepo, "--build", `configPath=${cfgTmp}`,
    ], { cleanEnv: ["ELECTRON_RUN_AS_NODE", "NODE_OPTIONS"], accept: [0, 36], cwd: CFG.meowRepo });
  } finally {
    fs.rmSync(cfgTmp, { force: true });
  }

  const built = path.join(CFG.meowRepo, "build", "web-mobile-release");
  if (!fs.existsSync(path.join(built, "index.html"))) throw new Error("Cocos 构建产物缺失");
  const out = path.join(CFG.outDir, "meowmatch-release");
  fs.rmSync(out, { recursive: true, force: true });
  fs.cpSync(built, out, { recursive: true });

  // 关闭 FPS 面板与调试日志（与线上发布版一致）
  const app = path.join(out, "application.js");
  let s = fs.readFileSync(app, "utf8");
  s = s.replace("this.showFPS = true;", "this.showFPS = false;")
       .replace("debugMode: true ? cc.DebugMode.INFO : cc.DebugMode.ERROR",
                "debugMode: false ? cc.DebugMode.INFO : cc.DebugMode.ERROR");
  fs.writeFileSync(app, s);

  // 从原始构建重新量化，quality=80 贴近上一版发布产物的画质 / 体积
  let sharp;
  try { sharp = require(path.join(CFG.imgtool, "sharp")); }
  catch { throw new Error("找不到 sharp，请设置 IMGTOOL_DIR 指向含 sharp 的 node_modules"); }
  const pngs = walk(built).filter((p) => p.toLowerCase().endsWith(".png"));
  let before = 0, after = 0;
  for (const src of pngs) {
    const rel = path.relative(built, src);
    const dest = path.join(out, rel);
    before += fs.statSync(src).size;
    const buf = await sharp(src).png({ palette: true, colours: 256, quality: 80, effort: 10, dither: 1.0 }).toBuffer();
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, buf);
    after += buf.length;
  }
  console.log(`[Cocos/资源量化] ${pngs.length} 张 PNG：${(before / 1048576).toFixed(1)}MB → ${(after / 1048576).toFixed(1)}MB`);

  if (obfuscate) {
    run("Cocos/混淆", process.execPath, [
      path.join(SCRIPTS_DIR, "obfuscate-cocos.mjs"), `--target=${out}`, "--apply",
    ], { cwd: CODE_DIR });
  }
  publish("meowmatch", out);
  return out;
}

async function main() {
  const args = cliArgs();
  if (!fs.existsSync(path.join(CFG.showcase, "games.json"))) {
    throw new Error(`SHOWCASE_DIR 不是橱窗仓库：${CFG.showcase}`);
  }
  fs.mkdirSync(CFG.outDir, { recursive: true });
  const want = (g) => args.game === "all" || args.game === g;
  if (want("darkfairytale")) buildDarkFairyTale();
  if (want("meowmatch")) await buildMeowMatch(args.obfuscate);
  console.log("\n✓ 构建与同步完成。接下来：提交橱窗仓库 → 推送 → 重新发布国内镜像。");
}

main().catch((error) => { console.error("\n✗ " + error.message); process.exit(1); });
