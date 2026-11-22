export type Project = {
  slug: string;
  category: "work" | "lab";
  title: string;
  eyebrow: string;
  summary: string;
  role: string;
  stack: string[];
  diagram?: "rail" | "layers" | "meso";
  image?: string;
  imageSize?: [number, number];
  imageAlt?: string;
  imageCaption?: string;
  imageSource?: string;
  imageSourceLabel?: string;
  screenshots?: { image: string; alt: string; caption: string }[];
  outcome: string;
  focus: string;
  demoLabel?: string;
  source?: string;
  demo?: string;
  demoNote?: string;
  sections: { title: string; paragraphs: string[]; points?: string[] }[];
  boundary: string;
};

export const projects: Project[] = [
  {
    slug: "rail-transit",
    category: "work",
    title: "轨道交通仿真模块",
    eyebrow: "核心产品研发 / 2026",
    summary:
      "从线路与站台建模，到列车运行与结果输出，打通插件化模块的完整仿真闭环。",
    role: "架构拆分 · 核心研发 · 联调验收",
    stack: ["C++", "Qt", "SQLite", "状态机"],
    diagram: "rail",
    image: "/images/rail-transit.webp",
    imageSize: [1600, 900],
    imageAlt: "TESS NG 轨道交通模块：三组站台、到发线与列车运行画面",
    imageCaption: "本人提供 · 轨道交通模块实际截图 · 已裁去本地路径",
    outcome: "建模 → 保存重开 → 运行 → 结果输出",
    focus: "核心研发 / 25 项回归用例",
    sections: [
      {
        title: "问题：让新业务接入已有平台",
        paragraphs: [
          "在 TESSNG 既有路网、图形、数据库与仿真体系中新增轨道交通能力，需要让轨道、连接、站台、线路和列车保持一致的业务身份，并完成建模到仿真的闭环。",
          "我的工作覆盖需求拆分、GUI / Net / Simu / Data / Graphics 架构设计、核心研发、跨模块联调与验收。研发中使用 AI 辅助编码，由我负责上下文组织、生成结果审查和最终验证。",
        ],
      },
      {
        title: "设计：将对象与运行过程分开",
        paragraphs: [
          "建模层组织轨道、站台和线路关系；数据层处理保存与加载；仿真层处理列车按时刻发车、运行、停靠和结果输出。显示层表达业务对象，避免将运行状态只存放在图形对象里。",
        ],
        points: [
          "线路单向自动补全，减少重复配置。",
          "站台与到发线联动，保持业务关系一致。",
          "删除级联覆盖关联对象，保存重开验证持久化闭环。",
        ],
      },
      {
        title: "难点：生命周期与 Release 稳定性",
        paragraphs: [
          "对象的删除会同时影响业务关系、数据库和图形显示。针对删除级联、图形对象生命周期以及 Release 模式的悬空引用问题，重点检查引用持有和释放顺序，再做跨模块回归。",
          "这一过程积累了将新业务模型接入成熟平台的经验，也让我更关注仿真系统中对象身份、状态转换和验证路径的设计。",
        ],
      },
      {
        title: "验证与交付",
        paragraphs: [
          "据项目简历记录，建立了 25 项测试用例与回归矩阵，覆盖 UI、数据一致性、删除联动、保存重开、仿真和 Release 稳定性，并形成使用说明与验收标准。",
        ],
        points: [
          "建模 → 保存 → 重开：检查对象与关系一致。",
          "运行 → 停靠 → 输出：检查状态转换与结果。",
          "删除与重建：检查级联关系和引用有效性。",
        ],
      },
    ],
    boundary:
      "个人职责与 25 项测试依据简历整理。截图由本人提供，对应负责的轨道交通模块，不代表整套 TESS NG 产品由我独立完成。已裁去标题栏本地路径及多余空白；结构图为原创示意，不包含公司源码。",
  },
  {
    slug: "layers-picking",
    category: "work",
    title: "编辑图层与复杂场景拾取",
    eyebrow: "编辑系统 / 2026",
    summary: "在层级、持久化与重叠对象之间，保持一致的交互语义。",
    role: "架构设计 · 交互实现 · 跨模块验证",
    stack: ["Qt Graphics View", "C++", "SQLite", "交互架构"],
    diagram: "layers",
    image: "/images/layers-picking.webp",
    imageSize: [1600, 900],
    imageAlt: "复杂交叉口中的连接段候选菜单、图层信息与选中高亮",
    imageCaption: "本人提供 · 复杂场景拾取实际截图 · 保留候选菜单与高亮",
    outcome: "稳定对象身份，贯通层级、选择与保存恢复",
    focus: "交互架构 / 类型 + ID",
    sections: [
      {
        title: "问题：重叠对象中的选择意图",
        paragraphs: [
          "复杂路网中，同一屏幕位置可能有车道、连接段、检测器、信号设施等多种对象。仅按绘制顺序选择，往往不能对应用户真正想编辑的对象；同时，图层的显示与可选状态需要沿父子层级保持一致。",
        ],
      },
      {
        title: "设计：四层职责与稳定对象身份",
        paragraphs: [
          "将系统拆分为业务层、对象映射层、显示拾取层与数据库层。以“对象类型 + ID”持久化图层成员，减少显示对象地址与业务身份耦合。",
        ],
        points: [
          "支持父子图层、显示/可选继承及批量归层。",
          "保存恢复以稳定身份重建映射关系。",
          "兼容路段、车道及组合对象，保留已有楼层和仿真逻辑。",
        ],
      },
      {
        title: "交互：候选排序与状态恢复",
        paragraphs: [
          "综合真实命中、屏幕面积、鼠标距离和图层优先级组织候选对象，使用 Alt 候选菜单与悬停高亮解释选择结果。",
          "临时拖动状态在交互结束后恢复，避免一次选择操作永久改变对象的行为。研发重点覆盖对象删除、图层迁移、父子状态改变及重开场景。",
        ],
      },
      {
        title: "验证与结果",
        paragraphs: [
          "据简历记录，完成 DB / NET / WIN 模块编译验证，覆盖保存恢复、层级继承和复杂选择流程。通过统一对象映射和拾取路径，使新增图层能力与既有编辑器共存。",
        ],
      },
    ],
    boundary:
      "职责依据简历整理，截图由本人提供，展示负责的复杂场景拾取交互；四层结构图为原创示意。标题栏路径与底部桌面浮层已裁去，未公开内部代码；不将编译验证等同于全部业务用例通过。",
  },
  {
    slug: "emissions",
    category: "work",
    title: "排放模块与结果可视化",
    eyebrow: "仿真业务 / 排放分析",
    summary: "让仿真过程中的排放信息，同时呈现在空间热力图与实时图表中。",
    role: "排放模块研发 · 结果可视化集成",
    stack: ["C++", "Qt", "热力图", "实时图表"],
    image: "/images/emissions.webp",
    imageSize: [1600, 900],
    imageAlt: "TESS NG 排放模块：路口排放热力图与 CO、CO2、NOx、PM2.5 实时曲线",
    imageCaption: "本人提供 · 排放模块实际截图 · 热力图与实时图表",
    outcome: "仿真运行 → 空间分布 → 排放曲线",
    focus: "业务模块 / 结果可观察性",
    sections: [
      {
        title: "问题：把仿真结果变得可观察",
        paragraphs: [
          "排放信息既有空间分布，也随仿真时间变化。仅展示单一结果难以同时观察路口热点和时间趋势，需要让地图中的热力图与实时图表共同表达当前仿真过程。",
        ],
      },
      {
        title: "我的工作与界面证据",
        paragraphs: [
          "负责排放模块研发与结果可视化集成。提供的实际运行截图展示了路网热力图、实时排放图表，以及新增排放和累计排放切换入口。",
          "画面中可见 CO、CO2、NOx、PM2.5 等曲线。这些画面用于说明模块的结果展示方式，不据此推断模型精度、性能提升或实际减排效果。",
        ],
      },
      {
        title: "展示范围与验证口径",
        paragraphs: [
          "当前展示依据为本人提供的模块运行截图。本页不补写未经确认的排放算法、标定方法、测试规模或量化收益；模型方法与数据口径应在具体业务场景中单独说明。",
        ],
      },
    ],
    boundary: "截图由本人提供，展示负责的排放模块，不代表独立完成整个交通仿真平台或所有排放算法。标题栏本地路径已裁去；曲线为界面示例，不作为精度评估、环境监测结论或减排效果证明。",
  },
  {
    slug: "micro-meso",
    category: "work",
    title: "中观仿真与微中观协同",
    eyebrow: "多尺度仿真 / 2024—2026",
    summary: "围绕路网转换、OD 需求与结果评价，设计可复用接口。",
    role: "总体架构 · 任务拆分 · 关键模块交付",
    stack: ["C++", "Python", "SQLite", "TessInterfaces"],
    diagram: "meso",
    image: "/images/micro-meso.webp",
    imageSize: [1600, 900],
    imageAlt: "TESS MESO 中观仿真实际界面：区域路网、交通状态颜色与图层面板",
    imageCaption: "本人提供 · TESS MESO 实际截图 · 保留济达交通水印",
    outcome: "路网转换 → OD 需求 → 结果评价",
    focus: "协同交付 / 接口复用",
    sections: [
      {
        title: "问题：不同仿真尺度之间的数据链路",
        paragraphs: [
          "微观与中观模型在路网表达、需求组织和结果评价上具有不同粒度。协同研发需要处理路网转换、OD 需求与输出指标的接口边界，而不只是在两个系统之间复制数据。",
        ],
      },
      {
        title: "我的职责与协作",
        paragraphs: [
          "牵头并与一名同事共同开发独立中观仿真软件，负责总体架构、任务拆分与关键模块交付。设计复用 TessInterfaces 的微中观协同接口，组织微观路网转中观、OD 需求和结果评价链路。",
        ],
      },
      {
        title: "设计：围绕转换和评价定义边界",
        paragraphs: [
          "优先复用已有接口，明确不同尺度下的输入输出含义。围绕大规模 OD 矩阵和路网数据处理，推进瓶颈分析、宏观基本图、路径行程时间/速度及车辆轨迹聚合。",
        ],
        points: [
          "路网转换：整理微观到中观对象关系。",
          "需求组织：处理 OD 需求与网络数据。",
          "评价输出：将轨迹和路径结果用于分析。",
        ],
      },
      {
        title: "经验与下一步",
        paragraphs: [
          "这段经历让我从单模块开发走向总体架构和协同交付，也加深了对模型粒度、接口复用与可解释指标的关注。希望将这些经验延伸到机器人与智驾仿真平台的数据链路和验证工具中。",
        ],
      },
    ],
    boundary:
      "牵头研发不等于独立完成所有算法。图为本人提供的 TESS MESO 中观软件实际截图，保留济达交通水印，裁去标题栏本地路径。简历未提供性能基准、部署规模或算法精度，本页不从路网画面推断这些指标。",
  },
  {
    slug: "gpuview",
    category: "lab",
    title: "GPUView",
    eyebrow: "公开代码 / 性能可视化",
    summary: "百万教学事件时间线、精确选区统计与异步快照。",
    role: "个人学习与工程实践项目",
    stack: ["C++17", "Qt 6", "区间索引", "LOD"],
    image: "/images/gpuview.webp",
    imageAlt: "GPUView 实际界面：多轨道教学事件时间线与统计侧栏",
    source: "https://github.com/STDwang/GPUView",
    outcome: "区间索引 + LOD + 不可变异步快照",
    focus: "C++ 工程实践 / 教学分析工具",
    sections: [
      {
        title: "从问题到可复现的工具",
        paragraphs: [
          "围绕 Qt 性能可视化问题构建一个可阅读、可测量的分析演示工具。当前公开版本包含百万教学事件时间线、事件搜索、精确选区统计，以及 PresentMon v1 CSV 的真实帧导入和长帧定位。",
        ],
      },
      {
        title: "核心设计",
        paragraphs: [
          "纯 C++ core 管理紧凑事件结构和每轨道区间索引，Widgets 负责绘制与输入，适配器处理文件格式。后台构建只读快照，使用请求代次、协作取消和待办合并处理快速交互。",
        ],
        points: [
          "QPainter 自绘、屏幕外裁剪、密集视口 LOD；不为每条事件创建 QObject。",
          "shared_ptr<const TraceStore> 快照保证读取期间的数据有效性。",
          "精确统计与视觉聚合分开，避免用显示采样结果计算统计。",
        ],
      },
      {
        title: "测量：只在明确口径下谈收益",
        paragraphs: [
          "2026-09-17 首轮 Release 基准使用固定 seed、64 轨道和百万合成事件。100 次窄区间查询的总耗时中位数为 189.406ms（朴素扫描）与 2.7329ms（索引），两种方法校验命中数量一致。",
          "环境为 Windows x64、i7-12700H、约 16GB RAM、Qt 6.8.3、MSVC 19.31。该结果只反映本机这组查询负载；不代表端到端加载、交互 P95 或屏幕帧率。原始 CSV 与复现方法见仓库 benchmarks/reports/BASELINE.md。",
        ],
      },
      {
        title: "已有验证与功能边界",
        paragraphs: [
          "README 2026-10-01 记录 Debug/Release 通过 73 个实际用例。时间线教学轨道为模拟数据；真实数据路径使用 PresentMon v1 指定字段格式。",
          "尚未实现真实 Kernel、指令或调用栈分析，也未完成完整遥测、回放与 Qt Quick 对照。架构文档中的目标设计需与 README 当前实现区分。",
        ],
      },
    ],
    boundary:
      "教学分析工具，与微软同名 GPUView 无隶属关系，不是完整 GPU Profiler。项目说明依据公开 README 与基准文档整理；公开代码不自动代表已核验开源许可证。",
  },


  {
    slug: "imageplayer",
    category: "lab",
    title: "ImagePlayer",
    eyebrow: "早期项目 / 图像工具",
    summary: "多视图对比、图像取反与鸟瞰导航，让图像处理前后的差异直观可见。",
    role: "图像查看与交互工具开发",
    stack: ["C++11", "Qt Quick / QML", "QImage", "QCustomPlot"],
    image: "/images/imageplayer.webp",
    imageSize: [1600, 900],
    imageAlt: "ImagePlayer 实际界面：玩偶照片原图与取反结果的双视图对比、鸟瞰缩略图",
    imageCaption: "本人提供 · 实际运行截图 · 本地路径已遮盖，原图水印保留",
    screenshots: [
      {
        image: "/images/imageplayer-photo.webp",
        alt: "ImagePlayer 双视图显示摄影原图和取反结果，每个视图带鸟瞰缩略图",
        caption: "摄影示例 · 原图与取反结果对照，保留鸟瞰图及像素状态栏。",
      },
      {
        image: "/images/imageplayer-medical.webp",
        alt: "ImagePlayer 显示网上示例牙片与取反结果，附带文字信息已遮盖",
        caption: "网上示例牙片 · 用户提供；仅展示图像取反，不用于医疗诊断。路径及影像内文字已遮盖。",
      },
    ],
    source: "https://github.com/STDwang/ImagePlayer",
    outcome: "动态布局 → 拖放缩放 → 取反对比 → 像素查看",
    focus: "C++ / Qt / 早期项目",
    sections: [
      {
        title: "多视图中的一致交互",
        paragraphs: [
          "基于 C++ / Qt Quick 实现多视图图像查看工具。QML 组织动态布局、拖放和以鼠标位置为中心的缩放；鸟瞰图显示当前视野，底部状态栏反馈像素坐标与数值。",
          "本页三张画面均为本人提供的运行截图，展示玩偶、摄影与网上示例牙片的原图/取反对照。普通彩色图像的像素数值当前取红色通道，不表述为所有格式的通用灰度测量。",
        ],
      },
      {
        title: "从工具交互理解专业软件",
        paragraphs: [
          "C++ 图像处理经信号槽与 QML 界面联动，提供图像读取、保存、取反和直方图数据。截图来自本地工作版，普通图片取反修复尚未合入公开默认分支；代码包含 RAW 8/16 位处理及 RAW 自动亮度路径。去噪入口尚未接通后端，不列为已实现功能。",
          "这个项目是我积累专业编辑器输入、图像显示与数据联动经验的起点之一，随后在交通仿真平台中继续处理更复杂的选择和显示问题。",
        ],
      },
    ],
    boundary:
      "早期个人图像工具，非医疗诊断软件。示例图片由本人提供，牙片据本人说明来自网上；本地路径与影像内文字已遮盖，玩偶图片原水印保留。图像素材不包含在代码的再授权承诺中；未核验统一许可证，标注为公开代码，不用第三方徽章证明构建状态。",
  },
  {
    slug: "deep-sea-garden",
    category: "lab",
    title: "深海花园",
    eyebrow: "个人实验 / WebGPU",
    summary: "一片完全由代码实时生成的海底世界，没有一张贴图和一个模型文件。",
    role: "AI 辅助的交互原型探索",
    stack: ["WebGPU", "WGSL", "WebAudio", "JavaScript"],
    image: "/images/deep-sea-garden.webp",
    imageAlt: "深海花园：阳光穿过海藻森林照进海底峡谷的实际运行画面",
    source: "https://github.com/STDwang/Deep_Sea_Garden",
    demo: "https://stdwang.github.io/deep-sea-garden/",
    demoLabel: "在线试玩",
    demoNote: "需桌面版 Chrome / Edge（WebGPU）；含外海测绘任务与海底日志。国内备用入口见游戏橱窗。",
    outcome: "GPU 计算着色器雕刻海床 → 程序化生态 → 可交互潜航",
    focus: "WebGPU 实时生成 / 个人原型",
    sections: [
      {
        title: "从一条鱼到一个海底世界",
        paragraphs: [
          "这是一次纯 GPU 程序化生成的探索：海床峡谷、拱门与洞窟由密度场雕刻，海藻、珊瑚、鱼群和蝠鲼在同一套计算着色器里生成，画面里没有一张贴图、也没有一个模型文件。",
          "项目以 WebGPU 直接绘制，音景由 Web Audio API 实时合成；潜航、声呐、观景切换与摄影都可在浏览器里完成。",
        ],
      },
      {
        title: "从场景到可完成的任务",
        paragraphs: [
          "早期版本只有六个固定机位触发记录，地点之间缺少持续目标。后来在东部划出航道、加入单拱与双拱地标，可游半径从 150 米扩大到 174 米，并加入一条可完成、可保存的外海测绘任务：用声呐定位潮门与双环测站采样，再返回石鲸尾归档。",
          "海底日志会在到达观景位置时自动记录，菜单可查阅六处地点与游览线索，记录保存在浏览器本地。",
        ],
      },
      {
        title: "可迁移的经验",
        paragraphs: [
          "重点在于把视觉想法转成密度场、生成脚本、碰撞与状态规则，再通过实际画面和试玩反馈迭代。这些是实时图形与交互原型的探索经验，不等同于机器人或传感器仿真经验。",
        ],
      },
    ],
    boundary:
      "画面来自本人项目在浏览器中的实际运行截图。线上演示需要设备支持 WebGPU，桌面 Chrome / Edge 体验最佳；小红书小工具版本依赖宿主 WebView 的 WebGPU 支持，发布前需在目标设备检查启动耗时与稳定性。",
  },
];

export const workProjects = projects.filter((p) => p.category === "work");
export const labProjects = projects.filter((p) => p.category === "lab");
export const projectPath = (p: Project) => `/${p.category}/${p.slug}`;
