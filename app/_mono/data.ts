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

// Hygraph image optimisation (as on the live main page)
export function optimizeHygraphImage(url: string, width = 400): string {
  if (!url) return url;
  if (url.includes("hygraph.com") || url.includes("graphassets.com")) {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}w=${width}&q=80&fm=webp`;
  }
  return url;
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
