import { Contact } from "@/components/footer";
import { TextLink } from "@/components/ui";
import { pageMeta, person } from "@/lib/site";

export const metadata = pageMeta(
  "关于我",
  "王帅鹏：四年 C++/Qt 商业仿真平台研发，跨模块交付、工程质量与个人项目实践。",
  "/about",
);
export default function About() {
  return (
    <main id="main" className="container">
      <div className="page-intro">
        <p className="eyebrow accent">ABOUT / EXPERIENCE & NEXT</p>
        <h1>
          从交通仿真出发，
          <br />
          继续深入智能系统。
        </h1>
        <p>
          我是王帅鹏，一名 C++ /
          仿真平台工程师。过去四年，我围绕商业交通仿真平台，处理建模、专业交互、数据与仿真运行之间的工程问题。
        </p>
      </div>
      <div className="about-layout">
        <div className="prose">
          <section>
            <h2>在复杂产品中建立完整视角</h2>
            <p>
              2022.09—2026.08，在上海济达交通科技有限公司参与 TESSNG
              核心产品研发。工作贯穿
              UI、路网、数据库、仿真、模型和二次开发接口，涵盖 OSM
              在线地图、专业编辑交互、统计输出、插件模型和版本交付。
            </p>
            <p>
              除模块研发外，也参与多版本打包发布与国际化交付。在跨模块定位问题时，我逐渐形成了从业务对象、数据关系到界面行为和运行结果的完整排查路径。
            </p>
          </section>
          <section>
            <h2>把架构选择落到验证上</h2>
            <p>
              在轨道交通模块与编辑图层系统中，使用 AI
              辅助研发，由我负责需求拆分、架构设计、代码审查、联调与验收。工具可以加快实现，工程判断需要通过数据一致性、生命周期和回归结果来验证。
            </p>
            <p>
              在中观仿真研发中，牵头并与一名同事合作，负责总体架构、任务拆分和关键模块交付，进一步积累接口复用、模型尺度协同与结果分析经验。
            </p>
          </section>
          <section>
            <h2>用公开作品继续练习</h2>
            <p>
              近期通过 GPUView
              研究可视化工具中的索引、LOD、异步快照和交互性能，也用 Dreamscape
              与 MISTLOOP 探索程序化场景和 AI
              辅助原型开发。作品中的完成范围和测量条件，都尽量通过代码与文档留下可追溯记录。
            </p>
          </section>
          <section>
            <h2>下一份工作希望深入什么</h2>
            <p>
              关注机器人、智驾和无人系统中的仿真平台、场景工具、专业可视化、数据回放与验证工具链。希望继续发挥
              C++ 系统开发和仿真业务经验，同时补齐新领域的中间件与仿真平台实践。
            </p>
            <p>
              已有经验主要来自交通仿真和工程软件；机器人动力学、传感器仿真等方向仍需要专门实践，我不会将职业目标写成已经完成的工作。
            </p>
          </section>
        </div>
        <aside className="about-aside">
          <p className="eyebrow accent">AT A GLANCE</p>
          <h2>C++ / 仿真平台工程师</h2>
          <p>
            交通仿真 · 专业编辑器 · 跨模块交付
            <br />
            C++17 · Qt / QML · SQLite
            <br />
            多线程 · 性能 · 生命周期 · 兼容性
          </p>
          <TextLink href="/resume">查看简历</TextLink>
          <hr />
          <h2>学习与积累</h2>
          <p>
            同济大学浙江学院
            <br />
            计算机科学与技术 · 本科
            <br />
            2019—2023
          </p>
          <TextLink href={person.github} external>
            公开项目 / GitHub
          </TextLink>
          <br />
          <TextLink href={person.blog} external>
            历史技术文章 / CSDN
          </TextLink>
        </aside>
      </div>
      <Contact />
    </main>
  );
}
