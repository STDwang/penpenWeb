# 王帅鹏 · 仿真平台工程师个人网站

求职作品集、技术内容与个人实验室。面向机器人与智驾仿真岗位，以已有 C++/Qt 商业仿真平台经验为基础。

**当前：阶段二，本地可运行网站已完成。** 已实现首页、三个工程案例、四个实验项目、关于、简历、PDF 下载与首屏轨迹交互。阶段一设计稿保留在 `design/`；实际网站截图保存在 `previews/site-*.png`。

- 本地预览：[http://127.0.0.1:3000](http://127.0.0.1:3000)
- GitHub：[STDwang/penpenWeb](https://github.com/STDwang/penpenWeb)；代码、文档和实际截图已提交。
- Vercel Preview：等待连接获得默认团队访问权限；当前返回 403，尚未部署。没有填写推测的在线地址。

## 本地运行

需要 Node.js 22 或更新版本。首次运行：

```powershell
cd code
npm ci
npm run dev
```

打开终端显示的 [http://127.0.0.1:3000](http://127.0.0.1:3000)。生产构建预览：

```powershell
npm run build
npm run start
```

## 实际页面截图

![实际网站首屏](previews/site-desktop-hero.png)

[桌面全页](previews/site-desktop.png) · [手机全页](previews/site-mobile.png) · [平板全页](previews/site-tablet.png)

截图来自本地生产构建，属于可运行网站截图，不是 Vercel 部署截图。页面默认暂停在 12/30 秒；浏览器检查中的全页截图启用了减少动态效果。

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

项目内容集中在 `code/src/content/projects.ts`。商业案例与个人项目共用内容结构，页面与详情路由在构建时生成。图片在 `code/public/images/`；公开 PDF 在 `code/public/resume/`。下载文件是原版简历的副本，本地 DOCX/PDF 源文件未修改。

```powershell
cd code
npm run typecheck
npm run build
# 先在另一终端 npm run start，再运行：
npm run test:e2e
```

浏览器检查使用本机 Microsoft Edge。其他系统可调整 `code/playwright.config.ts` 的 `channel`，或安装对应 Playwright Chromium 后移除该设置。已验证 1440px、768px、390px 三个尺寸的交互、路由、PDF、404、noindex 和无 JavaScript 降级。

## 网站技术与部署

Next.js App Router、React、TypeScript、Tailwind CSS；提交 npm 锁文件；本地内容预渲染，首屏 SVG 交互独立加载。只使用本地资源，不在访问时请求 GitHub/CSDN。静态信息无需 JavaScript 即可读取。

GitHub 仓库：[STDwang/penpenWeb](https://github.com/STDwang/penpenWeb)。Vercel 导入该仓库，Framework 选择 Next.js，Root Directory 设置为 `code/`；安装命令 `npm ci`，构建命令 `npm run build`，其余保留框架默认值。当前阶段只部署 Preview。

生产发布时把 `SITE_URL` 设置为已经验证的正式 origin（例如实际分配的 HTTPS 域名，不含路径）。只有 `VERCEL_ENV=production` 且 `SITE_URL` 已配置时，才启用索引、正式 canonical 和 sitemap。其他构建默认 `noindex, nofollow`，robots 禁止索引，sitemap 留空；无需密钥或数据库。

当前 Vercel 连接可以识别账户，但对默认团队缺少授权；需用户在插件连接中完成团队授权后继续。没有使用其他账户或更改团队权限来绕过该限制。

阶段二提供可操作页面和 Vercel Preview 后停下审阅；阶段三处理反馈、同步 DOCX/PDF，再发布正式地址。

## 来源

[素材与设计参考](design/references.md)。公开项目按许可证实际情况标注；公开代码不自动等同于取得开源许可。原始个人资料、公司代码、临时材料与认证配置不进入公开仓库。
