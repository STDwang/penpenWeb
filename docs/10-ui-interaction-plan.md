# UI 交互与视觉优化计划 · 2026-10-24

## 本轮依据

代码 `code/src`（Next.js 16 App Router + Tailwind 4 + 手写 CSS）、`code/public/images` 素材、`design/prepare-module-screenshots.mjs` 素材流水线，以及本机重新构建的静态产物（`NEXT_PUBLIC_BASE_PATH=/penpenWeb`，17 页预渲染）在 `http://127.0.0.1:3002/penpenWeb/` 的实际浏览器渲染。

审阅对象是**当前源码状态**，不是线上版本：线上 GitHub Pages 发布停留在 `2d9a062`/`f08b102`（见 `docs/09-release.md`），其后的 `74c5c55`（全宽毛玻璃头部）尚未发布。

## 现状判断

底子已经不错，不必推倒重来：暗色工程视觉基调统一、真实截图叙事清晰、无障碍基础扎实（跳转链接、`focus-visible`、`prefers-reduced-motion`、`prefers-reduced-transparency`、无 JavaScript 降级、横向画廊的键盘与触摸路径都有自动化检查）。

当前的问题**不在"好不好看"，而在信息密度与反馈一致性**：访客能看见真实产品画面，但画面本身被大量空白稀释；可点击元素缺反馈；站点对招聘方的技术信号（可索引、可分享）没有正确打开。

按投入产出排序如下。

---

## P0 · 影响可信度与转化

### 1. 分享链接指向 localhost，全站不可被搜索引擎收录

`code/src/lib/site.ts:15-22` 把 `indexable` 绑定在 `VERCEL_ENV === "production" && Boolean(SITE_URL)` 上，而站点实际托管在 GitHub Pages，构建时不产生 `VERCEL_ENV`。同时 `siteUrl` 回退到 `http://localhost:3000`。

当前构建产物 `code/out/index.html` 实测：

```
<meta name="robots" content="noindex, nofollow"/>
<meta property="og:url" content="http://localhost:3000/"/>
<meta property="og:image" content="http://localhost:3000/penpenWeb/social-card.png"/>
```

`code/out/robots.txt` 同样是 `Disallow: /`，`sitemap.xml` 为空数组。

后果：把链接发到微信/LinkedIn/邮件时预览图和链接地址是 `localhost`；招聘方用搜索引擎或站内搜索都找不到这个站点。

**做法**：把索引开关与托管平台解耦——`indexable = Boolean(process.env.SITE_URL)`，去掉 `VERCEL_ENV` 判断；Pages 构建时传 `SITE_URL=https://stdwang.github.io/penpenWeb`。同时保留"预览构建保持 noindex"的能力，改由 `SITE_URL` 是否显式传入决定（`.env.example` 已经写好的用法）。

**收益**：这是本轮唯一一条能同时改善"招聘方能否找到你"和"分享出去好不好看"的改动，半小时内可完成。

### 2. 截图被强制补白，旗舰案例约四成画面是空白

`design/prepare-module-screenshots.mjs:47`：

```js
.resize(1600, 900, { fit: "contain", background: "#121b29" })
```

`rail-transit` 的原始裁剪是 1920×710（宽高比 2.70），塞进 16:9 后上下各补约 154px 纯色空白——**整张图约 39% 是无信息的深色块**。`layers-picking`（2.06）、`emissions`、`micro-meso` 同样被补白。

同时比例体系不统一：

| 素材 | 实际尺寸 | 宽高比 | 卡片容器 `aspect-ratio: 16/9` 的结果 |
| --- | --- | --- | --- |
| rail-transit / layers-picking / emissions / micro-meso / imageplayer* | 1600×900 | 1.78 | 补白后正好贴合，无二次留边 |
| gpuview | 1440×920 | 1.57 | `object-fit: contain` 左右留边 |
| dreamscape | 1200×800 | 1.50 | 左右留边明显 |
| mistloop | 1440×900 | 1.60 | 左右留边 |

`code/src/content/projects.ts` 对后三张未声明 `imageSize`，回落到默认 `[1600, 1000]`（比例 1.6），与实际 1.50 / 1.57 / 1.60 都有偏差，会产生轻微布局跳动。

**做法**：素材流水线改为保留自然比例（去掉 `fit: "contain"` 补白，改为 `fit: "inside"` + 白色背景或直接按比例缩放），CSS 侧让容器跟随图片自身比例而不是统一 16:9；首屏 hero 单独准备一张已经裁好的图，`object-position: top` 锚住工具栏与第一组轨道，而不是靠空白被 cover 裁掉的副作用。

**收益**：首屏与卡片的"有效画面"提升近一倍，是当前投入产出比最高的视觉改动。

