"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { workProjects, labProjects } from "@/content/projects";
import { person } from "@/lib/site";
import { asset } from "@/lib/asset";
import { Arrow } from "./ui";
import { FeatureCarousel } from "./feature-carousel";

const stages = [
  { id: "intro" },
  { id: "work" },
  { id: "lab" },
  { id: "contact" },
];

const sceneFrames = [
  "/images/white-studio-intro.png",
  "/images/white-studio-glasses.png",
  "/images/white-studio-watch.png",
  "/images/white-studio-headset.png",
  "/images/white-studio-present.png",
];
const darkSceneFrames = sceneFrames.map((frame) => frame.replace("white-studio", "dark-studio"));

// Camera stations. Each one moves the background camera onto one of the
// devices the character wears and reveals the matching section of the site.
const stations = [
  { id: "intro", index: 0, kicker: "PANORAMA", label: "全景", note: "人物与场景的整体建立" },
  { id: "work", index: 1, kicker: "OPTICAL DISPLAY", label: "眼镜视野", note: "工程案例在镜片上展开" },
  { id: "lab", index: 2, kicker: "WRIST DISPLAY", label: "腕表界面", note: "个人项目在表盘上展开" },
  { id: "contact", index: 3, kicker: "SPATIAL PROJECTION", label: "耳机投影", note: "经历与联系在投影上展开" },
];

// The compact summary that sits on the device surface itself.
const deviceCards: Record<number, { kicker: string; title: string; line: string; metric: string }> = {
  1: {
    kicker: "OPTICAL DISPLAY / 01",
    title: "工作成果",
    line: "轨道模块 · 专业编辑器 · 排放可视化 · 微中观协同",
    metric: "04 CASES",
  },
  2: {
    kicker: "WRIST DISPLAY / 02",
    title: "个人项目",
    line: "GPUView 性能可视化 · Dreamscape · MISTLOOP · ImagePlayer",
    metric: "04 PROJECTS",
  },
  3: {
    kicker: "SPATIAL PROJECTION / 03",
    title: "关于与联系",
    line: "C++ / Qt 仿真平台 · 机器人与智驾仿真工具链",
    metric: "OPEN TO WORK",
  },
};

