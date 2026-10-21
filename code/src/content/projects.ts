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
  imageAlt?: string;
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
      "商业项目案例依据个人简历整理。图为重新绘制的架构示意，不包含公司源码或实机界面；不将交通仿真经历描述为机器人商业研发经历。",
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
      "本案例依据简历整理，图层画面是概念结构示意。未公开公司代码或用户场景数据，也没有将编译验证等同于全部业务用例通过。",
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
      "牵头研发不等于独立完成所有算法。简历未提供性能基准、部署规模或算法精度，本页不补充未经验证的指标。示意图不表达实测数据。",
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
    slug: "dreamscape",
    category: "lab",
    title: "Dreamscape · 梦境废墟",
    eyebrow: "个人实验 / 程序化场景",
    summary: "程序化建模与场景生成的个人探索。",
    role: "AI 辅助的交互原型探索",
    stack: ["Godot", "Blender", "GDScript"],
    image: "/images/dreamscape.webp",
    imageAlt: "Dreamscape 实际游戏截图：猫骑士、绿植废墟与程序化场景",
    source: "https://github.com/STDwang/Dreamscape",
    demo: "https://dreamscape-cat.app.workbuddy.host/",
    demoNote: "外部体验 · 建议桌面浏览器",
    sections: [
      {
        title: "项目想法",
        paragraphs: [
          "一只穿盔甲的小猫骑士，在被绿植覆盖的废弃小镇中探索。这个实验将程序化角色、场景生成、运行时碰撞与交互组合成可运行的原型。",
        ],
      },
      {
        title: "实现路径",
        paragraphs: [
          "README 记录角色由 GDScript 程序化构建，场景由 Blender bpy 脚本生成并导出 GLB。角色具有眨眼、行走、披风和尾巴等程序动画，场景包含动态生态、雾效与水面表现。",
          "项目通过截图评审与迭代探索视觉效果。公开仓库保留代码和生成脚本，场景资源需要按说明生成，不能将仓库小体积理解为完整美术资源体积。",
        ],
      },
      {
        title: "可迁移的经验",
        paragraphs: [
          "重点在于把想法转成参数、状态、生成脚本和可运行场景，再通过实际画面反馈调整。这些是场景工具与交互原型的探索经验，不等同于机器人动力学或传感器仿真经验。",
        ],
      },
    ],
    boundary:
      "画面来自本人项目 README 引用的实机截图。外部站点由独立服务托管，可用性可能变化；README 的工具版本与功能描述以仓库当前记录为准。",
  },
  {
    slug: "mistloop",
    category: "lab",
    title: "MISTLOOP / 雾林回环",
    eyebrow: "个人实验 / 交互原型",
    summary: "Three.js、程序化场景、状态机制与声音交互。",
    role: "想法到可运行原型的 AI 辅助实践",
    stack: ["Three.js", "Vite", "WebGL 2", "程序化音频"],
    source: "https://github.com/STDwang/mistloop",
    demo: "https://stdwang.github.io/mistloop/",
    demoNote: "外部演示 · 本环境尚未完成可玩性验证",
    sections: [
      {
        title: "空间、状态与声音的联动",
        paragraphs: [
          "一个在浓雾森林中行走的第一人称短片游戏。README 描述了周期性场景、视线之外的状态机制，以及随距离变化的环境声与呼吸声。",
        ],
      },
      {
        title: "工程组织",
        paragraphs: [
          "以 Vite + Three.js 组织原型，设计文档、状态规则、数值配置和程序化音频相互对应。交付不仅包含可运行代码，也保留设计说明、任务拆分与 AI 编码上下文。",
          "周期地形和地标用于构建回环空间，雾控制可见距离，交互事件驱动状态和声音参数。它展示的是可解释的场景规则与交互设计。",
        ],
      },
      {
        title: "体验方式",
        paragraphs: [
          "建议在桌面、支持 WebGL 2 的浏览器中打开外部演示。游戏含恐怖氛围，音频应在用户主动点击后启动；本站不会自动加载该游戏或播放声音。",
          "仓库的目标参考图片不作为运行截图展示。外部演示地址取自 README，本环境尚未完成可玩性验证，因此同时保留源码入口。",
        ],
      },
    ],
    boundary:
      "个人游戏原型，不作为机器人仿真专业经历。此页使用原创空间示意，未用目标参考图冒充实机。",
  },
  {
    slug: "imageplayer",
    category: "lab",
    title: "ImagePlayer",
    eyebrow: "早期项目 / 图像工具",
    summary: "C++ / Qt 多视图图像工具与专业交互实践。",
    role: "图像查看与交互工具开发",
    stack: ["C++", "Qt", "图像交互"],
    source: "https://github.com/STDwang/ImagePlayer",
    sections: [
      {
        title: "多视图中的一致交互",
        paragraphs: [
          "基于 C++ / Qt 实现多视图图像查看工具。公开 README 列出动态布局、图像拖放、滚轮缩放、视图尺寸与位置同步、像素坐标和灰度值显示以及图片保存。",
        ],
      },
      {
        title: "从工具交互理解专业软件",
        paragraphs: [
          "简历还记录了 ROI 裁剪矫正、以鼠标为中心的缩放拖拽、鸟瞰图和 Plot Profile 等早期探索。这些内容属于个人项目经历，公开代码的具体覆盖范围以仓库实现为准。",
          "这个项目是我积累专业编辑器输入、图像显示与数据联动经验的起点之一，随后在交通仿真平台中继续处理更复杂的选择和显示问题。",
        ],
      },
    ],
    boundary:
      "README 自述 Public Domain，本站未独立完成许可证文件核验，统一标注公开代码；不借用 README 引用的第三方状态徽章证明项目构建状态。",
  },
];

export const workProjects = projects.filter((p) => p.category === "work");
export const labProjects = projects.filter((p) => p.category === "lab");
export const projectPath = (p: Project) => `/${p.category}/${p.slug}`;
