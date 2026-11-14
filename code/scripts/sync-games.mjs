// 把唯一游戏清单同步到游戏橱窗仓库，并把封面复制回作品集本地。
// 用法：npm run games:sync
// 可用环境变量 SHOWCASE_DIR 覆盖橱窗仓库路径（默认本机路径）。
import { readFile, writeFile, mkdir, copyFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const codeRoot = path.resolve(here, "..");
const source = path.join(codeRoot, "src/content/games.json");
const showcaseDir = process.env.SHOWCASE_DIR || "D:/tmp_godot/site";
const target = path.join(showcaseDir, "games.json");
const localCovers = path.join(codeRoot, "public/images/games");

const catalog = JSON.parse(await readFile(source, "utf8"));
await writeFile(target, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
console.log(`[games] 清单已同步 → ${target}`);

await mkdir(localCovers, { recursive: true });
for (const game of catalog.games) {
  const file = path.basename(game.cover);
  const from = path.join(showcaseDir, game.cover);
  const to = path.join(localCovers, file);
  try {
    await copyFile(from, to);
    console.log(`[games] 封面 ${file} → public/images/games/`);
  } catch {
    console.warn(`[games] 未找到封面 ${from}，跳过（作品集将回退到主站图片）`);
  }
}
console.log(`[games] 共 ${catalog.games.length} 款游戏，备用入口：${catalog.backupBase || "未配置"}`);
