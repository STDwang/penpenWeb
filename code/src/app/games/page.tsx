import Link from "next/link";
import { pageMeta } from "@/lib/site";
import { catalog, games, playUrl, coverUrl, showcaseUrl, showcaseBackupUrl } from "@/content/games";
import { Arrow } from "@/components/ui";

export const metadata = pageMeta(
  "游戏橱窗",
  "王帅鹏用 AI 辅助开发的 5 款游戏：Three.js、Godot + Blender、Cocos Creator 与零依赖 Canvas 2.5D 四条技术路线，浏览器直接试玩。",
  "/games",
);

const ticker = [
  "THREE.JS / WEBGL2", "GODOT 4.7 WEB", "BLENDER BPY", "COCOS CREATOR 3.8",
  "CANVAS 2.5D", "ZERO DEPENDENCY", "OPEN IN BROWSER", "NO INSTALL",
];

export default function GamesPage() {
  const hasBackup = Boolean(catalog.backupBase);

  return (
    <main id="main" className="container folio-page">
      <section className="folio-hero" data-reveal>
        <p className="future-overline">03 / GAME ARCADE</p>
        <h1>游戏<span className="hl">橱窗</span></h1>
        <p className="folio-lead">
          五款游戏、四条技术路线，都是我用 AI 辅助从零做出来的可玩原型：Web 程序化生成、
          Godot + Blender 建模流水线、Cocos 小游戏工程，以及把旧作彻底重构成零依赖网页版的 Canvas 2.5D。
          打开即玩，不用装任何东西。
        </p>
        <div className="folio-meta">
          <span>{games.length} GAMES</span>
          <span>4 TECH ROUTES</span>
          <span>PLAY IN BROWSER</span>
          <span>3 PRIVATE BUILDS</span>
        </div>
      </section>

      <div className="nb-ticker" aria-hidden="true" style={{ marginTop: 28 }}>
        <div className="nb-ticker-track">
          {[...ticker, ...ticker].map((word, index) => <span className="nb-ticker-item" key={`${word}-${index}`}>{word}</span>)}
        </div>
      </div>

      <section className="folio-grid" aria-label="游戏列表" data-reveal-group>
        {games.map((game, index) => (
          <article className="game-card" data-accent={game.accent} data-reveal key={game.slug}>
            <div className="game-top">
              <span className="game-index">NO.{String(index + 1).padStart(2, "0")}</span>
              <span className="game-route">{game.route}</span>
            </div>
            <a className="game-cover" href={playUrl(game)} target="_blank" rel="noreferrer" tabIndex={-1}>
              <img src={coverUrl(game)} alt={game.coverAlt} loading={index < 2 ? "eager" : "lazy"} />
            </a>
            <div className="game-body">
              <div className="game-title">
                <h2>{game.title}</h2>
                <span>{game.en}</span>
              </div>
              <div className="game-tech">
                {game.tech.map((tech) => <span key={tech}>{tech}</span>)}
                <span>{game.size}</span>
              </div>
              <p className="game-desc">{game.desc}</p>
              <p className="game-keys">
                {game.keys.map((key) => <b key={key}>{key}</b>)}
              </p>
              <div className="game-actions">
                <a className="is-primary" href={playUrl(game)} target="_blank" rel="noreferrer" aria-label={`在新窗口试玩${game.title}`}>
                  ▶ 直接试玩
                </a>
                {hasBackup ? (
                  <a href={playUrl(game, "backup")} target="_blank" rel="noreferrer" aria-label={`${catalog.backupLabel}试玩${game.title}`}>
                    {catalog.backupLabel} ↗
                  </a>
                ) : null}
                {!game.private && game.source ? (
                  <a href={game.source} target="_blank" rel="noreferrer">源码 ↗</a>
                ) : (
                  <span className="is-static">源码未公开</span>
                )}
              </div>
              {game.private ? <p className="game-private">仅提供构建产物试玩 · 请勿反编译或二次分发</p> : null}
            </div>
          </article>
        ))}
      </section>

      <aside className="folio-notice" data-reveal>
        <p><strong>关于试玩与源码。</strong> {catalog.notice}</p>
        <p>
          公开源码的两款（MISTLOOP、Dreamscape）可点进对应仓库看实现；另外三款源码仓库保持私有，
          公开站点只放浏览器可直接运行的构建产物。需要键盘与鼠标，建议用桌面浏览器打开；
          其中几款构建包较大（{games.filter((g) => g.private).map((g) => g.size).join(" / ")}），首次加载请稍等；纯 Canvas 的那款 148 KB，秒开。
        </p>
        <p>
          完整橱窗页面：<a href={showcaseUrl()} target="_blank" rel="noreferrer">{showcaseUrl()}</a>
          {hasBackup ? <> · {catalog.backupLabel}：<a href={showcaseBackupUrl()} target="_blank" rel="noreferrer">{showcaseBackupUrl()}</a></> : null}
        </p>
        <p style={{ fontSize: 11, fontFamily: "var(--font-mono-nb), Consolas, monospace" }}>
          清单维护：修改 <code>src/content/games.json</code> 后运行 <code>npm run games:sync</code> 同步橱窗。
        </p>
      </aside>

      <Link className="button folio-back" href="/">返回首页 <Arrow /></Link>
    </main>
  );
}