---

## P1 · 交互反馈缺失

### 3. `.text-link` hover 完全没有反馈

`code/src/app/globals.css:113-125` 只定义了 `.text-link:hover .arrow` 的位移，没有任何颜色或下划线变化。而 `.text-link` 承担了站内大部分主动作：章节标题右侧的「全部工程案例」「全部个人项目」、卡片内「案例详情」「项目详情」、联系区「查看简历」、详情页「查看完整截图 ↗」、页脚 GitHub / CSDN。

其中 `.section-heading > .text-link` 被显式设成 `color: var(--muted)`（灰），hover 时连箭头位移在灰底上也不明显——访客得不到"这是可点的"的信号。对照组：`.button:hover` 有边框变色，`.main-nav a:hover`、`.hero-social a:hover`、`.contact-links a:hover`、`.detail-toc a:hover` 都有变色，唯独 text-link 漏了。

**做法**：`.text-link:hover { color: var(--accent) }`，并给章节级链接补下划线；保持箭头位移作为附加反馈。

### 4. 移动端菜单是"抽屉式下拉"，但只处理了 Escape

`code/src/components/header.tsx:20-30` 只注册了 `keydown === "Escape"`。缺失：点击菜单外部不关闭、打开时 `body` 不锁定滚动、没有焦点收拢。菜单面板底色仍是实色 `var(--surface)`（`globals.css:992`），与已经毛玻璃化的 sticky 头部割裂。

**做法**：补 outside-click 关闭与 `overflow: hidden` 锁定；面板改为与头部同一套玻璃材质；`aria-expanded` 已有，焦点管理沿用现有 Escape 回焦逻辑。

### 5. 画廊进度只有数字，缺少可视轨道

`code/src/components/project-rail.tsx` 的工具条只有 `01 / 04` 和两个圆形按钮。桌面 `grid-auto-columns: 46%`，1440px 宽下一屏只能完整看到 2 张卡；768–1199px 区间是 65%，一屏 1.5 张。访客缺少"还有几张、现在第几张、卡在哪"的整体感知，只靠「向右探索」一句提示。

**做法**：加一条细进度条（宽度 = 当前位置 / 总数），按钮旁保留数字；把"向右探索"降级为一次性提示，进度条成为常驻反馈。

### 6. 详情页目录是静态链接，截图只能开新标签

`code/src/components/project-detail.tsx:74-82` 的目录没有当前区块高亮——长文档滚动时无法定位。`project-detail.tsx:53` 的「查看完整截图 ↗」直接 `target="_blank"` 打开原图，访客失去上下文，也没有前后对比。

**做法**：目录加 `IntersectionObserver` 当前项高亮（纯客户端，约 30 行）；原图改为站内灯箱，`Esc` 关闭、左右切换。

### 7. 顶部导航没有滚动高亮

首页整页高 4460px（1440 宽实测），导航只有 `aria-current` 的页面级高亮，滚动过程中不指示当前所在区块。

**做法**：首页按四个区块做 `IntersectionObserver` 驱动的当前态（`aria-current="location"`），移动端菜单面板同样显示。

---

## P2 · 视觉一致性

### 8. 圆角体系混乱

现存 3 / 4 / 5 / 6 / 8 / 12px 六种圆角。卡片与联系区是 12px，按钮 8px，标签 4px，`.play-button` 与 `.scene-badge` 是 3px，`.timeline` 5px，`.scene` 6px。层级化圆角本身没错，但 3px 和 5px 是孤立值。

**做法**：定三档——容器 12px、控件 8px、标签 4px，其余全部归位。

### 9. 10–11px 正文级中文偏小

`.caption`、`.eyebrow`、`.scene-top`、`.image-credit`、`.card-evidence dt`、`.hero-source`、`.proof-strip p` 都在 10–11px。英文 mono 下勉强，中文在 Windows 高 DPI 下偏弱，且这是"图片来源""个人职责"这类需要被读到的信息。

**做法**：说明性文字统一提到 12px，eyebrow 保持 11px，`--subtle` 色再提亮一档以补偿字号。

### 10. 证据条第三格视觉重量失衡

`code/src/app/page.tsx:116-125` 把「跨 尺度」放进 38px Consolas 数字位，中文回退到雅黑 38px，与前两格纯数字的宽度和重心完全不同，看起来像排版事故。

**做法**：第三格换成可比较的量值（例如"2 尺度"或"3 类模块"），或把中文标签降到与另两格一致的次级字号。

### 11. eyebrow 编号格式三套并存

`SectionTitle` 输出 `01 / SELECTED WORK`，demo 区手写 `03 / INTERACTIVE SKETCH`（`page.tsx:184`），页面级用 `SELECTED ENGINEERING / 01`（`work/page.tsx`）。同一套视觉语言里三种编号写法。

