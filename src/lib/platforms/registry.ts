// Central Platform Registry — verbatim port of WPoster Web's
// `src/lib/platforms/meta.ts` (the single source of truth for platforms across
// WPoster's shared UI). Kept byte-compatible with Web so a new platform added on
// Web reaches Mobile by copying this one file — there is never a second ordering,
// colour map, label map or capability list to drift out of sync.
//
// The Tailwind class strings in `badge`/`color` are the Web presentation values;
// Mobile renders platform visuals via `@/components/platform` (react-native-svg +
// a hex tint map) but keeps this data identical to Web for parity/sync.

export type PlatformSlug =
  | 'telegram'
  | 'facebook'
  | 'instagram'
  | 'threads'
  | 'bluesky'
  | 'tumblr'
  | 'x'
  | 'wordpress';

/** Canonical alias — same set as PlatformSlug. */
export type PlatformId = PlatformSlug;

export interface PlatformCapabilities {
  publishing: boolean;
  analytics: boolean;
  research: boolean;
  automation: boolean;
  reports: boolean;
  media: boolean;
}

export interface PlatformConnection {
  supported: boolean;
  route?: string;
  type?: 'oauth' | 'token' | 'credentials' | 'application-password';
}

export interface PlatformContent {
  text: boolean;
  image: boolean;
  video: boolean;
  carousel: boolean;
  article: boolean;
}

export interface PlatformColor {
  bg: string;
  text: string;
  border: string;
}

export interface PlatformDefinition {
  id: PlatformSlug;
  label: string;
  shortLabel?: string;
  letter: string;
  badge: string;
  color: PlatformColor;
  order: number;
  enabled: boolean;
  capabilities: PlatformCapabilities;
  connection: PlatformConnection;
  content: PlatformContent;
}

export type PlatformMeta = PlatformDefinition;

