import dynamic from "next/dynamic";
import { asset } from "@/lib/asset";
import Image from "next/image";
import Link from "next/link";
import { pageMeta, person } from "@/lib/site";
import { workProjects, labProjects } from "@/content/projects";
import { SectionTitle, Arrow, TextLink } from "@/components/ui";
import { WorkCard, LabCard } from "@/components/projects";
import { ProjectRail } from "@/components/project-rail";
import { Contact } from "@/components/footer";

const SimulationPlayer = dynamic(
  () => import("@/components/simulation-player"),
);
export const metadata = pageMeta(
  "C++ / 仿真平台工程师",
  "四年 C++/Qt 商业交通仿真研发：轨道模块、专业编辑器、微中观协同。关注机器人与智驾仿真工具链。",
  "/",
);

export default function Home() {
  return (
    <main id="main" className="container home-page">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow hero-kicker">
            <span className="status-dot" /> C++ ENGINEER · SIMULATION & TOOLS
          </p>
          <p className="hero-identity">
            你好，我是王帅鹏 <span>/ STDwang</span>
          </p>
          <h1 id="hero-title">
            C++ / 仿真平台
            <br />
            <span>工程师。</span>
          </h1>
          <p className="hero-intro">
            <strong>四年商业交通仿真平台研发。</strong>
            <br />
            做过轨道模块、专业编辑器与微中观协同。
            <br />
            下一站，关注机器人与智驾仿真工具链。
          </p>
          <div className="hero-actions">
            <Link className="button primary" href="/work">
              查看工程案例
              <Arrow />
            </Link>
            <a className="button" href={person.resume} download>
              下载简历
              <Arrow />
            </a>
          </div>
          <div className="hero-social">
            <a href={person.github} target="_blank" rel="noreferrer">
              GitHub ↗
            </a>
            <a href={person.blog} target="_blank" rel="noreferrer">
              技术博客 ↗
            </a>
            <a href="#contact-title">联系我 ↓</a>
          </div>
        </div>
        <div className="hero-evidence">
          <div className="window-bar">
            <span className="window-dots">
              <i />
              <i />
              <i />
            </span>
            <span className="mono">EXPERIENCE / TESS NG</span>
            <span className="window-state">本人负责模块 · 实际截图</span>
          </div>
          <div className="hero-product-image">
            <Image
              src={asset("/images/rail-transit.webp")}
              width={1600}
              height={900}
              alt="本人负责的 TESS NG 轨道交通模块：轨道、站台与列车"
              preload
              sizes="(max-width: 767px) 90vw, 55vw"
            />
          </div>
          <div className="hero-product-info">
            <span className="mono accent">4 YEARS / C++ · Qt</span>
            <h2>从编辑建模，到仿真运行。</h2>
            <p>我负责的部分：业务模块接入、复杂交互、数据链路与回归验证。</p>
          </div>
          <p className="hero-source">
            本人提供 · 轨道交通模块运行截图 · <Link href="/work/rail-transit">查看我的职责 ↗</Link>
          </p>
        </div>
      </section>

      <div className="proof-strip" aria-label="核心经验与案例入口">
        <Link href="/about">
          <strong>
            04<span>年</span>
          </strong>
          <div>
            <b>商业仿真研发</b>
            <p>C++ / Qt · TESSNG 核心产品</p>
          </div>
          <Arrow />
        </Link>
        <Link href="/work/rail-transit">
          <strong>
            25<span>项</span>
          </strong>
          <div>
            <b>轨道模块回归用例</b>
            <p>UI、数据、运行与 Release 稳定性</p>
          </div>
          <Arrow />
        </Link>
        <Link href="/work/micro-meso">
          <strong>
            跨<span>尺度</span>
          </strong>
          <div>
            <b>微观 / 中观协同</b>
            <p>路网转换、OD 与评价链路</p>
          </div>
          <Arrow />
        </Link>
      </div>

      <section
        id="selected-work"
        className="section showcase-section"
        aria-labelledby="engineering-title"
      >
        <SectionTitle
          number="01"
          label="SELECTED WORK"
          title="商业仿真里，我具体做了什么。"
          href="/work"
          action="全部工程案例"
          id="engineering-title"
        />
        <p className="section-intro">
          四个案例：轨道交通、复杂对象拾取、排放可视化，以及微中观协同。
        </p>
        <ProjectRail label="工程案例">
          {workProjects.map((p) => (
            <WorkCard key={p.slug} project={p} />
          ))}
        </ProjectRail>
        <p className="section-footnote">
          画面由本人提供，对应负责的模块；保留产品水印，个人职责与验证边界见各案例。
        </p>
      </section>

      <section
        id="personal-lab"
        className="section showcase-section"
        aria-labelledby="lab-title"
      >
        <SectionTitle
          number="02"
          label="PERSONAL LAB"
          title="不止写代码，也把想法做成作品。"
          href="/lab"
          action="全部个人项目"
          id="lab-title"
        />
        <p className="section-intro">
          C++
          性能可视化是主线，场景生成与交互原型是探索。每个作品都保留实现范围和源码入口。
        </p>
        <ProjectRail label="个人作品">
          {labProjects.map((p) => (
            <LabCard key={p.slug} project={p} />
          ))}
        </ProjectRail>
      </section>

      <section
        id="interactive-demo"
        className="section demo-section"
        aria-labelledby="demo-title"
      >
        <div className="demo-copy">
          <p className="eyebrow accent">03 / INTERACTIVE SKETCH</p>
          <h2 id="demo-title">
            仿真，先让状态
            <br />
            变得可观察。
          </h2>
          <p>
            选择车辆、拖动时间轴，查看轨迹如何随时间变化。这是本站的轻量交互示意，不是商业项目实测结果。
          </p>
          <div className="tech-tags">
            <span>SVG</span>
            <span>固定演示数据</span>
            <span>键盘可操作</span>
          </div>
          <TextLink href="/work/rail-transit">了解真实工程案例</TextLink>
        </div>
        <SimulationPlayer />
      </section>

      <section
        className="section experience-section"
        aria-labelledby="about-title"
      >
        <SectionTitle
          number="04"
          label="ABOUT & NEXT"
          title="让复杂系统可建模、可运行、可验证。"
          id="about-title"
        />
        <div className="about-summary">
          <div className="profile-terminal">
            <div className="window-bar">
              <span className="window-dots">
                <i />
                <i />
                <i />
              </span>
              <span className="mono">profile.ts</span>
            </div>
            <pre>
              <code>
                <span className="terminal-comment">// 从已验证的经验出发</span>
                {"\n"}
                <span className="accent">const</span>
                {" engineer = {\n  name: "}
                <span className="terminal-string">&quot;王帅鹏&quot;</span>
                {",\n  experience: "}
                <span className="terminal-string">
                  &quot;C++ / Qt 商业仿真&quot;
                </span>
                {",\n  focus: ["}
                <span className="terminal-string">
                  &quot;建模&quot;, &quot;交互&quot;, &quot;验证&quot;
                </span>
                {"],\n  next: "}
                <span className="terminal-string">
                  &quot;机器人 / 智驾仿真工具链&quot;
                </span>
                {"\n};"}
              </code>
            </pre>
          </div>
          <div className="about-summary-copy">
            <p className="eyebrow accent">2022.09 — 2026.08</p>
            <h3>上海济达交通科技有限公司</h3>
            <p>
              C++ / Qt
              研发工程师。工作从专业编辑器延伸到业务模块架构、仿真数据链路和跨模块交付。
            </p>
            <p>
              下一步，希望把成熟平台的架构、交互与验证经验，延伸到机器人与智驾的场景工具和仿真数据链路。
            </p>
            <TextLink href="/about">关于我与完整经历</TextLink>
          </div>
        </div>
      </section>
      <Contact />
    </main>
  );
}