**做法**：统一为 `01 / SELECTED WORK` 一种形式，`SectionTitle` 增加可选前缀参数，页面级复用同一组件。

### 12. 交互示意与"真实截图"叙事冲突

`code/src/components/simulation-player.tsx` 是全页唯一明显偏示意调性的模块，且位置偏后。`.selection-readout` 固定在 `right: 9%; top: 24%`，与被选中车辆的实际位置无关，缺少空间关联。

**做法**：读数框跟随选中车辆定位（限制在场景内），或至少加一条从车辆指向读数框的连线；模块层级上与"真实截图"做明确区隔（现有文案已有"固定演示数据"，可再强化）。

### 13. 色彩三套并存

accent 青 `#71e2d4`、blue `#82bdff`、amber `#e7ba77` 同时使用；`.tech-tags` 用蓝灰 `#b6c9d9` + `#819cbd0d`，与 accent 不成体系，一张卡里出现青、灰蓝、亮青三色。

**做法**：amber 保留给 SVG 场景内的语义标记；tech-tags 归到 accent 体系（低饱和青灰）。

### 14. 详情页「核心交付」面板空场过大

`.detail-outcome` 是全宽玻璃面板，桌面 1264px 宽，实际只装一行「建模 → 保存重开 → 运行 → 结果输出」。大屏上右侧约 2/3 是空白。

**做法**：改为左标签右内容的紧凑条，或限制最大宽度并与 `.prose` 对齐。

---

## P3 · 性能与工程卫生

15. `next.config.ts` 设了 `images: { unoptimized: true }`，WebP 素材合计 1.8MB；首页会加载 8 张卡片图（约 1MB）。素材重裁（见 P0-2）后体积会同步下降；若仍偏高，可对非首屏图按 `sizes` 生成多档。
16. `globals.css` 已 2300+ 行，末段是覆盖式追加（`/* Portfolio review: ... */`、`/* Static diffuse light + bounded glass panels. */` 两块），同一条规则被定义 2–3 次，改一处要通读三遍。建议按"基础 / 布局 / 玻璃主题 / 响应式"四段重排，去掉重复覆盖。
17. `SimulationPlayer` 播放时每帧 `setTime` 触发整棵子树重渲染（含 3 个车辆按钮与 SVG）。改用 `useRef` 直接写 transform 或把时间提到 `requestAnimationFrame` 外部状态即可，非必需。

18. （判断项）`.hero-evidence` 的 `transform: rotate(-1deg)` 让一块玻璃面板倾斜。在部分显示器上容易读成渲染错误，鼠标悬停会回正。建议在玻璃化后取消倾斜，或只保留轻微 `0.4deg`。

---

## 执行顺序

| 阶段 | 内容 | 预计 | 可独立验证 |
| --- | --- | --- | --- |
| 0 | P0-1 索引与分享链接 | 0.5 人日 | 构建产物 grep `og:url` / `robots.txt`；线上 `curl -I` 抽查 |
| 1 | P0-2 素材重裁 + 容器比例 | 1 人日 | 首页 / 卡片 / 详情三处截图对比；首屏有效画面占比 |
| 2 | P1-3…7 交互反馈补齐 | 1.5 人日 | Playwright 增加 hover 态、菜单 outside-click、目录高亮用例 |
| 3 | P2 视觉一致性收敛 | 1 人日 | 三尺寸截图走查 |
| 4 | P3 性能与 CSS 结构 | 0.5–1 人日 | 构建体积对比 |

阶段 0 与阶段 1 之间没有依赖，可以并行。阶段 2、3 建议合并成一次改动提交，因为两者都动 `globals.css` 的同一批选择器。

### 每阶段的验收口径

沿用现有 Playwright + Edge 套件（`code/tests/site.spec.ts`，1440 / 768 / 390 三尺寸），每阶段追加对应断言：

- 阶段 0：`og:url` 为生产域名且不再是 localhost；`robots.txt` 为 `Allow: /`；`sitemap.xml` 非空。
- 阶段 1：四张商业卡片图片容器内无上下留边（断言渲染盒高度与图片自然比例一致）；hero 图高不再被 padding 稀释。
- 阶段 2：`.text-link` hover 颜色变化；移动端点击菜单外关闭；详情页目录随滚动更新当前项。
- 阶段 3：圆角取值收敛为 3 档；说明性文字不小于 12px。

## 本轮不做

- 不引入轮播、粒子、入场动画或新的运行时依赖（延续 `docs/07-ui-refresh.md` 的取舍）。
- 不改求职定位文案、不改任职日期、不动简历源文件。
- 不重做设计语言，只做密度、反馈与一致性收敛。
- 不在阶段 0 之前动线上发布；阶段 0 完成后单独发一次 Pages 构建。

