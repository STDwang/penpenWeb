// Reproducible, pixel-preserving screenshot crops/redactions. No image generation.
// node design/prepare-module-screenshots.mjs <private-input-directory>
// Inputs stay in ignored work/. Only sanitized WebP outputs are public.
import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(resolve(root, "code/package.json"));
const sharp = require("sharp");
const input = process.argv[2];
if (!input) throw new Error("Pass the directory containing the private input PNGs.");
const output = resolve(root, "code/public/images");
await mkdir(output, { recursive: true });

const shots = [
  { name: "rail-transit", crop: { left: 0, top: 26, width: 1920, height: 710 } },
  { name: "layers-picking", crop: { left: 0, top: 26, width: 1914, height: 930 } },
  { name: "emissions", crop: { left: 0, top: 26, width: 1918, height: 950 } },
  { name: "micro-meso", crop: { left: 0, top: 26, width: 1920, height: 974 } },
  { name: "imageplayer", crop: { left: 6, top: 2, width: 1599, height: 819 }, masks: [
    [400, 2, 980, 33], [610, 70, 490, 77],
  ] },
  { name: "imageplayer-photo", crop: { left: 0, top: 0, width: 1600, height: 819 }, masks: [
    [470, 0, 900, 35],
  ] },
  { name: "imageplayer-medical", crop: { left: 0, top: 4, width: 1594, height: 817 }, masks: [
    [560, 0, 800, 35], [600, 70, 385, 70],
    [570, 145, 240, 170], [1360, 145, 234, 170],
    [130, 95, 80, 50], [775, 510, 35, 70], [1540, 510, 54, 70],
  ] },
];

for (const shot of shots) {
  let pipeline = sharp(resolve(input, `${shot.name}.png`)).extract(shot.crop);
  if (shot.masks) {
    const rectangles = shot.masks.map(([x, y, width, height]) =>
      `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="#252526"/>`,
    ).join("");
    pipeline = pipeline.composite([{ input: Buffer.from(
      `<svg width="${shot.crop.width}" height="${shot.crop.height}">${rectangles}</svg>`,
    ) }]);
  }
  // Separate pipelines apply redactions before resizing. No originals/metadata embedded.
  const sanitized = await pipeline.png().toBuffer();
  await sharp(sanitized).resize(1600, 900, { fit: "contain", background: "#121b29" })
    .webp({ quality: 90 }).toFile(resolve(output, `${shot.name}.webp`));
  console.log(`${shot.name}.webp: 1600x900, sanitized`);
}
