#!/usr/bin/env node
/**
 * Cocos Web 产物混淆（可选加固，只提高阅读成本，不改变行为）
 *
 * 只处理游戏逻辑模块 assets/main/index.js 与 src/chunks/bundle.js：
 *   - 关闭字符串数组与控制流平坦化，System.register("...") 的模块名、依赖数组、
 *     导出名全部保持原样，否则 Cocos 的模块加载器会找不到模块；
 *   - 只重命名局部标识符并压缩，renameGlobals / renameProperties 均关闭；
 *   - 混淆后做语法解析 + 模块注册名集合比对，任一不一致就拒绝写入。
 *
 * 依赖：javascript-obfuscator（默认从 IMGTOOL_DIR 或 D:/tmp_godot/imgtool/node_modules 加载）。
 * 用法：
 *   node scripts/obfuscate-cocos.mjs --target=D:\tmp_godot\out\meowmatch-release
 *   node scripts/obfuscate-cocos.mjs --target=D:\tmp_godot\out\meowmatch-release --apply
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const candidates = [
  process.env.IMGTOOL_DIR && path.join(process.env.IMGTOOL_DIR, "javascript-obfuscator"),
  "D:/tmp_godot/imgtool/node_modules/javascript-obfuscator",
  "javascript-obfuscator",
].filter(Boolean);

let lib = null;
for (const candidate of candidates) {
  try { lib = require(candidate); break; } catch { /* 尝试下一个位置 */ }
}
if (!lib) {
  console.error("找不到 javascript-obfuscator。请先安装，或设置 IMGTOOL_DIR 指向含该包的 node_modules。");
  process.exit(2);
}
// 5.x 的 CommonJS 导出是 JavaScriptObfuscatorFacade 类本身，obfuscate 是它的静态方法；
// 直接调用类会抛 "cannot be invoked without 'new'"，所以优先取静态方法。
const obfuscate = lib?.obfuscate || lib?.default?.obfuscate || lib;
if (typeof obfuscate !== "function") {
  console.error("javascript-obfuscator 导出格式不符合预期");
  process.exit(2);
}

const TARGETS = ["assets/main/index.js", "src/chunks/bundle.js"];

// 保守配置：字符串一字不动，只动局部标识符
const OPTIONS = {
  compact: true,
  controlFlowFlattening: false,
  deadCodeInjection: false,
  debugProtection: false,
  disableConsoleOutput: false,
  identifierNamesGenerator: "mangled",
  log: false,
  numbersToExpressions: false,
  renameGlobals: false,
  renameProperties: false,
  rotateStringArray: false,
  selfDefending: false,
  shuffleStringArray: false,
  simplify: true,
  splitStrings: false,
  stringArray: false,
  stringArrayCallsTransform: false,
  stringArrayEncoding: [],
  stringArrayThreshold: 1,
  transformObjectKeys: false,
  unicodeEscapeSequence: false,
  reservedNames: [
    "^System$", "^register$", "^execute$", "^setters$", "^cc$",
    "^window$", "^document$", "^globalThis$", "^exports$", "^module$", "^require$",
  ],
  // 不启用 stringArray，字符串本就保持原样；因此不需要 reservedStrings
  // （该选项只接受字符串，传正则会被校验器拒绝）。
};

function args() {
  const out = { apply: false };
  for (const a of process.argv.slice(2)) {
    if (a === "--apply") out.apply = true;
    else if (a.startsWith("--")) {
      const [k, ...rest] = a.slice(2).split("=");
      out[k.replace(/-/g, "_")] = rest.join("=");
    }
  }
  return out;
}

/**
 * 提取所有 System.register("模块名", ...) 的模块名。
 * javascript-obfuscator 会把成员访问统一改写成 System['register'](...)，
 * 两种写法都要识别；字符串值本身必须保持不变。
 */
function moduleNames(code) {
  const names = [];
  const re = /System\s*(?:\.\s*register|\[\s*['"]register['"]\s*\])\s*\(\s*(["'])(.*?)\1/g;
  let m;
  while ((m = re.exec(code))) names.push(m[2]);
  return names;
}

function main() {
  const { target, apply } = args();
  if (!target) {
    console.error("用法: node scripts/obfuscate-cocos.mjs --target=<产物目录> [--apply]");
    process.exit(2);
  }
  const root = path.resolve(target);
  if (!fs.existsSync(root)) { console.error(`目标不存在：${root}`); process.exit(2); }

  const backup = path.join(path.dirname(root), `obfuscate-backup-${Date.now()}`);
  let ok = true;
  for (const rel of TARGETS) {
    const file = path.join(root, ...rel.split("/"));
    if (!fs.existsSync(file)) { console.log(`跳过（不存在）：${rel}`); continue; }
    const before = fs.readFileSync(file, "utf8");
    const beforeNames = moduleNames(before);
    let after;
    try {
      after = obfuscate(before, OPTIONS).getObfuscatedCode();
    } catch (error) {
      console.error(`✗ ${rel} 混淆失败：${error.message}`);
      ok = false;
      continue;
    }
    // 语法可解析
    try { new Function(after); }
    catch (error) { console.error(`✗ ${rel} 混淆后语法不可解析：${error.message}`); ok = false; continue; }
    // 模块注册名集合必须完全一致
    const afterNames = moduleNames(after);
    if (beforeNames.length !== afterNames.length || beforeNames.some((n, i) => n !== afterNames[i])) {
      console.error(`✗ ${rel} 模块注册名发生变化（${beforeNames.length} → ${afterNames.length}），拒绝写入`);
      ok = false;
      continue;
    }
    console.log(`✓ ${rel}: ${(Buffer.byteLength(before) / 1024).toFixed(1)}KB → ${(Buffer.byteLength(after) / 1024).toFixed(1)}KB，模块 ${beforeNames.length} 个保持不变`);
    if (apply) {
      const dest = path.join(backup, ...rel.split("/"));
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, before);
      fs.writeFileSync(file, after);
    }
  }
  if (!ok) { console.error("校验未通过，未写入任何文件"); process.exit(1); }
  if (!apply) console.log("这是演练（dry-run）。确认后加 --apply 写回，原文件会备份到 " + backup);
  else console.log("混淆完成，原文件备份于 " + backup);
}

main();
