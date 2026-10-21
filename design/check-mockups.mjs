// Small reproducible checks for the stage-one deliverable.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(join(process.env.DESIGN_NODE_MODULES || root, 'package.json'));
const sharp = require('sharp');
for (const [name, width, height] of [
  ['home-desktop', 1440, 3870], ['home-mobile', 390, 5090],
  ['home-desktop-hero', 1440, 970], ['home-mobile-hero', 390, 910],
]) {
  const metadata = await sharp(join(root, `previews/${name}.png`)).metadata();
  assert.equal(metadata.width, width, `${name}: width`);
  assert.equal(metadata.height, height, `${name}: height`);
}
for (const name of ['home-desktop', 'home-mobile']) {
  const svg = await readFile(join(root, `design/mockups/${name}.svg`), 'utf8');
  for (const phrase of ['王帅鹏', '机器人与智驾仿真工具链', '固定演示数据', 'GPUView', 'Dreamscape', 'MISTLOOP', 'ImagePlayer', '138 4948 9395', '1946262980@qq.com']) {
    assert.ok(svg.includes(phrase), `${name}: missing ${phrase}`);
  }
  assert.equal((svg.match(/href="data:image\/png;base64,/g) || []).length, 2, `${name}: two embedded actual screenshots`);
  assert.ok(!/href="https?:|<script\b|<foreignObject\b/.test(svg), `${name}: portable static SVG`);
  await sharp(Buffer.from(svg)).metadata();
}
const originals = [
  ['王帅鹏-C++开发工程师.docx', '82f72bfdcf7958f35ca58c871875b8e806b94bce2a141f22eff34a65131755c8'],
  ['王帅鹏-C++开发工程师.pdf', '792ddeb4be63e61bee1fcfefd3dd89088df77c34e27132de6f6a31f076764f84'],
];
// Local-only originals may be absent from a future public checkout.
for (const [name, expected] of originals) {
  let bytes;
  try { bytes = await readFile(join(root, '简历', name)); }
  catch (error) { if (error.code === 'ENOENT') continue; throw error; }
  assert.equal(createHash('sha256').update(bytes).digest('hex'), expected, `${name}: stage-one original fingerprint`);
}
console.log('PASS: preview dimensions, SVG content/assets, and available stage-one resume fingerprints.');
