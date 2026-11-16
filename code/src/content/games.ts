import raw from "./games.json";
import { asset } from "@/lib/asset";

/** 游戏清单类型。字段与橱窗仓库的 games.json 完全一致，由 npm run games:sync 同步。 */
export type Game = {
  slug: string;
  title: string;
  en: string;
  badge: string;
  route: string;
  tech: string[];
  desc: string;
  keys: string[];
  cover: string;
  coverAlt: string;
  source: string;
  private: boolean;
  size: string;
  accent: "blue" | "green" | "pink" | "yellow";
  /** 独立部署的游戏：覆盖由 primaryBase / backupBase 拼出的默认地址。 */
  playUrl?: string;
  backupUrl?: string;
};

export type GameCatalog = {
  version: number;
  note: string;
  primaryBase: string;
  backupBase: string;
  backupShare: string;
  backupLabel: string;
  notice: string;
  games: Game[];
};

export const catalog = raw as GameCatalog;
export const games = catalog.games;

/** 试玩地址。独立部署的游戏优先用自身 URL；未配置备用入口时返回空，页面据此隐藏该链接。 */
export function playUrl(game: Game, kind: "primary" | "backup" = "primary"): string {
  if (kind === "backup") {
    if (game.backupUrl) return game.backupUrl;
    if (!catalog.backupBase) return "";
    // WorkBuddy 分享码必须出现在每个游戏地址上，否则从未访问过镜像首页的浏览器会被 403 拦下。
    return `${catalog.backupBase.replace(/\/$/, "")}/${game.slug}/${catalog.backupShare ?? ""}`;
  }
  if (game.playUrl) return game.playUrl;
  if (!catalog.primaryBase) return "";
  return `${catalog.primaryBase.replace(/\/$/, "")}/${game.slug}/`;
}

/** 封面在作品集里使用本地副本，避免国内访问主站图片造成等待。 */
export function coverUrl(game: Game): string {
  const file = game.cover.split("/").pop() ?? `${game.slug}.webp`;
  return asset(`/images/games/${file}`);
}

export function showcaseUrl(): string {
  return catalog.primaryBase;
}

export function showcaseBackupUrl(): string {
  return catalog.backupBase ? `${catalog.backupBase.replace(/\/$/, "")}/${catalog.backupShare ?? ""}` : "";
}
