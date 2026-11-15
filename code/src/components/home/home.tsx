import Link from "next/link";
import { workProjects, labProjects, projectPath } from "@/content/projects";
import { games, playUrl } from "@/content/games";
import { person } from "@/lib/site";
import { asset } from "@/lib/asset";
import { Arrow } from "../ui";
import { HomeHero } from "./home-hero";
import { HomeWork } from "./home-work";
import { HomeArcade } from "./home-arcade";

function SectionHead({ id, index, kicker, title, tail, href, action }: {
  id: string;
  index: string;
  kicker: string;
  title: string;
  tail: string;
  href: string;
  action: string;
}) {
  return (
    <header className="hm-head" data-reveal>
      <span className="hm-head-num" aria-hidden="true">{index}</span>
      <div>
        <p className="future-overline">{index} <span>/</span> {kicker}</p>
        <h2 id={id}>{title}<span>{tail}</span></h2>
      </div>
      <Link className="text-link" href={href}>{action} <Arrow /></Link>
    </header>
  );
}

const labAccents = ["blue", "green", "pink", "yellow"];

export function Home() {
  return (
    <main id="main" className="hm">
      <HomeHero gameCount={games.length} />

      <section id="work" className="hm-section container" aria-labelledby="hm-work-title">
        <SectionHead id="hm-work-title" index="01" kicker="SELECTED ENGINEERING" title="工作成果" tail="，从问题到交付。" href="/work" action="查看全部工程案例" />
        <HomeWork projects={workProjects} />
      </section>

      <section id="lab" className="hm-section container" aria-labelledby="hm-lab-title">
        <SectionHead id="hm-lab-title" index="02" kicker="PERSONAL LAB" title="个人项目" tail="，把想法做成作品。" href="/lab" action="查看全部个人项目" />
        <div className="hm-lab" data-reveal-group>
          {labProjects.map((project, index) => (
            <article className="hm-lab-card" data-accent={labAccents[index % labAccents.length]} data-reveal key={project.slug}>
              <div className="hm-lab-top mono"><span>LAB.{String(index + 1).padStart(2, "0")}</span><span>{project.eyebrow}</span></div>
              {project.image ? (
                <div className="hm-lab-media">
                  <img src={asset(project.image)} alt={project.imageAlt || project.title} width={project.imageSize?.[0] ?? 1600} height={project.imageSize?.[1] ?? 900} loading="lazy" />
                </div>
              ) : null}
              <div className="hm-lab-copy">
                <h3><Link href={projectPath(project)}>{project.title}</Link></h3>
                <p>{project.summary}</p>
                <p className="hm-lab-tags mono">{project.stack.slice(0, 3).map((item) => <span key={item}>{item}</span>)}</p>
                <div className="hm-lab-links">
                  <span className="hm-lab-more" aria-hidden="true">项目详情 <Arrow /></span>
                  {project.source ? <a href={project.source} target="_blank" rel="noreferrer">源码 ↗</a> : null}
                  {project.demo ? <a className="is-demo" href={project.demo} target="_blank" rel="noreferrer">{project.demoLabel || "试玩"} ↗</a> : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="games" className="hm-arcade" aria-labelledby="hm-games-title">
        <div className="container">
          <SectionHead id="hm-games-title" index="03" kicker="GAME ARCADE" title="游戏橱窗" tail="，打开就能玩。" href="/games" action={`全部 ${games.length} 款游戏档案`} />
          <HomeArcade games={games} />
          <noscript>
            <div className="hm-noscript">
              {games.map((game) => <a key={game.slug} href={playUrl(game)}>{game.title} ↗</a>)}
            </div>
          </noscript>
        </div>
      </section>

      <section id="contact" className="hm-section hm-contact container" aria-labelledby="hm-contact-title">
        <div className="hm-contact-card" data-reveal>
          <p className="future-overline">04 <span>/</span> ABOUT &amp; CONTACT</p>
          <h2 id="hm-contact-title">为复杂系统，<br /><em>找到可靠的表达。</em></h2>
          <p>我从交通仿真平台出发，长期处理业务对象、数据关系、专业交互与运行结果之间的工程问题。下一步，关注机器人、智驾与无人系统的仿真工具链。</p>
          <div className="hm-actions">
            <Link className="button hm-dark" href="/about">阅读完整经历 <Arrow /></Link>
            <Link className="button" href="/resume">查看网页简历 <Arrow /></Link>
          </div>
          <span className="hm-contact-mark" aria-hidden="true">✳</span>
        </div>
        <div className="hm-contact-grid" data-reveal-group>
          <div data-reveal><span className="mono">CURRENT PRACTICE</span><strong>C++ / Qt · 仿真平台 · 专业可视化</strong></div>
          <div data-reveal><span className="mono">NEXT DIRECTION</span><strong>机器人 / 智驾仿真工具链</strong></div>
          <div data-reveal>
            <span className="mono">GET IN TOUCH</span>
            <a href={`mailto:${person.email}`}>{person.email} ↗</a>
            <a href={person.github} target="_blank" rel="noreferrer">GitHub ↗</a>
            <a href={person.blog} target="_blank" rel="noreferrer">技术博客 ↗</a>
          </div>
        </div>
      </section>
    </main>
  );
}
