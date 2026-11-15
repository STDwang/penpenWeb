"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { asset } from "@/lib/asset";
import { Arrow } from "../ui";

const pad = (value: number) => String(value).padStart(2, "0");

export function HomeHero({ gameCount }: { gameCount: number }) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const counters = Array.from(el.querySelectorAll<HTMLElement>("[data-count]"));
    const start = performance.now() + 650;
    let raf = requestAnimationFrame(function tick(now) {
      const t = Math.min(1, Math.max(0, (now - start) / 900));
      const eased = 1 - Math.pow(1 - t, 3);
      counters.forEach((counter) => { counter.textContent = pad(Math.round(Number(counter.dataset.count) * eased)); });
      if (t < 1) raf = requestAnimationFrame(tick);
    });

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--hm-px", ((event.clientX - rect.left) / rect.width - 0.5).toFixed(3));
      el.style.setProperty("--hm-py", ((event.clientY - rect.top) / rect.height - 0.5).toFixed(3));
    };
    const onLeave = () => {
      el.style.setProperty("--hm-px", "0");
      el.style.setProperty("--hm-py", "0");
    };
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (fine) {
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
    }
    return () => {
      cancelAnimationFrame(raf);
      counters.forEach((counter) => { counter.textContent = pad(Number(counter.dataset.count)); });
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const stats = [
    { value: 4, label: "年商业研发" },
    { value: 25, label: "项轨道模块回归用例" },
    { value: 2, label: "种仿真尺度协同" },
    { value: gameCount, label: "款浏览器可玩游戏" },
  ];

  return (
    <section className="hm-hero container" ref={root} aria-labelledby="hm-title">
      <div className="hm-hero-copy">
        <p className="future-overline hm-in" style={{ "--hm-d": "0ms" } as React.CSSProperties}>C++ ENGINEER <span>/</span> SIMULATION SYSTEMS</p>
        <p className="hm-name mono hm-in" style={{ "--hm-d": "80ms" } as React.CSSProperties}><strong>王帅鹏</strong> — STDwang · FOLIO 2026</p>
        <h1 id="hm-title">
          <span className="hm-in" style={{ "--hm-d": "140ms" } as React.CSSProperties}>让复杂世界，</span>
          <em>运行得更清晰。</em>
        </h1>
        <p className="hm-lead hm-in" style={{ "--hm-d": "420ms" } as React.CSSProperties}>
          四年 C++ / Qt 商业仿真研发，做过轨道模块、专业编辑器与微中观协同。
          正在把建模、交互与验证经验延伸到机器人和智驾仿真工具链。
        </p>
        <div className="hm-actions hm-in" style={{ "--hm-d": "520ms" } as React.CSSProperties}>
          <Link className="button primary" href="/games">打开游戏橱窗 <Arrow /></Link>
          <Link className="button" href="/work">查看工程案例 <Arrow /></Link>
        </div>
        <dl className="hm-stats hm-in" style={{ "--hm-d": "620ms" } as React.CSSProperties}>
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt><strong data-count={stat.value}>{pad(stat.value)}</strong></dt>
              <dd>{stat.label}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="hm-hero-side hm-in" style={{ "--hm-d": "260ms" } as React.CSSProperties}>
        <span className="hm-id-back" aria-hidden="true" />
        <figure className="hm-id">
          <div className="hm-id-bar mono">
            <span>ID / STDWANG</span>
            <span className="hm-id-live"><i aria-hidden="true" />OPEN TO OPPORTUNITIES</span>
          </div>
          <div className="hm-id-photo">
            <img src={asset("/images/portrait-duotone.webp")} alt="王帅鹏的半身像" width={720} height={900} draggable={false} />
          </div>
          <figcaption>
            <p className="hm-id-name"><strong>王帅鹏</strong><span className="mono">WANG SHUAIPENG</span></p>
            <dl>
              <div><dt className="mono">ROLE</dt><dd>C++ / 仿真平台工程师</dd></div>
              <div><dt className="mono">NEXT</dt><dd>机器人 / 智驾仿真工具链</dd></div>
            </dl>
          </figcaption>
        </figure>
        <span className="hm-sticker" aria-hidden="true">{gameCount} GAMES TO PLAY</span>
        <Link className="hm-spin" href="/games" aria-label={`打开游戏橱窗，${gameCount} 款游戏浏览器直接试玩`}>
          <svg viewBox="0 0 120 120" aria-hidden="true">
            <defs><path id="hm-spin-path" d="M60 60m-45 0a45 45 0 1 1 90 0a45 45 0 1 1-90 0" /></defs>
            <text><textPath href="#hm-spin-path" textLength="276">PLAY IN BROWSER ✳ NO INSTALL ✳</textPath></text>
          </svg>
          <b aria-hidden="true">▶</b>
        </Link>
      </div>

      <a className="hm-scroll mono" href="#work"><span aria-hidden="true">↓</span> SCROLL / 向下看作品</a>
    </section>
  );
}
