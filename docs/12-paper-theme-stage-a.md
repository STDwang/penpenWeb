# 阶段 A · 高级白主题与磨砂玻璃升级 · 2026-10-26

面向「人物即全站背景 + 高级白 + 高级磨砂玻璃」的整站改版，本阶段只做**不依赖新角色素材**的部分：配色、字体、玻璃材质。角色背景层与运镜属于阶段 B。

## 目标与验收

- 主题从深石墨改为高级白：纸白底、墨色字、单一深青强调色。
- 排版换成编辑体：拉丁用高对比衬线，中文用轻宋，界面用中性无衬线，全部自托管。
- 磨砂玻璃从「深色半透明 + 彩色渐变」改为「白色半透明 + 细发丝边 + 暖调投影」。
- 桌面 1440 / 平板 768 / 手机 390 三尺寸回归通过。

## 改动

### 配色迁移

`code/src/app/globals.css` 与 `code/src/app/future.css` 里 140 余处硬编码深色，按语义一次性映射到纸白体系（一次性脚本 `work/migrate-paper-theme.mjs`，结果已落盘，脚本在忽略目录内）。

新的纸白 token：

| token | 值 | 用途 |
| --- | --- | --- |
| `--bg` | `#f4f2ef` | 纸面底色 |
| `--surface` | `#fbfaf8` | 面板底 |
| `--raised` | `#ffffff` | 抬起层 |
| `--text` | `#17140f` | 主文字（墨） |
| `--muted` | `#4c463f` | 次级文字 |
| `--subtle` | `#797066` | 三级文字 |
| `--line` | `#17140f1f` | 发丝线 |
| `--accent` | `#0d6a61` | 深青（仪表绿），唯一强调色 |
| `--amber` | `#8a5a1c` | 暖金，仅用于极少量标记 |

强调色从亮青 `#71e2d4` 改成深青 `#0d6a61`：亮青在白底上对比度不足，深青在白底和图片上都能读，且与角色服装上的青色描边同源。

### 新增玻璃体系

新增 `code/src/app/theme-paper.css`（在 `globals.css`、`future.css` 之后引入，优先级最高），定义：

```
--glass-1/2/3   三层白玻璃填充
--glass-line    发丝边 rgba(23,20,15,.09)
--glass-inset   顶部高光 inset 0 1px 0 rgba(255,255,255,.95)
--glass-shadow  0 26px 60px -32px rgba(35,29,23,.45)
--glass-blur    26px
```

面板从「深底 + 青紫渐变 + 内发光」改成「白底 + 极淡暖调渐变 + 顶部高光 + 暖调投影」。噪点纹理保留但从 12% 降到 4.5%，在白底上像纸纹而不是灰渍。

### 字体

`next/font/google` 自托管，构建期下载、运行期本地加载，不依赖 Google：

- `Bodoni_Moda`（400/500）→ `--font-display`，拉丁展示体
- `Noto_Serif_SC`（300）→ `--font-display-cn`，中文轻宋
- `Inter`（400/500/600）→ `--font-sans`，界面与正文

标题 `h1`/`h2` 使用 `Bodoni Moda → Noto Serif SC` 栈（拉丁命中前者、中文命中后者）。中文轻宋按 unicode-range 切片，浏览器只取用到的分片。

构建产物：112 个 woff2、3.3MB（`out/` 已在忽略目录内）；主样式表 103KB，其中 133 条 `@font-face`。

### 其他

- `color-scheme` 由 dark 改为 light，表单控件与滚动条跟随。
- 角色图注 `FIG. 01 / FUTURE SELF` 改为白玻璃胶囊，从「压在深色衣服上看不见」变为可读。
- 人物画布加底部渐隐遮罩，切图硬边融进纸面。
- 纸面底纹改为极淡暖白辉光，替代原来的青紫光晕。

## 验证

- `npm run typecheck` 通过，17 页静态构建通过。
- Playwright + Edge，1440 / 768 / 390 三尺寸回归全部通过。
- 截图：`previews/paper-home-desktop.png`、`paper-home-mobile.png`、`paper-work-desktop.png`、`paper-about-desktop.png` 等。

## 未做（阶段 B 依赖素材决策）

- 角色从右侧方框升级为全站背景层。
- 相机运镜：点击顶部导航或侧边按钮时，镜头转到眼镜 / 手表 / 投影，并把对应板块内容停靠在这些表面上。
- 眼镜、带屏手表、可投影头戴这三件道具本身。

原因：现有形象 `code/public/images/future-self-approved.webp` 是半身像，没有眼镜、手表和头戴设备；`code/public/models/future-self-free-rig.glb` 是自由骨骼实验模型，五官与本人不符，`docs/11-future-portfolio-redesign.md` 已记录不得作为最终人物。道具与运镜要先定素材来源。
