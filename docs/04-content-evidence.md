# 内容依据与项目清单

核验日期：2026-10-21。来源为用户提供的 DOCX/PDF、GitHub 默认分支 README 与 GPUView 技术文档。本地简历已提取至 `work/markitdown/`，该目录不公开。

## 商业经历

| 内容 | 来源 | 使用范围与边界 |
| --- | --- | --- |
| 四年 C++/Qt、商业仿真平台 | 简历“职业概述”与任职日期 | 年限沿用用户口径；不扩写任职时间 |
| 轨道交通模块 | 简历“轨道及机场交通模块” | 架构拆分、线路/站台/列车、保存加载、运行/停靠/结果、25 项测试；数字仅在详情注明简历来源 |
| 图层与拾取 | 简历对应项目 | 四层架构、类型+ID、层级继承、候选选择、删除联动与编译验证 |
| 中观与协同 | 简历对应项目 | 与一名同事合作、总体架构、TessInterfaces、转换、OD、结果评价；不写成独立完成全部算法 |
| 性能和发布 | 简历工作与早期项目 | 生命周期、兼容、回归、国际化、版本交付；“5 倍”仅对应卫星信号处理，不跨项目借用 |

阶段一商业案例采用自行绘制的架构/交互示意。本轮经用户要求，增加济达官网已公开的三维窗口、二维路网与热力图，只用于产品上下文；图注明确其不是个人模块验收截图。原创结构图保留在详情。未使用内部公司源码或客户数据。图中自绘站点、车辆、轨迹和时间是设计数据，不是实测结果。具体资源与用途见 `design/references.md` 本轮修订记录。

## 个人项目

### GPUView

- 来源：[README](https://github.com/STDwang/GPUView/blob/main/README.md)、[首轮查询基准](https://github.com/STDwang/GPUView/blob/main/benchmarks/reports/BASELINE.md)、[架构说明](https://github.com/STDwang/GPUView/blob/main/docs/03-architecture/ARCHITECTURE.md)。README 核验版本 SHA：`2a8afd261b8eeb6d7dfac9ec92b7e893149bb590`（文件 SHA）。
- 当前口径：C++17/Qt 6 Widgets 教学分析工具；百万合成事件、索引、LOD、异步快照、PresentMon v1 CSV 和精确选区统计。
- 查询性能只可描述为固定 seed/规模/环境下的独立查询基准。189.406ms → 2.7329ms 是 100 次查询合计中位数，不是 FPS、加载速度或端到端交互延迟；首页不放该倍数。
- 不具备完整真实 Kernel、调用栈分析；不与微软同名工具建立关系。架构文件包含目标设计，项目详情以 README 与已实现补充为准。
- 图片：公开仓库 `assets/screenshots/timeline.png`，本地 `design/assets/gpuview-timeline.png`，未改动原图；视觉稿中仅做裁切。

### Dreamscape

- 来源：[README](https://github.com/STDwang/Dreamscape/blob/main/README.md)。文件 SHA：`7f1f5048d7f2b2fd96a2834611f50a1bd3907673`。
- 内容：程序化角色/场景、Godot、Blender、GDScript、交互原型；不描述为机器人仿真经验。
- 演示地址：`https://dreamscape-cat.app.workbuddy.host/`；核对后确认为静态项目介绍与截图展示，不是浏览器可玩游戏。本站按钮改为“项目展示”。
- 图片：README 链接的 `screenshots/latest_ingame.png`，本地 `design/assets/dreamscape-ingame.png`。已视觉检查，保留原图。远端路径是可变的，本地快照作为本次设计依据。

### MISTLOOP

- 来源：[README](https://github.com/STDwang/mistloop/blob/main/README.md)。文件 SHA：`0fe705b055973ef17ba0eeb280bd03d7e4777c27`。
- 内容：Vite/Three.js、周期性程序化场景、状态机制、程序化音频；不能宣称为已有机器人或渲染引擎专业商业经验。
- README 演示地址：`https://stdwang.github.io/mistloop/`。本轮通过已配置代理打开页面并点击“进入林子”，取得初始运行截图；未验证完整玩法、声音、通关或大陆直连。
- 仓库 `.dream-loop/target-*.png` 是目标参考画面，未用作运行截图。本轮预览使用在线 Demo 初始运行画面，保存于 `code/public/images/mistloop.webp`。

### ImagePlayer

- 来源：[README](https://github.com/STDwang/ImagePlayer/blob/master/README.md)及简历“早期项目”。文件 SHA：`5767b29a37597467168e3baa22117a780b557464`。
- README 核验动态多视图、拖放缩放、位置同步和像素信息等。简历中较广的图像处理能力应在详情区分简历记录与公开仓库实现。
- README 自述 Public Domain，尚未完成仓库许可证文件核验。第一版统一使用“公开代码”，不加标准许可证徽章。

## 发布时核验

阶段二重新检查项目链接、截图路径和实际可运行范围；不能把本次 HTTP/README 核验视为永久有效。公开仓库许可证须检查实际文件；未核验许可的项目保留“公开代码”标签。私有仓库的代码、README、截图和仓库名不进入公开内容。
