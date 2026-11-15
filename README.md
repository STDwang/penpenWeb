# 王帅鹏 · 仿真平台工程师个人网站

求职作品集、技术内容与个人实验室。面向机器人与智驾仿真岗位，以已有 C++/Qt 商业仿真平台经验为基础。

**当前：Blueprint Brutalism 改版 + 游戏橱窗整合（已上线，2026-11-15）。** 参考 xmmxovo.online 的新粗野语言重做视觉与交互：2px 黑框与硬阴影、按压式按钮、超粗展示字、荧光色块、点阵蓝图底纹、滚动揭示与阅读进度条；顶部 header 承担导航，黄色技术栈跑马灯全宽置于页面最底部（DOM 在 body 层，宽度等于视口）；新增 `/games` 游戏档案页与导航入口，四款游戏（含两款源码私有）由单一清单 `code/src/content/games.json` 同时驱动作品集与游戏橱窗。所有动效都在 `prefers-reduced-motion` 下降级，内容默认可见、不依赖 JS 才能显示。GitHub Pages 主站与 WorkBuddy 镜像均已同步；国内访问另有独立的游戏橱窗备用入口。

**2026-11-15 二次调整：** 移除首页四幕场景切换台；两款源码私有游戏按各自仓库最新 `main` 重新构建部署（黑暗童话 Godot Web 导出、喵饭 Cocos 3.8 release 构建 + 资源自适应量化，并把棋盘说明更新为 7×18）；新增产物发布白名单、公开橱窗仓库的 GitHub Actions 入库拦截、Cocos 逻辑模块混淆与一键重建脚本，详见下方「游戏产物发布与防线」。

**2026-11-15 三次调整（本地，尚未发布）：** 首页从「单屏舞台 + 棚拍全幅背景」改为可滚动长页：开场 / 工作成果 / 个人项目 / 游戏机厅 / 联系五段，导航随滚动高亮。棚拍背景移除，人像裁成双色调工牌卡片（`design/make-portrait.mjs` 生成 31 KB 的 `portrait-duotone.webp`，取代首屏一次加载的 5 张共约 9 MB PNG）。工作成果是「索引行 + 预览窗」，悬停切换截图；游戏机厅是一块大屏加五张卡带，可点选、方向键切换，进入视口后自动轮播、任何操作后停止。同时修正：滚动揭示兜底会在 1.2s 后提前显示全部内容；`/work`、`/lab` 轮播标题压在截图上读不清；`/games` 奇数张时末张落单；`/about` 侧栏风格不一致；768–1120px 宽度下头部把「简历」按钮挤出视口。截图：[桌面首屏](previews/arcade-home-desktop-hero.png) · [桌面全页](previews/arcade-home-desktop.png) · [手机全页](previews/arcade-home-mobile.png)。三尺寸 12 项浏览器检查在生产静态产物上通过。

