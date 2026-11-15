// 从棚拍原图裁出半身像，转灰度并把背景推向纯白，供首页工牌卡片做 multiply 双色调。
// 用法：node design/make-portrait.mjs（sharp 取自 code/node_modules）
import { createRequire } from "node:module";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(resolve(root, "code/package.json"));
const sharp = require("sharp");
const src = resolve(root, "code/public/images/white-studio-intro.png");
const out = resolve(root, "code/public/images/portrait-duotone.webp");

const info = await sharp(src)
  .extract({ left: 486, top: 0, width: 680, height: 850 })
  .resize(720, 900)
  .grayscale()
  .linear(1.5, -62)
  .gamma(1.15)
  .webp({ quality: 80 })
  .toFile(out);
console.log(out, info.width, info.height, info.size);
