# 2026-10-22 发布记录

## 本轮范围

发布真实商业模块截图、排放详情与 ImagePlayer 多截图图库；根据追加要求加入静态弥散渐变与玻璃拟态。保持深色工程视觉、原生横向卡片与清晰正文，不增加动画或轮播依赖。

玻璃面板仅在有边界的导航、卡片、作品窗口和联系区使用 backdrop-filter；截图不透明、不改变软件输出。手机取消大面积面板模糊，保留渐变和高不透明度底色；不支持滤镜时用实色降级。渐变不自动运动，减少动态效果设置继续生效。

同时修复下载简历入口缺少部署子路径的问题，首页和简历页统一通过资源路径助手生成链接。

## 发布边界

- 网站主分支发布源码、文档和真实浏览器截图；Pages 使用 `/penpenWeb/` 静态构建产物，保留现有分支发布方式，不变更可见性或索引开关。
- WorkBuddy 使用 `/portfolio/` 独立构建，继续沿用现有应用地址及分享参数，不创建替代站点。
- ImagePlayer 仅发布 README 和三张截图。原目录已有未提交的 C++ 取反修复保持不动；README 与网站明确区分本地演示版本和公开默认分支，避免用截图声称远程代码已经具备尚未合入的修复。
- WorkBuddy 尚未同步新版本，保留独立的静态发布产物，需通过已有应用重新发布。简历按用户指定顺序待部署完成后处理。

## 验证

本地类型检查、17 页静态构建以及 1440、768、390px 共 15 项浏览器检查通过。ImagePlayer 默认分支已更新为 `486ab35e096c9d12fd1f994782d9aef575b659f0`，远端确认仅包含 README 与三张脱敏截图。

网站提交与线上核验在完成后追加；未完成的平台不标记为已上线。

## GitHub 发布

- 应用源码：`2d9a0627`，已推送 `main`。
- Pages 产物：`f08b102e0a78ba43341d78420f2990f0014e821a`，已推送 `gh-pages`。GitHub Pages API 返回 `built`，部署错误为空。
- 地址：<https://stdwang.github.io/penpenWeb/>。
- 已检查实际线上首屏，静态弥散渐变、半透明面板和轨道模块真实截图均已显示；线上截图使用 `previews/released-pages-*.png`，与本地预览分开保存。
- 浏览器检查使用本机已有代理，不能由此保证大陆无代理网络的稳定性。
- 线上三尺寸共 15 项浏览器检查全部通过（3.1 分钟）：首屏、播放/拖动/键盘选择、横向卡片触摸与键盘、四案例顺序、新排放详情、ImagePlayer 图库、图片加载、PDF 下载、404、noindex 和无 JavaScript 降级。检查对象为实际 Pages 地址，不是本地预览。

## WorkBuddy 状态

只读访问现有应用地址返回 200，但页面仍不包含新轨道截图及排放案例，因此未自动同步。不将 GitHub Pages 发布成功表述为 WorkBuddy 已完成更新。

已生成忽略目录内的独立 ZIP，包含 `portfolio/` 静态目录，共 115 项；核对首页图片和 PDF 的 `/portfolio/` 前缀。ZIP 和部署说明留在本地 `work/releases/`，没有把临时发布检出或任何认证配置提交仓库。桌面求职目录的 DOCX/PDF 未修改，待 WorkBuddy 部署完成后继续。

---

# 2026-11-15 发布记录：Blueprint Brutalism 改版 + 游戏橱窗整合

## 发布范围

- 参考 xmmxovo.online 的 Neo-Brutalism 语言重做视觉与交互，新增 `code/src/app/brutal.css` 覆盖层与 `code/src/components/site-motion.tsx`；原有 6 个样式文件未改，可一键回滚。
- 新增 `/games` 游戏档案页与导航入口，四款游戏（含两款源码私有）由 `code/src/content/games.json` 单一数据源驱动作品集与游戏橱窗；`npm run games:sync` 同步橱窗清单与封面。
- 游戏橱窗 `STDwang.github.io` 首页改为从清单动态渲染，补返回作品集导航、国内镜像入口、私有声明、`robots.txt` 与 `NOTICE.md`。
- 两个私有游戏仓库仍保持 private，公开仓库只放构建产物。

## 部署结果

| 目标 | 地址 | 说明 |
| --- | --- | --- |
| 作品集主站 | <https://stdwang.github.io/penpenWeb/> | `gh-pages` 分支，Pages 版静态导出（18 页） |
| 作品集 /games | <https://stdwang.github.io/penpenWeb/games/> | 含主入口与国内备用入口 |
| 游戏橱窗主站 | <https://stdwang.github.io/> | 4 款游戏 iframe 打开即玩 |
| 国内备用入口 | <https://wbapp-zx0xlufukmfj9igvb30etd.app.workbuddy.host/?sharecode=QLTHCY272K> | WorkBuddy 应用镜像，根路径为游戏橱窗 |
| 国内作品集 | <https://wbapp-zx0xlufukmfj9igvb30etd.app.workbuddy.host/portfolio/?sharecode=QLTHCY272K> | 同一镜像应用的 `/portfolio/` 子路径 |

国内镜像约 193 MB，含 4 款游戏全部构建产物（最大单文件 46.5 MB `index.pck`、39.5 MB `index.wasm`），实测子路径与大文件均返回 200。分享链接必须保留 `?sharecode=` 参数；`games.json` 的 `backupShare` 会把该参数拼到每个备用游戏地址上，避免未访问过首页的浏览器被 403 拦下。镜像自身会自动隐藏「备用入口」按钮。

发布工具把本轮两次发布（游戏橱窗、作品集）收敛到同一个新应用，因此旧链接 `penpen-portfolio.app.workbuddy.host` 仍是上一版内容；新版作品集位于同一新应用的 `/portfolio/` 子路径。所有 README 与仓库 homepage 已改用新链接。

## 其他仓库同步

- `STDwang/STDwang` profile README：加「快速入口」区块（主站、/games、橱窗、国内备用入口）与私有游戏声明。
- `STDwang/mistloop`、`STDwang/Dreamscape` README：补统一橱窗、作品集游戏档案与国内备用入口。
- `STDwang/penpenWeb` 仓库 homepage 元数据：由失效的 `https://penpen-web.vercel.app` 改为 Pages 地址。

## 验证

`npm run typecheck` 通过；`/penpenWeb` 与 `/portfolio` 两套 basePath 静态构建各 18 页通过。本地 1440px 首页、`/games`、橱窗、暗色主题与 390px 移动端实拍验证；修掉揭示动画初始 `opacity:0` 导致 `/games` 整页留白、舞台入场发灰、移动端切换条溢出三个问题。浏览器检查经本机代理完成，不能替代大陆无代理网络的手机流量实测。

## 未变更

索引开关仍为 `noindex, nofollow`（构建未设置 `SITE_URL`），桌面简历 PDF 未改，Godot Web 导出保持关闭线程（GitHub Pages 无法设置 COOP/COEP 响应头）。