- GitHub：[STDwang/penpenWeb](https://github.com/STDwang/penpenWeb)；代码、文档和实际截图已提交。
- 在线预览：[https://stdwang.github.io/penpenWeb/](https://stdwang.github.io/penpenWeb/)（GitHub Pages，直接访问）
- 国内镜像（同一应用同时承载游戏橱窗与作品集）：[作品集 /portfolio/](https://wbapp-zx0xlufukmfj9igvb30etd.app.workbuddy.host/portfolio/?sharecode=QLTHCY272K) ｜ [游戏橱窗 /](https://wbapp-zx0xlufukmfj9igvb30etd.app.workbuddy.host/?sharecode=QLTHCY272K)
- 游戏档案：[https://stdwang.github.io/penpenWeb/games/](https://stdwang.github.io/penpenWeb/games/)（4 款游戏的技术路线与试玩入口）
- 游戏橱窗：[https://stdwang.github.io/](https://stdwang.github.io/)（4 款游戏浏览器直接试玩；两款源码私有的游戏只发布构建产物）
- 国内备用入口：[https://wbapp-zx0xlufukmfj9igvb30etd.app.workbuddy.host/?sharecode=QLTHCY272K](https://wbapp-zx0xlufukmfj9igvb30etd.app.workbuddy.host/?sharecode=QLTHCY272K)（WorkBuddy 应用镜像，含全部 4 款游戏构建产物；分享时请保留 `?sharecode=` 参数）
- 游戏清单：`code/src/content/games.json` 是唯一数据源。修改后运行 `npm run games:sync`（可用 `SHOWCASE_DIR` 指定橱窗仓库路径）同步橱窗的 `games.json` 与封面；`backupBase` / `backupShare` 控制国内备用入口，镜像自身会自动隐藏该链接。

### 游戏产物发布与防线

两款源码私有游戏只把构建产物放进公开橱窗仓库，源码仓库保持 private。以下命令都在 `code/` 目录下运行，路径可用 `SHOWCASE_DIR` / `DFT_REPO` / `MEOW_REPO` / `OUT_DIR` / `IMGTOOL_DIR` 覆盖：

| 命令 | 作用 |
| --- | --- |
| `npm run games:build` | 从两个私有仓库最新 `main` 一键重建（Godot headless Web 导出 + Cocos Creator release 构建 + PNG 自适应量化），白名单校验通过后同步到橱窗。可加 `-- --game=darkfairytale` 或 `-- --obfuscate`。 |
| `npm run games:publish -- --game=<slug> --source=<目录> --apply` | 只同步已有产物；默认 dry-run，仅放行构建产物后缀并扫描凭据。 |
| `npm run games:obfuscate -- --target=<目录> --apply` | 混淆 Cocos 逻辑模块，保留 `System.register` 注册名，写入前做语法与模块等价性校验。 |
| `npm run games:sync` | 同步游戏清单与封面到橱窗仓库。 |

公开橱窗仓库的 `.github/workflows/verify-artifacts.yml` 在每次 push / PR 时扫描游戏目录，出现 `.gd` / `.ts` / `project.godot` / sourcemap / 密钥类文件即失败。Godot 与 Cocos Creator 都是本机桌面工具链，CI 无法可靠构建，因此「自动构建」放在本地一键脚本、「入库拦截」放在 GitHub Actions。Cocos 命令行构建需清除 WorkBuddy 注入的 `ELECTRON_RUN_AS_NODE` / `NODE_OPTIONS`，脚本已处理。

## 本地运行

需要 Node.js 22 或更新版本。首次运行：

```powershell
cd code
npm ci
npm run dev
```

默认打开 [http://127.0.0.1:3000/portfolio/](http://127.0.0.1:3000/portfolio/)。生产静态导出：

```powershell
npm run build
```

产物为 `code/out/`，托管时挂载到与 `NEXT_PUBLIC_BASE_PATH` 一致的子路径。静态导出不使用 `next start`。

## 实际页面截图

### 本轮本地审阅版（满帧截图与交互反馈，尚未发布）

![满帧截图与交互反馈版桌面首页](previews/polish-desktop-hero.png)

[桌面全页](previews/polish-desktop.png) · [手机全页](previews/polish-mobile.png) · [平板全页](previews/polish-tablet.png) · [ImagePlayer 桌面详情](previews/polish-imageplayer-desktop.png) · [ImagePlayer 手机详情](previews/polish-imageplayer-mobile.png) · [ImagePlayer 平板详情](previews/polish-imageplayer-tablet.png)

本机实际浏览器渲染的本地生产产物。商业截图改为满帧 16:9，首屏、卡片与详情页不再被补白稀释；链接 hover、移动菜单、画廊进度条、详情目录高亮与站内大图查看已补齐。三尺寸 18 项浏览器检查通过，生产与预览两种索引模式各验证一轮。分析与计划见 [本轮文档](docs/10-ui-interaction-plan.md)。

### 当前 GitHub Pages 线上版本

![线上弥散渐变玻璃拟态首页](previews/released-pages-desktop-hero.png)

[线上桌面全页](previews/released-pages-desktop.png) · [线上手机全页](previews/released-pages-mobile.png) · [线上平板全页](previews/released-pages-tablet.png) · [线上 ImagePlayer 详情](previews/released-pages-imageplayer-desktop.png)

来自 2026-10-22 实际访问的 GitHub Pages 部署，而非本地构建或设计稿。线上三尺寸 15 项浏览器检查通过；检查经本机已有代理，不代表大陆直连稳定性。WorkBuddy 镜像尚未同步；具体提交与检查范围见 [发布记录](docs/09-release.md)。

### 本轮本地审阅版

![弥散渐变玻璃拟态桌面首页](previews/glass-desktop-hero.png)

[桌面全页](previews/glass-desktop.png) · [手机全页](previews/glass-mobile.png) · [平板全页](previews/glass-tablet.png)

以上为本地生产静态产物的实际渲染，非概念图或线上截图。图片保持不透明，文字与截图可读性优先；滤镜不支持时使用实色降级。此前真实模块截图版保留如下。

![实际模块截图版桌面首页](previews/modules-desktop-hero.png)

[桌面全页](previews/modules-desktop.png) · [手机全页](previews/modules-mobile.png) · [平板全页](previews/modules-tablet.png) · [ImagePlayer 桌面详情](previews/modules-imageplayer-desktop.png) · [ImagePlayer 手机详情](previews/modules-imageplayer-mobile.png)

实际浏览器渲染，非线上截图。[排放与中观卡片](previews/modules-work-desktop.png)。素材已脱敏，商业截图保留产品水印；牙片按作者要求公开为网上示例，仅用于图像取反演示。ImagePlayer 本地 README 同步加入三张图、构建与使用说明。类型检查、17 页静态构建和三尺寸 15 项浏览器检查通过。[本轮对应关系与审阅记录](docs/08-module-screenshots.md)。

### 上一轮 UI 审阅版

![UI 修订版桌面首屏](previews/refresh-desktop-hero.png)

[桌面全页](previews/refresh-desktop.png) · [手机首屏](previews/refresh-mobile-hero.png) · [手机全页](previews/refresh-mobile.png) · [平板全页](previews/refresh-tablet.png)

来源为本机实际浏览器渲染，不是设计稿或线上截图。横向卡片支持触摸、触控板、左右按钮和键盘 Home/End；未增加轮播依赖。参考取舍、素材来源、验证范围与审阅要点见 [本轮审阅记录](docs/07-ui-refresh.md)。

### 历史线上版本

![线上网站实际首屏](previews/online-desktop-hero.png)

[线上桌面全页](previews/online-desktop.png) · [线上手机全页](previews/online-mobile.png) · [线上平板全页](previews/online-tablet.png)

以上截图来自实际访问的 Vercel 在线站点。页面默认暂停在 12/30 秒；浏览器检查中的全页截图启用了减少动态效果。[本地构建截图](previews/site-desktop.png)保留用于对照。

## 原始设计稿

![桌面首页首屏](previews/home-desktop-hero.png)

- [桌面全页 PNG](previews/home-desktop.png) · [可编辑 SVG](design/mockups/home-desktop.svg)
- [手机全页 PNG](previews/home-mobile.png) · [可编辑 SVG](design/mockups/home-mobile.svg)
- [手机首屏](previews/home-mobile-hero.png)
- [信息架构](docs/02-information-architecture.md)
- [首页文案](docs/03-home-copy.md)
- [内容依据与项目清单](docs/04-content-evidence.md)
- [视觉与交互规范](design/visual-system.md)
- [审阅与验收记录](docs/05-review.md)

## 目录

| 目录 | 用途 |
| --- | --- |
| `code/` | Next.js 应用、统一项目内容、静态资源及浏览器测试 |
| `docs/` | 定位、信息架构、文案、内容依据、验收 |
| `design/` | 视觉规范、参考来源、原始项目截图、SVG 与导出工具 |
| `previews/` | 当前设计稿 PNG；阶段二增加真实页面截图 |
| `简历/` | 现有 DOCX/PDF；阶段三轻量修订 |
| `work/` | 本地文本提取与临时文件，不提交 |

## 设计稿再生成

`design/render-mockups.mjs` 是独立的设计导出工具，不是网站运行入口。需要 Node.js、Sharp 与 Microsoft YaHei 字体；该字体用于本机渲染，不分发字体文件。SVG 保留可编辑文字和向量示意，截图嵌入 SVG 以支持独立打开。

```powershell
# DESIGN_NODE_MODULES 指向已有且包含 sharp 的 node_modules 目录。
$env:DESIGN_NODE_MODULES = '你的 node_modules 绝对路径'
node design/render-mockups.mjs
node design/check-mockups.mjs
```

## 内容维护与验证

项目内容集中在 `code/src/content/projects.ts`。商业案例与个人项目共用内容结构，页面与详情路由在构建时生成。新增/维护卡片的 `focus`（重点）、`outcome`（交付链路）、图片及来源字段即可同步列表与详情。图片在 `code/public/images/`；公开 PDF 在 `code/public/resume/`。下载文件是原版简历的副本，本地 DOCX/PDF 源文件未修改。

```powershell
cd code
npm run typecheck
npm run build
# 先在另一终端 npm run dev，再运行：
npm run test:e2e
```

浏览器检查使用本机 Microsoft Edge。其他系统可调整 `code/playwright.config.ts` 的 `channel`，或安装对应 Playwright Chromium 后移除该设置。已验证 1440px、768px、390px 三个尺寸的交互、路由、PDF、404、noindex 和无 JavaScript 降级。

验证在线站点时可以复用同一套检查，并将截图与本地结果分开保存：

```powershell
cd code
$env:PLAYWRIGHT_BASE_URL = 'https://stdwang.github.io'
$env:NEXT_PUBLIC_BASE_PATH = '/penpenWeb'
$env:SCREENSHOT_PREFIX = 'online'
# 如果本机需要已配置的代理，再设置 PLAYWRIGHT_PROXY；默认不使用代理。
npm run test:e2e
```

2026-10-21 线上三尺寸共 9 个浏览器用例通过，详情见[线上验收记录](docs/06-online-verification.md)。

## 网站技术与部署

Next.js App Router、React、TypeScript、Tailwind CSS；提交 npm 锁文件；本地内容预渲染，首屏 SVG 交互独立加载。只使用本地资源，不在访问时请求 GitHub/CSDN。静态信息无需 JavaScript 即可读取。

GitHub 仓库：[STDwang/penpenWeb](https://github.com/STDwang/penpenWeb)。当前采用静态导出托管：`next.config.ts` 设置 `output: "export"`，子路径由 `NEXT_PUBLIC_BASE_PATH` 环境变量控制，默认 `/portfolio`（WorkBuddy 托管）；GitHub Pages 构建时设为 `/penpenWeb`，产物推送 `gh-pages` 分支发布。

发布时同时设置 `SITE_URL`，否则站点保持 `noindex, nofollow`、canonical 与分享卡片会指向 localhost：

```powershell
cd code
$env:NEXT_PUBLIC_BASE_PATH = '/penpenWeb'
$env:SITE_URL = 'https://stdwang.github.io/penpenWeb'
npm run build
```

不带 `SITE_URL` 的本地与预览构建继续输出 `noindex, nofollow` 和空 sitemap。

在线站点：GitHub Pages 为主站（[在线预览](https://stdwang.github.io/penpenWeb/)），国内入口为 WorkBuddy 应用镜像（[作品集 /portfolio/](https://wbapp-zx0xlufukmfj9igvb30etd.app.workbuddy.host/portfolio/?sharecode=QLTHCY272K)）。同一个镜像应用的根路径是[游戏橱窗](https://wbapp-zx0xlufukmfj9igvb30etd.app.workbuddy.host/?sharecode=QLTHCY272K)，四款游戏的构建产物都在其中。分享时务必保留 `?sharecode=` 参数，平台会校验每个请求。此前阶段二审阅版本曾部署于 Vercel，现已切换；仓库 homepage 元数据也已从失效的 Vercel 地址改为 Pages 地址。

当前在线站点按既有策略保持 `noindex, nofollow`、空 sitemap（构建未设置 `SITE_URL`），正式搜索收录在阶段三审阅后配置。上一轮使用的 `penpen-portfolio.app.workbuddy.host` 为历史应用链接，本轮发布工具把作品集与游戏橱窗收敛到同一个新应用，旧链接仍是旧版内容，后续统一使用上面的新链接。

本轮已同步 GitHub 源码、`gh-pages` 产物、游戏橱窗仓库与国内镜像；未变更索引开关或桌面简历。精确发布状态见 [发布记录](docs/09-release.md)。

## 来源

[素材与设计参考](design/references.md)。公开项目按许可证实际情况标注；公开代码不自动等同于取得开源许可。原始个人资料、公司代码、临时材料与认证配置不进入公开仓库。
