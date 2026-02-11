import { NextResponse } from "next/server";

function pickMeta(html: string, key: string) {
  // property/name -> content
  const re1 = new RegExp(
    `<meta[^>]+(?:property|name)=["']${key}["'][^>]+content=["']([^"']+)["'][^>]*>`,
    "i"
  );
  const m1 = html.match(re1);
  if (m1?.[1]) return m1[1];

  // content -> property/name
  const re2 = new RegExp(
    `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${key}["'][^>]*>`,
    "i"
  );
  const m2 = html.match(re2);
  return m2?.[1] ?? null;
}

function pickLinkRel(html: string, rel: string) {
  const re1 = new RegExp(
    `<link[^>]+rel=["']${rel}["'][^>]+href=["']([^"']+)["'][^>]*>`,
    "i"
  );
  const m1 = html.match(re1);
  if (m1?.[1]) return m1[1];

  const re2 = new RegExp(
    `<link[^>]+href=["']([^"']+)["'][^>]+rel=["']${rel}["'][^>]*>`,
    "i"
  );
  const m2 = html.match(re2);
  return m2?.[1] ?? null;
}

function pickItemprop(html: string, itemprop: string) {
  const re1 = new RegExp(
    `<meta[^>]+itemprop=["']${itemprop}["'][^>]+content=["']([^"']+)["'][^>]*>`,
    "i"
  );
  const m1 = html.match(re1);
  if (m1?.[1]) return m1[1];

  const re2 = new RegExp(
    `<meta[^>]+content=["']([^"']+)["'][^>]+itemprop=["']${itemprop}["'][^>]*>`,
    "i"
  );
  const m2 = html.match(re2);
  return m2?.[1] ?? null;
}

function pickFirstImage(html: string, cutHeader: boolean) {
  if (cutHeader) {
    const bodyPart = html.split("</header>").pop() ?? html;
    html = bodyPart;
  }

  const attrs = [
    "data-original",
    "data-lazy-src",
    "data-echo",
    "data-img-src",
    "data-src",
    "src",
  ];

  for (const a of attrs) {
    const re = new RegExp(`<img[^>]+${a}=["']([^"']+)["'][^>]*>`, "i");
    const m = html.match(re);
    if (m?.[1]) return m[1];
  }

  const m2 = html.match(/<img[^>]+srcset=["']([^"']+)["'][^>]*>/i);
  if (m2?.[1]) {
    const parts = m2[1].split(",").map(s => s.trim()).filter(Boolean);
    const last = parts[parts.length - 1];
    const url = last?.split(/\s+/)?.[0];
    if (url) return url;
  }

  return null;
}

function absolutize(url: string | null, baseUrl: string) {
  if (!url) return null;
  try {
    return new URL(url, baseUrl).toString();
  } catch {
    return url;
  }
}

function isBadImage(u: string | null) {
  if (!u) return true;
  const s = u.toLowerCase();
  if (s.endsWith(".svg")) return true;
  if (s.includes("logo")) return true;
  if (s.includes("favicon")) return true;
  if (s.includes("icon")) return true;
  return false;
}

function buildCandidateUrls(input: string) {
  const urls = [input];

  // 네이버 블로그 단축 형태 보정
  const m = input.match(/^https?:\/\/blog\.naver\.com\/([^\/]+)\/(\d+)/i);
  if (m) {
    const blogId = m[1];
    const logNo = m[2];
    // ✅ 순서 중요: m.blog와 PostView가 OG를 더 잘 제공함
    urls.push(`https://m.blog.naver.com/${blogId}/${logNo}`);
    urls.push(`https://blog.naver.com/PostView.naver?blogId=${blogId}&logNo=${logNo}`);
  }

  // 트래킹 제거 버전
  try {
    const u = new URL(input);
    u.searchParams.delete("pt");
    u.searchParams.delete("utm_source");
    u.searchParams.delete("utm_medium");
    u.searchParams.delete("utm_campaign");
    urls.push(u.toString());
  } catch {}

  // 경향 스포츠 모바일 버전 시도
  urls.push(input.replace("https://sports.khan.co.kr", "https://m.sports.khan.co.kr"));

  return Array.from(new Set(urls));
}

async function fetchHtml(url: string) {
  const res = await fetch(url, {
    redirect: "follow",
    cache: "no-store",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept":
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
      "Accept-Language": "ko-KR,ko;q=0.9,en;q=0.8",
      "Referer": "https://www.google.com/",
    },
  });

  const html = await res.text().catch(() => "");
  return { ok: res.ok, status: res.status, html, finalUrl: res.url };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  if (!url) return NextResponse.json({ error: "missing url" }, { status: 400 });

  try {
    const urlCandidates = buildCandidateUrls(url);

    // ✅ 모든 URL 후보를 순회하면서 이미지를 찾음
    for (const u of urlCandidates) {
      const { ok, html, finalUrl } = await fetchHtml(u);
      if (!ok || !html) continue;

      const base = finalUrl || u;

      // 제목/설명
      const ogTitle =
        pickMeta(html, "og:title") ??
        pickMeta(html, "twitter:title");

      const ogDesc =
        pickMeta(html, "og:description") ??
        pickMeta(html, "twitter:description");

      // 이미지 후보 수집
      const ogImageRaw =
        pickMeta(html, "og:image") ??
        pickMeta(html, "twitter:image") ??
        pickMeta(html, "twitter:image:src");

      const imageSrcRaw =
        pickLinkRel(html, "image_src") ??
        pickItemprop(html, "image");

      const isNaverBlog = base.includes("blog.naver.com");
      const firstImgRaw = pickFirstImage(html, !isNaverBlog);

      // ✅ 블로그/뉴스 구분 전략
      const imageCandidates = isNaverBlog
        ? [
            absolutize(ogImageRaw, base),      // 블로그: OG 우선 (m.blog/PostView에서 잘 나옴)
            absolutize(firstImgRaw, base),
            absolutize(imageSrcRaw, base),
          ]
        : [
            absolutize(ogImageRaw, base),      // 뉴스: OG 우선
            absolutize(imageSrcRaw, base),
            absolutize(firstImgRaw, base),
          ];

      const image = imageCandidates
        .filter(Boolean)
        .find((u) => !isBadImage(u as string)) ?? null;

      let title = ogTitle;
      if (!title) {
        const t = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] ?? null;
        title = t;
      }

      // ✅ 핵심: 이미지를 찾았으면 즉시 리턴 (다음 URL 시도 안 함)
      if (image) {
        return NextResponse.json({
          sourceUrl: base,
          ogImage: image,
          ogTitle: title ?? null,
          ogDesc: ogDesc ?? null,
        });
      }

      // ✅ 이미지는 없지만 제목/설명이 있으면 계속 다음 URL 시도
      // (블로그는 m.blog나 PostView에서 이미지가 나올 수 있음)
    }

    // ✅ 모든 URL을 시도했는데도 이미지를 못 찾았으면 마지막 시도 결과 리턴
    return NextResponse.json({
      ogImage: null,
      ogTitle: null,
      ogDesc: null,
      tried: buildCandidateUrls(url),
      hint: "No image meta found in fetched HTML. Site may render meta tags client-side or block bots.",
    });
  } catch (e) {
    return NextResponse.json(
      { error: "og parse error", detail: String(e) },
      { status: 500 }
    );
  }
}