export const PLATFORM_META: Record<PlatformSlug, PlatformDefinition> = {
  telegram: {
    id: 'telegram', label: 'Telegram', letter: 'T',
    badge: 'bg-cyan-400/20 text-cyan-500',
    color: { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/20' },
    order: 0, enabled: true,
    capabilities: { publishing: true, analytics: true, research: true, automation: true, reports: true, media: true },
    connection: { supported: true, route: '/integrations/telegram', type: 'token' },
    content: { text: true, image: true, video: true, carousel: true, article: false },
  },
  facebook: {
    id: 'facebook', label: 'Facebook', letter: 'f',
    badge: 'bg-blue-400/20 text-blue-500',
    color: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
    order: 1, enabled: true,
    capabilities: { publishing: true, analytics: true, research: true, automation: true, reports: true, media: true },
    connection: { supported: true, route: '/integrations/facebook', type: 'oauth' },
    content: { text: true, image: true, video: true, carousel: true, article: false },
  },
  instagram: {
    id: 'instagram', label: 'Instagram', letter: 'ig',
    badge: 'bg-pink-400/20 text-pink-500',
    color: { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/20' },
    order: 2, enabled: true,
    capabilities: { publishing: true, analytics: true, research: true, automation: true, reports: true, media: true },
    connection: { supported: true, route: '/integrations/instagram', type: 'oauth' },
    content: { text: true, image: true, video: true, carousel: true, article: false },
  },
  threads: {
    id: 'threads', label: 'Threads', letter: '@',
    badge: 'bg-slate-400/20 text-slate-400',
    color: { bg: 'bg-neutral-500/10', text: 'text-neutral-400', border: 'border-neutral-500/20' },
    order: 3, enabled: true,
    capabilities: { publishing: true, analytics: true, research: true, automation: true, reports: true, media: true },
    connection: { supported: true, route: '/integrations/threads', type: 'oauth' },
    content: { text: true, image: true, video: true, carousel: false, article: false },
  },
  bluesky: {
    id: 'bluesky', label: 'Bluesky', letter: 'B',
    badge: 'bg-sky-400/20 text-sky-500',
    color: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20' },
    order: 4, enabled: true,
    capabilities: { publishing: true, analytics: true, research: true, automation: true, reports: true, media: true },
    connection: { supported: true, route: '/integrations/bluesky', type: 'credentials' },
    content: { text: true, image: true, video: true, carousel: true, article: false },
  },
  tumblr: {
    id: 'tumblr', label: 'Tumblr', letter: 't',
    badge: 'bg-indigo-400/20 text-indigo-500',
    color: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20' },
    order: 5, enabled: true,
    capabilities: { publishing: true, analytics: true, research: true, automation: true, reports: true, media: true },
    connection: { supported: true, route: '/integrations/tumblr', type: 'oauth' },
    content: { text: true, image: true, video: true, carousel: true, article: true },
  },
  x: {
    id: 'x', label: 'X', shortLabel: 'X', letter: 'X',
    badge: 'bg-[var(--app-surface-raised)] text-[var(--app-text-primary)] border border-[var(--app-border)]',
    color: { bg: 'bg-zinc-500/10', text: 'text-zinc-300', border: 'border-zinc-500/20' },
    order: 6, enabled: true,
    capabilities: { publishing: true, analytics: true, research: true, automation: true, reports: true, media: true },
    connection: { supported: true, route: '/integrations/x', type: 'oauth' },
    content: { text: true, image: true, video: true, carousel: true, article: false },
  },
  wordpress: {
    id: 'wordpress', label: 'WordPress', letter: 'W',
    badge: 'bg-violet-400/20 text-violet-500',
    color: { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20' },
    order: 7, enabled: true,
    capabilities: { publishing: true, analytics: false, research: false, automation: true, reports: false, media: true },
    connection: { supported: true, route: '/integrations/wordpress', type: 'application-password' },
    content: { text: true, image: true, video: false, carousel: true, article: true },
  },
};

const ALL_IDS: PlatformSlug[] = (Object.keys(PLATFORM_META) as PlatformSlug[]).sort(
  (a, b) => PLATFORM_META[a].order - PLATFORM_META[b].order,
);

/** Canonical display order (icons render left→right in this order). */
export const PLATFORM_ORDER: PlatformSlug[] = ALL_IDS;

export function isPlatformSlug(v: string): v is PlatformSlug {
  return v in PLATFORM_META;
}

export const isPlatformId = isPlatformSlug;

const PLATFORM_ALIASES: Record<string, PlatformSlug> = {
  twitter: 'x',
  'twitter.com': 'x',
  tweet: 'x',
};

/** Normalize a raw/legacy slug to a canonical Platform ID, or null if unsupported. */
export function normalizePlatformId(raw: string | null | undefined): PlatformSlug | null {
  if (!raw) return null;
  const s = raw.trim().toLowerCase();
  if (isPlatformSlug(s)) return s;
  return PLATFORM_ALIASES[s] ?? null;
}

export function getAllPlatforms(): PlatformDefinition[] {
  return ALL_IDS.map((id) => PLATFORM_META[id]);
}

export function getEnabledPlatforms(): PlatformDefinition[] {
  return getAllPlatforms().filter((p) => p.enabled);
}

function byCapability(cap: keyof PlatformCapabilities): PlatformDefinition[] {
  return getEnabledPlatforms().filter((p) => p.capabilities[cap]);
}

export function getPublishingPlatforms(): PlatformDefinition[] { return byCapability('publishing'); }
export function getAnalyticsPlatforms(): PlatformDefinition[] { return byCapability('analytics'); }
export function getConnectedAccountPlatforms(): PlatformDefinition[] {
  return getEnabledPlatforms().filter((p) => p.connection.supported);
}

export function getPlatformById(id: string): PlatformDefinition | undefined {
  const norm = normalizePlatformId(id);
  return norm ? PLATFORM_META[norm] : undefined;
}

/** Human label for a slug; falls back to the raw value for unknown slugs. */
export function getPlatformLabel(id: string): string {
  return getPlatformById(id)?.label ?? id;
}

export function getPlatformShortLabel(id: string): string {
  const def = getPlatformById(id);
  return def?.shortLabel ?? def?.label ?? id;
}

/** De-duplicate + return known platforms in canonical order (unknown dropped). */
export function orderPlatforms(platforms: string[]): PlatformSlug[] {
  const set = new Set(platforms);
  return PLATFORM_ORDER.filter((p) => set.has(p));
}
