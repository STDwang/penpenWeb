"use client";

import { useEffect, useRef, useState } from "react";
import { type Game, catalog, coverUrl, playUrl } from "@/content/games";

const AUTO_MS = 6000;

/** 首页游戏机厅：一块大屏 + 卡带选择条。未交互前在可视区内自动轮播，任何操作后停止。 */
export function HomeArcade({ games }: { games: Game[] }) {
  const [index, setIndex] = useState(0);
  const [auto, setAuto] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const touched = useRef(false);
  const game = games[index];
  const backup = playUrl(game, "backup");

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => setAuto(entry.isIntersecting && !touched.current), { threshold: 0.45 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!auto) return;
    const timer = window.setTimeout(() => setIndex((value) => (value + 1) % games.length), AUTO_MS);
    return () => window.clearTimeout(timer);
  }, [auto, index, games.length]);

  function stop() {
    touched.current = true;
    setAuto(false);
  }

  function select(next: number, focus = false) {
    const result = (next + games.length) % games.length;
    stop();
    setIndex(result);
    if (focus) tabs.current[result]?.focus();
  }

  return (
    <div className="hm-arcade-body" ref={root} data-accent={game.accent} onPointerDown={stop} onFocus={stop}>
      <div className="hm-screen-wrap" data-reveal>
        <a className="hm-screen" href={playUrl(game)} target="_blank" rel="noreferrer" aria-label={`在新窗口试玩${game.title}`}>
          {games.map((item, position) => (
            <img key={item.slug} className={position === index ? "is-active" : ""} src={coverUrl(item)} alt={position === index ? item.coverAlt : ""} width={1280} height={720} loading={position === 0 ? "eager" : "lazy"} draggable={false} />
          ))}
          <span className="hm-screen-scan" aria-hidden="true" />
          <span className="hm-screen-tag mono" aria-hidden="true">NO.{String(index + 1).padStart(2, "0")} · {game.route}</span>
          <span className="hm-screen-play" aria-hidden="true"><b>▶</b> PLAY</span>
        </a>
      </div>

      <div className="hm-game" role="tabpanel" id="hm-game-panel" aria-labelledby={`hm-game-tab-${game.slug}`} data-reveal>
        <div className="hm-game-copy" key={game.slug}>
          <p className="hm-game-en mono">{game.en}</p>
          <h3>{game.title}</h3>
          <p className="hm-game-desc">{game.desc}</p>
          <p className="hm-game-tech mono">{game.tech.map((item) => <span key={item}>{item}</span>)}<span>{game.size}</span></p>
          <p className="hm-game-keys mono" aria-label="操作方式">{game.keys.map((item) => <kbd key={item}>{item}</kbd>)}</p>
        </div>
        <div className="hm-game-actions">
          <a className="is-primary" href={playUrl(game)} target="_blank" rel="noreferrer">▶ 直接试玩</a>
          {backup ? <a href={backup} target="_blank" rel="noreferrer">{catalog.backupLabel} ↗</a> : null}
          {!game.private && game.source ? <a href={game.source} target="_blank" rel="noreferrer">源码 ↗</a> : <span>源码未公开</span>}
        </div>
      </div>

      <div className="hm-carts" role="tablist" aria-label="选择游戏" data-auto={auto}>
        {games.map((item, position) => (
          <button
            type="button"
            role="tab"
            key={item.slug}
            id={`hm-game-tab-${item.slug}`}
            ref={(node) => { tabs.current[position] = node; }}
            className={`hm-cart${position === index ? " is-active" : ""}`}
            aria-selected={position === index}
            aria-controls="hm-game-panel"
            tabIndex={position === index ? 0 : -1}
            onClick={() => select(position)}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                event.preventDefault();
                select(position + (event.key === "ArrowRight" ? 1 : -1), true);
              }
            }}
          >
            <img src={coverUrl(item)} alt="" width={1280} height={720} loading="lazy" draggable={false} />
            <span className="mono">{String(position + 1).padStart(2, "0")}</span>
            <strong>{item.title}</strong>
          </button>
        ))}
      </div>
    </div>
  );
}
