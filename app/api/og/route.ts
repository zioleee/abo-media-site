import { NextResponse } from "next/server";

function pickMeta(html: string, key: string) {
  const re1 = new RegExp(
    `<meta[^>]+(?:property|name)=["']${key}["'][^>]+content=["']([^"']+)["'][^>]*>`,
    "i"
  );
  const m1 = html.match(re1);
  if (m1?.[1]) return m1[1];

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
  const urls = [];

  // 네이버 블로그 단축 형태 보정
  const m = input.match(/^https?:\/\/blog\.naver\.com\/([^\/]+)\/(\d+)/i);
  if (m) {
    const blogId = m[1];
    const logNo = m[2];
    // ✅ m.blog를 최우선으로 (OG가 제일 잘 나옴)
    urls.push(`https://m.blog.naver.com/${blogId}/${logNo}`);
    urls.push(`https://blog.naver.com/PostView.naver?blogId=${blogId}&logNo=${logNo}`);
    urls.push(input); // 원본은 마지막
  } else {
    urls.push(input);
  }

  // 트래킹 제거 버전
  try {
    const u = new URL(input);
    u.searchParams.delete("pt");
    u.searchParams.delete("utm_source");
    u.searchParams.delete("utm_medium");
    u.searchParams.delete("utm_campaign");
    const cleaned = u.toString();
    if (cleaned !== input) urls.push(cleaned);
  } catch {}

  // 경향 스포츠 모바일 버전 시도
  if (input.includes("sports.khan.co.kr")) {
    urls.push(input.replace("https://sports.khan.co.kr", "https://m.sports.khan.co.kr"));
  }

  return Array.from(new Set(urls));
}

async function fetchHtml(url: string, signal?: AbortSignal) {
  const res = await fetch(url, {
    redirect: "follow",
    signal, // ✅ 중단 가능하도록
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept":
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
      "Accept-Language": "ko-KR,ko;q=0.9,en;q=0.8",
      "Referer": "https://www.google.com/",
    },
    // ✅ 6시간 캐시 (배포 환경에서 속도 향상)
    next: { revalidate: 60 * 60 * 6 },
  });

  const html = await res.text().catch(() => "");
  return { ok: res.ok, status: res.status, html, finalUrl: res.url };
}

function extractImageFromHtml(html: string, base: string) {
  const ogImageRaw =
    pickMeta(html, "og:image") ??
    pickMeta(html, "twitter:image") ??
    pickMeta(html, "twitter:image:src");

  const imageSrcRaw =
    pickLinkRel(html, "image_src") ??
    pickItemprop(html, "image");

  const isNaverBlog = base.includes("blog.naver.com");
  const firstImgRaw = pickFirstImage(html, !isNaverBlog);

  const imageCandidates = isNaverBlog
    ? [
        absolutize(ogImageRaw, base),
        absolutize(firstImgRaw, base),
        absolutize(imageSrcRaw, base),
      ]
    : [
        absolutize(ogImageRaw, base),
        absolutize(imageSrcRaw, base),
        absolutize(firstImgRaw, base),
      ];

  return imageCandidates
    .filter(Boolean)
    .find((u) => !isBadImage(u as string)) ?? null;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  if (!url) return NextResponse.json({ error: "missing url" }, { status: 400 });

  try {
    const urlCandidates = buildCandidateUrls(url);
    
    // ✅ AbortController로 병렬 요청 관리
    const controller = new AbortController();
    
    // ✅ 모든 URL을 동시에 요청 (병렬 처리)
    const promises = urlCandidates.map(async (u) => {
      try {
        const { ok, html, finalUrl } = await fetchHtml(u, controller.signal);
        if (!ok || !html) return null;

        const base = finalUrl || u;

        const ogTitle =
          pickMeta(html, "og:title") ??
          pickMeta(html, "twitter:title");

        const ogDesc =
          pickMeta(html, "og:description") ??
          pickMeta(html, "twitter:description");

        const image = extractImageFromHtml(html, base);

        let title = ogTitle;
        if (!title) {
          const t = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] ?? null;
          title = t;
        }

        if (image) {
          return {
            sourceUrl: base,
            ogImage: image,
            ogTitle: title ?? null,
            ogDesc: ogDesc ?? null,
          };
        }

        return null;
      } catch (e) {
        // AbortError는 무시 (정상적인 중단)
        if ((e as Error).name === 'AbortError') return null;
        console.error(`Failed to fetch ${u}:`, e);
        return null;
      }
    });

    // ✅ 첫 번째 성공한 결과를 즉시 반환
    const results = await Promise.all(promises);
    const firstSuccess = results.find(r => r !== null);

    if (firstSuccess) {
      controller.abort(); // ✅ 나머지 요청 취소
      return NextResponse.json(firstSuccess);
    }

    return NextResponse.json({
      ogImage: null,
      ogTitle: null,
      ogDesc: null,
      tried: urlCandidates,
      hint: "No image meta found in fetched HTML. Site may render meta tags client-side or block bots.",
    });
  } catch (e) {
    return NextResponse.json(
      { error: "og parse error", detail: String(e) },
      { status: 500 }
    );
  }
}