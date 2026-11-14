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
};

export type GameCatalog = {
  version: number;
  note: string;
  primaryBase: string;
  backupBase: string;
  backupLabel: string;
  notice: string;
  games: Game[];
};

export const catalog = raw as GameCatalog;
export const games = catalog.games;

/** 试玩地址。备用入口尚未发布时返回空，页面据此隐藏该链接。 */
export function playUrl(game: Game, kind: "primary" | "backup" = "primary"): string {
  const base = kind === "primary" ? catalog.primaryBase : catalog.backupBase;
  if (!base) return "";
  return `${base.replace(/\/$/, "")}/${game.slug}/`;
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
  return catalog.backupBase;
}