---

## 本轮实施记录 · 2026-10-24

阶段 0 到 3 已实施。阶段 4 只做了低风险的一步（路网 SVG 记忆化），CSS 层级整理未做。

### 改动清单

| 项 | 改动 | 文件 |
| --- | --- | --- |
| 索引与分享 | `indexable` 只依赖 `SITE_URL`，解除 `VERCEL_ENV` 绑定；新增 `absoluteUrl()` 统一 canonical / og:url / og:image / sitemap 的子路径与尾斜杠 | `code/src/lib/site.ts`、`code/src/app/robots.ts`、`code/src/app/sitemap.ts`、`code/src/app/layout.tsx` |
| 素材密度 | 流水线由 `fit: "contain"` 补白改为 `fit: "cover", position: "top"` 满帧裁切，并收紧 rail-transit 的源裁剪高度 | `design/prepare-module-screenshots.mjs` |
| 链接反馈 | `.text-link:hover` 变为主色，章节级链接补下划线 | `code/src/app/globals.css` |
| 移动菜单 | 补点击外部关闭、打开时锁定 body 滚动、路由变化自动收起；面板改为毛玻璃 | `code/src/components/header.tsx`、`globals.css` |
| 画廊进度 | 轨道下方增加随滚动变化的进度条 | `code/src/components/project-rail.tsx` |
| 详情目录 | 目录拆为客户端组件，滚动时高亮当前章节 | `code/src/components/detail-toc.tsx` |
| 大图查看 | 详情页主图可点击放大，站内浮层显示，Esc 关闭并归还焦点 | `code/src/components/lightbox.tsx`、`code/src/components/project-detail.tsx` |
| 视觉一致性 | 圆角收敛为 14 / 8 / 4 三档；说明性中文提到 12px；hero 与卡片改为满帧 16:9；eyebrow 统一为一个组件；证据条第三格改为同量级数字；技术标签改用主色体系；「核心交付」改为两列紧凑条 | `globals.css`、`code/src/components/ui.tsx`、`code/src/app/page.tsx`、`work/page.tsx`、`lab/page.tsx` |
| 既有缺陷 | 平板与手机宽度下毛玻璃头部内边距（56px）与内容列（40px / 24px）不一致，`74c5c55` 引入的头部对齐断言因此一直失败 | `code/src/app/globals.css` |
| 渲染开销 | 路网 SVG 组件记忆化，播放时不再每帧重建 | `code/src/components/simulation-player.tsx` |

### 素材变化

补白取消后，`rail-transit` 的画面占比从 66% 提升到 100%，体积同时下降：

| 文件 | 处理前 | 处理后 |
| --- | --- | --- |
| rail-transit.webp | 63,330 B | 52,342 B |
| layers-picking.webp | 199,478 B | 192,968 B |
| emissions.webp | 256,616 B | 257,746 B |
| micro-meso.webp | 171,588 B | 177,634 B |
| imageplayer.webp | 201,290 B | 179,806 B |
| imageplayer-photo.webp | 111,498 B | 100,782 B |
| imageplayer-medical.webp | 78,786 B | 65,150 B |

### 验证

- `npm run typecheck` 通过；17 页静态构建通过。
- Playwright + Microsoft Edge，1440 / 768 / 390 三尺寸共 18 项检查全部通过。本轮新增 3 项：链接 hover 变色、画廊进度条随滚动增长、详情页目录高亮与灯箱开关。
- 生产构建（带 `SITE_URL`）与预览构建（不带 `SITE_URL`）各跑一轮完整回归：前者 robots 为 `Allow: /`、sitemap 13 条、`og:url` 指向生产域名；后者保持 `noindex, nofollow` 与空 sitemap。
- `previews/polish-*.png` 为本轮本地实际渲染。

### 仍未做

- CSS 层级整理：`globals.css` 仍是历史叠加结构，本轮只在末尾追加了一段收敛样式，避免大范围重构影响现有渲染。
- 顶部导航的区块滚动高亮、交互示意模块读数框跟随车辆位置，需要重构组件结构，本轮未动。
- 线上发布未执行。Pages 仍停在 `2d9a062` / `f08b102`，发布时需要补上 `SITE_URL`：

```powershell
cd code
$env:NEXT_PUBLIC_BASE_PATH = '/penpenWeb'
$env:SITE_URL = 'https://stdwang.github.io/penpenWeb'
npm run build
```

WorkBuddy 镜像使用 `/portfolio` 子路径，需对应设置 `SITE_URL=https://penpen-portfolio.app.workbuddy.host/portfolio`。
