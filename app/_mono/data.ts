// What the pages read from the CMS (Hygraph). The queries and the way they are run are the live site's:
// works are read in the browser on every visit, news on the server.
import { GraphQLClient, gql } from "graphql-request";
import { H2W } from "./content";

const endpoint = process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT ?? "";
const token = process.env.NEXT_PUBLIC_HYGRAPH_TOKEN ?? "";

function client() {
  if (!endpoint) return null;
  return new GraphQLClient(endpoint, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
}

export type Asset = { url: string; width?: number | null; height?: number | null };
export type Work = {
  id: string;
  title: string;
  slug: string;
  year: number;
  category: string;
  coverImage?: Asset | Asset[] | null;
  client?: { name: string; website?: string | null; logo?: Asset | null } | null;
};

const worksQuery = (first: number) => gql`
  query Works {
    works(orderBy: year_DESC, first: ${first}) {
      id
      title
      slug
      year
      category
      coverImage { url width height }
      client {
        name
        website
        logo { url width height }
      }
    }
  }
`;

/** the works, newest year first (the main page reads the first 50, the other pages 100 — as before) */
export async function getWorks(first = 100): Promise<Work[]> {
  const c = client();
  if (!c) return [];
  try {
    const data = await c.request<{ works: Work[] }>(worksQuery(first));
    return data.works ?? [];
  } catch (e) {
    console.error("Failed to fetch works:", e);
    return [];
  }
}

export function coverOf(w: Work): Asset | null {
  const c = Array.isArray(w.coverImage) ? w.coverImage[0] : w.coverImage;
  return c && c.url ? c : null;
}

/** width / height of a cover, when the CMS knows its size */
export function ratioOf(a: Asset | null): number | null {
  return a && a.width && a.height ? a.width / a.height : null;
}

// Pictures from the CMS, at the size they are shown. Hygraph serves them through Filestack, where a transformation goes
// into the path, before the file's handle:
//   https://ap-south-1.graphassets.com/<environment>/resize=width:400,fit:max/output=format:webp,quality:80/<handle>
// (The "?w=400&q=80&fm=webp" query the site sent before is ignored there: every poster came down as its full-size
// original — up to 19 MB each. Found 2026-11-13.) `fit:max` never enlarges an original that is smaller.
function hygraphParts(url: string): { head: string; handle: string } | null {
  try {
    const u = new URL(url);
    if (!/(^|\.)graphassets\.com$/.test(u.hostname)) return null;
    const segs = u.pathname.split("/").filter(Boolean);
    if (!segs.length || segs.some((x) => x.includes("="))) return null; // nothing to work on, or transformed already
    const handle = segs.pop() as string;
    return { head: [u.origin, ...segs].join("/"), handle };
  } catch {
    return null;
  }
}
export function optimizeHygraphImage(url: string, width = 400): string {
  if (!url) return url;
  const p = hygraphParts(url);
  return p ? `${p.head}/resize=width:${width},fit:max/output=format:webp,quality:80/${p.handle}` : url;
}
/** the same picture at several widths, for `srcset` (nothing for a picture that is not the CMS's) */
export function hygraphSrcSet(url: string | null | undefined, widths: number[]): string | undefined {
  if (!url || !hygraphParts(url)) return undefined;
  return widths.map((w) => `${optimizeHygraphImage(url, w)} ${w}w`).join(", ");
}

/** the work a programme of the history stands for: same title (the CMS's wording), the same year if there is one */
export function workOfProgramme(programme: string, year: string, works: Work[]): Work | null {
  const title = H2W[programme] ?? programme;
  const same = works.filter((w) => w.title === title && coverOf(w));
  if (!same.length) return null;
  return same.find((w) => String(w.year) === year) ?? same[0];
}

// ------------------------------------------------------------------ news (server)
export type NewsItem = {
  id: string;
  title: string;
  slug: string;
  externalUrl?: string | null;
  publishedDate?: string | null;
  coverImage?: Asset | null;
};

const NEWS_LIST = gql`
  query NewsList {
    newsItems(orderBy: publishedDate_DESC, first: 100) {
      id
      title
      slug
      externalUrl
      publishedDate
      coverImage {
        url
        width
        height
      }
    }
  }
`;

export async function getNewsItems(): Promise<NewsItem[]> {
  const c = client();
  if (!c) return [];
  try {
    const data = await c.request<{ newsItems: NewsItem[] }>(NEWS_LIST);
    return data.newsItems ?? [];
  } catch (e) {
    console.error("Failed to fetch newsItems:", e);
    return [];
  }
}

type RichTextRaw = { children?: Array<{ type?: string; children?: Array<{ text?: string }> }> };
export type NewsDetail = {
  id: string;
  title: string;
  slug: string;
  publishedDate?: string | null;
  category?: string | null;
  coverImage?: Asset | null;
  content?: { raw?: RichTextRaw | null } | null;
};

const NEWS_DETAIL = gql`
  query NewsDetail($slug: String!) {
    news(where: { slug: $slug }) {
      id
      title
      slug
      publishedDate
      category
      coverImage {
        url
        width
        height
      }
      content {
        raw
      }
    }
  }
`;

export async function getNewsDetail(slug: string): Promise<NewsDetail | null> {
  const c = client();
  if (!c) return null;
  try {
    const data = await c.request<{ news: NewsDetail | null }>(NEWS_DETAIL, { slug });
    return data.news ?? null;
  } catch (e) {
    console.error("Failed to fetch news detail:", e);
    return null;
  }
}

/** the paragraphs of a news text (the live site shows paragraphs only; an empty one is a gap) */
export function paragraphsOf(raw?: RichTextRaw | null): string[] {
  return (raw?.children ?? [])
    .filter((b) => b?.type === "paragraph")
    .map((b) => (b.children ?? []).map((c) => (typeof c?.text === "string" ? c.text : "")).join(""));
}

/** "2026-11-02" -> { y: "2026", m: "11", d: "02" } (read from the text itself, so no time zone can move the day) */
export function dateParts(s?: string | null) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s ?? "");
  if (m) return { y: m[1], m: m[2], d: m[3] };
  const d = s ? new Date(s) : null;
  if (!d || Number.isNaN(d.getTime())) return null;
  return { y: String(d.getFullYear()), m: String(d.getMonth() + 1).padStart(2, "0"), d: String(d.getDate()).padStart(2, "0") };
}

/** where a news item comes from: the address's host, or this site for an item of its own */
export function sourceOf(n: { externalUrl?: string | null }, own: string) {
  const u = (n.externalUrl ?? "").trim();
  if (!u) return own;
  try {
    return new URL(u).hostname.replace(/^www\./, "");
  } catch {
    return own;
  }
}