export function HomeStage() {
  const [stage, setStage] = useState(0);
  const [item, setItem] = useState(0);
  const [shot, setShot] = useState(0);
  const [availableFrames, setAvailableFrames] = useState<Set<number>>(() => new Set([0]));
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const actionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const syncTheme = () => setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
    syncTheme();
    document.addEventListener("portfolio-theme-change", syncTheme);
    return () => document.removeEventListener("portfolio-theme-change", syncTheme);
  }, []);

  useEffect(() => {
    const fromHash = () => {
      const id = window.location.hash.slice(1);
      const next = stages.findIndex((item) => item.id === id);
      if (next !== -1) go(next, false);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => {
      window.removeEventListener("hashchange", fromHash);
      if (actionTimer.current) clearTimeout(actionTimer.current);
    };
  }, []);

  function go(next: number, updateUrl = true) {
    if (actionTimer.current) clearTimeout(actionTimer.current);
    setAvailableFrames((current) => {
      const frames = new Set(current).add(next);
      if (next === 1 || next === 2) frames.add(4);
      return frames;
    });
    setStage(next);
    const presentsProjects = next === 1 || next === 2;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setShot(presentsProjects && reduceMotion ? 4 : next);
    if (presentsProjects && !reduceMotion) {
      actionTimer.current = setTimeout(() => setShot(4), 850);
    }
    setItem(0);
    if (updateUrl) window.history.replaceState(null, "", `#${stages[next].id}`);
  }

  return (
    <main id="main" className="future-home scene-home" data-scene={stages[stage].id} data-pose={shot === 4 ? "present" : stages[shot].id} data-item={item}>
      <div className="scene-atmosphere" aria-hidden="true"><span className="scene-orbit scene-orbit-one" /><span className="scene-orbit scene-orbit-two" /><span className="scene-horizon" /></div>
      <div className="future-stage container">
        <div className="stage-meta mono">
          <span>WANG SHUAIPENG <i /> PORTFOLIO / 2026</span>
          <span>ENGINEERING THE NEXT WORLD</span>
        </div>

        <nav className="scene-camera-strip" aria-label="快速切换机位">
          {stations.map((station) => (
            <button
              key={station.id}
              type="button"
              className={station.index === stage ? "is-active" : undefined}
              aria-pressed={station.index === stage}
              onClick={() => go(station.index)}
            >
              {station.label}
            </button>
          ))}
        </nav>

        <div className={`stage-avatar stage-avatar-${stage}`} aria-hidden="true">
          <div className="scene-camera">
            {(theme === "dark" ? darkSceneFrames : sceneFrames).map((frame, index) => (
              <img
                key={index}
                className={`scene-frame${shot === index ? " is-active" : ""}`}
                src={availableFrames.has(index) ? asset(frame) : undefined}
                alt=""
                draggable={false}
                fetchPriority={shot === index ? "high" : "low"}
                decoding="async"
                onLoad={() => {
                  if (index === 0) setAvailableFrames((current) => current.has(4) ? current : new Set(current).add(4));
                }}
              />
            ))}
          </div>
          <div className="scene-transition" aria-hidden="true"><span className="scene-transition-light" /><span className="scene-transition-scan" /><span className="scene-transition-ring" /></div>
        </div>

        {deviceCards[stage] ? (
          <div className={`device-chip device-chip-${stage}`} aria-hidden="true">
            <span className="device-chip-kicker mono">{deviceCards[stage].kicker}</span>
            <strong>{deviceCards[stage].title}</strong>
            <p>{deviceCards[stage].line}</p>
            <span className="device-chip-metric mono">{deviceCards[stage].metric}</span>
            <span className="device-chip-pin" />
          </div>
        ) : null}

        <section className="stage-panel intro-panel" aria-labelledby="future-title" hidden={stage !== 0}>
          <div className="future-intro-copy">
            <p className="future-overline">C++ ENGINEER <span>/</span> SIMULATION SYSTEMS</p>
            <p className="future-name">王帅鹏 <span>— STDwang</span></p>
            <h1 id="future-title">让复杂世界，<br /><em>运行得更清晰。</em></h1>
            <p className="future-intro-text">
              四年 C++ / Qt 商业仿真研发，做过轨道模块、专业编辑器与微中观协同。
              正在把建模、交互与验证经验延伸到机器人和智驾仿真工具链。
            </p>
            <div className="future-actions">
              <Link className="button primary" href="/work">探索工作成果 <Arrow /></Link>
              <Link className="button" href="/resume">下载简历 <Arrow /></Link>
            </div>
            <div className="future-stat-line">
              <span><strong>04</strong> 年商业研发</span>
              <span><strong>25</strong> 项轨道模块回归用例</span>
              <span><strong>02</strong> 种仿真尺度协同</span>
            </div>
          </div>
          <aside className="scene-intro-side" aria-label="相机机位">
            <span className="scene-side-kicker">CAMERA STATIONS</span>
            <p>点击任意机位，镜头会推向对应的装置。</p>
            <div className="scene-station-list">
              {stations.map((station) => (
                <button
                  key={station.id}
                  type="button"
                  className={station.index === stage ? "is-active" : undefined}
                  aria-pressed={station.index === stage}
                  onClick={() => go(station.index)}
                >
                  <span>{station.kicker}</span>
                  <strong>{station.label}</strong>
                  <Arrow />
                </button>
              ))}
            </div>
            <span className="scene-side-foot">GitHub · CSDN · 邮箱均可在「关于与联系」中直接触达。</span>
          </aside>
        </section>

        <section className="stage-panel collection-panel scene-screen scene-screen-work" aria-labelledby="work-stage-title" hidden={stage !== 1}>
          <div className="scene-screen-top"><span className="mono">OPTICAL DISPLAY / 01</span><span className="mono">FIELD OF VIEW: ENGINEERING</span></div>
          <div className="stage-heading"><div><p className="future-overline">01 / SELECTED ENGINEERING</p><h2 id="work-stage-title">工作成果<span>，从问题到交付。</span></h2></div><Link href="/work">查看全部工程案例 <Arrow /></Link></div>
          <FeatureCarousel projects={workProjects} label="工作成果" active={stage === 1} integrated onIndexChange={setItem} />
        </section>

        <section className="stage-panel collection-panel scene-screen scene-screen-lab" aria-labelledby="lab-stage-title" hidden={stage !== 2}>
          <div className="scene-screen-top"><span className="mono">WRIST DISPLAY / 02</span><span className="mono">FIELD OF VIEW: PERSONAL LAB</span></div>
          <div className="stage-heading"><div><p className="future-overline">02 / PERSONAL LAB</p><h2 id="lab-stage-title">个人项目<span>，把想法做成作品。</span></h2></div><Link href="/lab">查看全部个人项目 <Arrow /></Link></div>
          <FeatureCarousel projects={labProjects} label="个人项目" active={stage === 2} integrated onIndexChange={setItem} />
        </section>

        <section className="stage-panel about-stage scene-screen scene-screen-contact" aria-labelledby="about-stage-title" hidden={stage !== 3}>
          <div className="scene-screen-top"><span className="mono">SPATIAL PROJECTION / 03</span><span className="mono">FIELD OF VIEW: ABOUT</span></div>
          <div className="about-stage-lead">
            <p className="future-overline">03 / ABOUT & CONTACT</p>
            <h2 id="about-stage-title">为复杂系统，<br /><em>找到可靠的表达。</em></h2>
            <p>我从交通仿真平台出发，长期处理业务对象、数据关系、专业交互与运行结果之间的工程问题。下一步，关注机器人、智驾与无人系统的仿真工具链。</p>
            <div className="about-stage-links"><Link className="button primary" href="/about">阅读完整经历 <Arrow /></Link><Link className="button" href="/resume">查看网页简历 <Arrow /></Link></div>
          </div>
          <div className="about-stage-aside">
            <div><span className="mono">CURRENT PRACTICE</span><strong>C++ / Qt · 仿真平台 · 专业可视化</strong></div>
            <div><span className="mono">NEXT DIRECTION</span><strong>机器人 / 智驾仿真工具链</strong></div>
            <div><span className="mono">GET IN TOUCH</span><a href={`mailto:${person.email}`}>{person.email} ↗</a><a href={person.github} target="_blank" rel="noreferrer">GitHub ↗</a><a href={person.blog} target="_blank" rel="noreferrer">技术博客 ↗</a></div>
          </div>
        </section>

        <div className="scene-status mono" aria-live="polite"><span className="scene-status-dot" /> CAMERA / {stage === 0 ? "全景" : stage === 1 ? "眼镜视野" : stage === 2 ? "腕表界面" : "耳机投影"}</div>
        <noscript>
          <div className="stage-noscript">
            <Link href="/work">工作成果 ↗</Link><Link href="/lab">个人项目 ↗</Link><Link href="/about">关于与联系 ↗</Link>
          </div>
          <style>{".future-home{height:auto;min-height:calc(100dvh - 81px)}.stage-panel.intro-panel{min-height:650px}"}</style>
        </noscript>
      </div>
    </main>
  );
}
