import Link from "next/link";
import { Arrow } from "@/components/ui";
import { Contact } from "@/components/footer";
import { pageMeta, person } from "@/lib/site";
import { workProjects } from "@/content/projects";

export const metadata = pageMeta(
  "简历",
  "王帅鹏 C++ / 仿真平台工程师简历：四年商业软件研发经验、代表项目、核心技术与联系方式。",
  "/resume",
);
export default function Resume() {
  return (
    <main id="main" className="container">
      <div className="resume-top">
        <div className="page-intro">
          <p className="eyebrow accent">RESUME / WANG SHUAIPENG</p>
          <h1>王帅鹏</h1>
          <p>C++ / 仿真平台工程师 · 四年研发经验 · 上海</p>
          <div className="resume-contact">
            <a href="tel:13849489395">{person.phone}</a>
            <a href={`mailto:${person.email}`}>{person.email}</a>
          </div>
        </div>
        <a
          className="button primary"
          style={{ marginTop: 40 }}
          href={person.resume}
          download
        >
          下载 PDF 简历
          <Arrow />
        </a>
      </div>
      <article className="resume-sheet">
        <h2>职业概述</h2>
        <p>
          四年 C++/Qt 商业软件研发经验，长期参与 TESSNG
          核心产品迭代，覆盖路网建模、仿真计算、SQLite
          数据持久化、模型插件、桌面交互与二次开发接口。具备从需求拆解、架构设计、编码调试到兼容性处理、回归验证和发布交付的经验。
        </p>
        <h2>核心技术</h2>
        <dl className="skill-table">
          <dt>语言与基础</dt>
          <dd>C++17、STL、多线程、内存与对象生命周期、性能优化</dd>
          <dt>专业桌面软件</dt>
          <dd>
            Qt Widgets、QML / Qt Quick、Graphics View、Qt Network / SQL /
            Concurrent
          </dd>
          <dt>工程与数据</dt>
          <dd>
            CMake、Visual Studio、Qt Creator、Windows /
            Linux、SQLite、Git、版本打包发布
          </dd>
          <dt>业务与平台</dt>
          <dd>
            交通仿真、路网编辑、GIS / OSM、插件化模型、V2X、OpenDRIVE 数据链路
          </dd>
        </dl>
        <h2>工作经历</h2>
        <h3>上海济达交通科技有限公司</h3>
        <p>2022.09—2026.08 · C++ / Qt 研发工程师 · 核心产品研发</p>
        <ul>
          <li>
            跨
            UI、路网、数据库、仿真、模型与接口层开展研发、复杂问题定位和版本兼容处理。
          </li>
          <li>
            实现 OSM 在线地图接入、专业编辑交互、仿真结果输出和相关模型集成。
          </li>
          <li>
            参与多个版本发布，负责国际化版本的代码改造、翻译资源、安装包验证与交付。
          </li>
          <li>
            牵头中观仿真研发；主导以 AI
            辅助研发完成轨道交通和编辑图层模块，并负责审查、联调和验收。
          </li>
        </ul>
        <h2>代表项目</h2>
        {workProjects.map((p) => (
          <section key={p.slug}>
            <h3>
              <Link className="text-link" href={`/work/${p.slug}`}>
                {p.title}
                <Arrow />
              </Link>
            </h3>
            <p>{p.summary}</p>
            <p>
              {p.role}；{p.stack.join(" / ")}。
            </p>
          </section>
        ))}
        <h2>早期项目</h2>
        <p>
          卫星信号仿真软件：QML 组件、轨迹与频谱可视化、SQLite 检索；参与 MATLAB
          算法向 C++
          迁移。简历记录核心信号处理经并行与内存优化提升约五倍，未公开完整基准。
        </p>
        <p>ImagePlayer：Qt 多视图图像查看、缩放拖拽、像素信息与图像交互。</p>
        <h2>教育经历</h2>
        <p>同济大学浙江学院 · 计算机科学与技术 · 本科 · 2019—2023</p>
        <p className="boundary">
          网页为便于阅读的经历摘要。下载文件为当前提供的原版简历，DOCX/PDF
          的轻量修订安排在网站审阅后的阶段。
        </p>
      </article>
      <Contact />
    </main>
  );
}
