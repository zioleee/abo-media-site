// Every word the pages show, in both languages. The Korean text is the live site's (and the approved boards'),
// the English text is the live English pages' — only the layout is new. Where the English pages had nothing to
// take over (a few channel names, the map's lettering), the values are marked below.

export type Lang = "ko" | "en";
export type TabKey = "about" | "business" | "works" | "news" | "contact";

export const TABS: { key: TabKey; label: string; path: string }[] = [
  { key: "about", label: "About", path: "/about" },
  { key: "business", label: "Business", path: "/business" },
  { key: "works", label: "Works", path: "/works" },
  { key: "news", label: "News", path: "/news" },
  { key: "contact", label: "Contact", path: "/contact" },
];

/** a page's address in a language; paths are written in their Korean form ("/", "/about", "/news/<slug>") */
export function hrefOf(lang: Lang, path: string) {
  if (lang === "ko") return path;
  return path === "/" ? "/en" : "/en" + path;
}

export const LOGO = "/mono/logo-h.png"; // mark + wordmark, 479 x 72 (the mark ends at 185, the wordmark runs 210..479)

export const UI = {
  ko: { home: "ABO MEDIA 홈", nav: "주 메뉴", footNav: "푸터 메뉴", menu: "메뉴", menuOpen: "메뉴 열기", menuClose: "메뉴 닫기", now: "KOR", other: "ENG" },
  en: { home: "ABO MEDIA Home", nav: "Main menu", footNav: "Footer menu", menu: "Menu", menuOpen: "Open menu", menuClose: "Close menu", now: "ENG", other: "KOR" },
};

export const FOOTER = {
  ko: { name: "㈜에이비오미디어", addr: "서울특별시 강서구 양천로 551-17 한화비즈메트로 1차 705호" },
  en: { name: "ABO Media Co., Ltd.", addr: "705, Hanwha Bizmetro 1st, 551-17 Yangcheon-ro, Gangseo-gu, Seoul, Republic of Korea" },
  tel: "Tel. 02-2668-0877",
  mail: "Email. business@abomedia.co.kr",
};

// ------------------------------------------------------------------ the first screen of every tab
// A title is set vertically, column by column; a column is a list of pieces, { b } in bold.
export type Seg = string | { b: string };
export type Columns = Seg[][];

/** width of the big serif label (with its two strokes) in em — measured in the page */
export const TAGW: Record<string, number> = { about: 2.786, business: 3.624, works: 2.861, news: 2.55, contact: 3.349, ir: 1.572, "404": 2.041 };

export const HERO: Record<TabKey | "ir", Record<Lang, Columns>> = {
  about: { ko: [[{ b: "에이비오미디어" }, "를"], ["소개합니다"]], en: [["Introducing"], [{ b: "ABO Media" }]] },
  business: { ko: [[{ b: "사업영역" }]], en: [[{ b: "Business Areas" }]] },
  works: { ko: [[{ b: "에이비오미디어" }, "의"], ["작품을"], ["소개합니다"]], en: [["Introducing"], [{ b: "ABO Media’s" }], ["Productions"]] },
  news: { ko: [[{ b: "에이비오미디어" }, "의"], ["최신 소식을"], ["전해드립니다"]], en: [["The latest news"], ["from ", { b: "ABO Media" }]] },
  contact: {
    ko: [[{ b: "에이비오미디어" }, "와 함께"], ["콘텐츠의 미래를"], ["만들어보세요"]],
    en: [["Let’s build"], ["the future of content"], ["with ", { b: "ABO Media" }, "."]],
  },
  ir: { ko: [["IR 정보"]], en: [["IR Information"]] },
};

// ------------------------------------------------------------------ About
export const ABOUT = {
  ko: {
    idLabel: "Our Identity",
    idTitle: "는 세 가지 핵심 가치로 콘텐츠를 창조합니다", // after "ABO MEDIA"
    values: [
      { letter: "A", word: "Ability", desc: ["재능과 실력을 겸비한", "우수한 제작진"] },
      { letter: "B", word: "Brilliant", desc: ["우수하고 성공적인", "성과와 제작 이력"] },
      { letter: "O", word: "Originality", desc: ["독창적인 아이디어가", "가득한 연출과 기획력"] },
    ],
    statement: [
      { t: "에이비오미디어는 " }, { em: "재능" }, { t: ", " }, { em: "성과" }, { t: ", " }, { em: "독창성" },
      { t: "을 바탕으로 시청자에게 감동과 즐거움을 선사하는 콘텐츠를 만듭니다." },
    ] as { t?: string; em?: string }[],
    historyLabel: "History",
  },
  en: {
    idLabel: "Our Identity",
    idTitle: " creates content based on three core values",
    values: [
      { letter: "A", word: "Ability", desc: ["Talented and skilled", "production team"] },
      { letter: "B", word: "Brilliant", desc: ["Outstanding and successful", "achievements and track record"] },
      { letter: "O", word: "Originality", desc: ["Creative ideas and", "innovative direction"] },
    ],
    statement: [
      { t: "ABO Media creates content that brings " }, { em: "emotion" }, { t: " and " }, { em: "joy" }, { t: " to viewers based on " },
      { em: "talent" }, { t: ", " }, { em: "achievement" }, { t: ", and " }, { em: "originality" }, { t: "." },
    ] as { t?: string; em?: string }[],
    historyLabel: "History",
  },
};

export const STATS = [
  { value: "7+", label: "YEARS" },
  { value: "70+", label: "PROGRAMS" },
  { value: "15+", label: "PARTNERS" },
  { value: "10+", label: "PLATFORMS" },
];

// ------------------------------------------------------------------ Business
export const BUSINESS = {
  ko: {
    label: "Business Areas",
    lead: ["방송 프로그램 제작부터 디지털 콘텐츠, 브랜디드 콘텐츠, 커머스까지 ", "4가지 핵심 영역", "으로 콘텐츠 가치를 확장합니다."],
    items: [
      {
        id: "01", tag: "Broadcast Production", title: "방송 프로그램 제작", subtitle: "지상파 · 케이블 · 종편",
        description: "방송 환경에서 예능 · 교양 프로그램의 기획부터 촬영, 편집, 후반 작업까지 완성도 높은 콘텐츠를 안정적으로 제작합니다.",
        keywords: ["기획", "촬영", "편집", "후반작업"],
      },
      {
        id: "02", tag: "MCN & Digital Contents", title: "MCN · 디지털 콘텐츠", subtitle: "YouTube · 디지털 플랫폼",
        description: "유튜브 채널 기획과 운영을 중심으로, 디지털 플랫폼에 최적화된 콘텐츠를 통해 채널 성장과 시청자 반응을 함께 설계합니다.",
        keywords: ["채널 기획", "운영", "그로스", "퍼포먼스"],
      },
      {
        id: "03", tag: "Branded Content & Advertising", title: "브랜디드 콘텐츠 · 광고", subtitle: "Native Ads · 캠페인",
        description: "브랜드 메시지가 자연스럽게 스며드는 네이티브 애드와 캠페인형 콘텐츠로, 몰입도와 커뮤니케이션 목표를 함께 달성합니다.",
        keywords: ["네이티브 애드", "캠페인", "크리에이티브", "통합 운영"],
      },
      {
        id: "04", tag: "Commerce & IP Business", title: "커머스 연계 사업", subtitle: "IP 기반 상품화 · 유통",
        description: "콘텐츠 IP를 상품 기획과 유통까지 연결해, 제작 단계부터 커머스 확장 가능성을 함께 고려한 통합 수익 모델을 구축합니다.",
        keywords: ["IP 비즈니스", "상품 기획", "유통", "수익 모델"],
      },
    ],
    pipeLabel: "One Pipeline",
    pipeTitle: ["기획부터 유통까지", "하나의 흐름으로"],
    pipeText: "에이비오미디어는 4가지 사업 영역을 유기적으로 연결해 콘텐츠가 가진 가치를 끝까지 확장합니다.",
    pipeCta: "협업 문의하기",
  },
  en: {
    label: "Business Areas",
    lead: ["From broadcast production to digital content, branded content, and commerce — ", "4 core areas", " that expand the value of content."],
    items: [
      {
        id: "01", tag: "Broadcast Production", title: "Broadcast Program Production", subtitle: "Terrestrial · Cable · General Programming",
        description: "From planning to filming, editing, and post-production, we deliver high-quality entertainment and educational programs aligned with each broadcaster's production standards.",
        keywords: ["Planning", "Filming", "Editing", "Post-Production"],
      },
      {
        id: "02", tag: "MCN & Digital Contents", title: "MCN · Digital Contents", subtitle: "YouTube · Digital Platforms",
        description: "Centered on YouTube channel planning and operations, we design digitally optimized content that drives both channel growth and measurable audience engagement.",
        keywords: ["Channel Planning", "Operations", "Growth", "Performance"],
      },
      {
        id: "03", tag: "Branded Content & Advertising", title: "Branded Content · Advertising", subtitle: "Native Ads · Campaigns",
        description: "Through native advertising and campaign-style branded content that seamlessly integrates brand messaging, we achieve both immersion and clear communication goals.",
        keywords: ["Native Ads", "Campaigns", "Creative", "Integrated Operations"],
      },
      {
        id: "04", tag: "Commerce & IP Business", title: "Commerce & IP Business", subtitle: "IP-Based Merchandising · Distribution",
        description: "By connecting content IP through to product planning and distribution, we build integrated revenue models that consider commerce potential from the production stage itself.",
        keywords: ["IP Business", "Product Planning", "Distribution", "Revenue Model"],
      },
    ],
    pipeLabel: "One Pipeline",
    pipeTitle: ["From Planning to Distribution,", "All in One Flow"],
    pipeText: "ABO Media organically connects 4 business areas to expand the value of content to its fullest potential.",
    pipeCta: "Get in Touch",
  },
};

// ------------------------------------------------------------------ Works
export const WORKS = {
  ko: { label: "Works", count: (n: number) => `${n}편`, years: "연도", year: (y: string) => `${y}년`, toggle: (y: string) => `${y}년 작품`, empty: "작품이 없습니다" },
  en: { label: "Works", count: (n: number) => `${n} works`, years: "Years", year: (y: string) => y, toggle: (y: string) => `${y} works`, empty: "No works found" },
};

// ------------------------------------------------------------------ News
export const NEWS = {
  ko: { label: "News", empty: "소식이 없습니다", emptySub: "곧 새로운 소식을 전해드리겠습니다", back: "목록보기", site: "abomedia.co.kr" },
  en: { label: "News", empty: "No news yet", emptySub: "We'll be sharing updates soon", back: "Back to List", site: "abomedia.co.kr" },
};

// ------------------------------------------------------------------ Contact
const Q = encodeURIComponent("서울특별시 강서구 양천로 551-17");
const APPS = {
  naver: "https://map.naver.com/p/search/" + Q,
  kakao: "https://map.kakao.com/link/search/" + Q,
  google: "https://www.google.com/maps/search/?api=1&query=" + Q,
};
export const CONTACT = {
  ko: {
    location: "Location",
    addrLabel: "주소",
    addr: ["서울특별시 강서구 양천로 551-17", "한화비즈메트로 1차 705호"],
    telLabel: "연락처",
    tel: "02-2668-0877",
    telHref: "tel:010-3889-4595",
    telW: 4.984, // the number's width in em in the serif (it is set to one width with the e-mail)
    mailLabel: "이메일",
    mail: "business@abomedia.co.kr",
    mailW: 8.787,
    mapLabel: "Map",
    directions: "길찾기",
    viewMap: "지도 보기",
    station: "9호선 증미역 1번 출구",
    walk: "도보 약 3분",
    apps: [["네이버 지도", APPS.naver], ["카카오맵", APPS.kakao], ["구글 지도", APPS.google]] as [string, string][],
    mapAria: "에이비오미디어 지도 — 서울 강서구 양천로 551-17 한화비즈메트로 1차 705호. 9호선 증미역 1번 출구에서 도보 약 3분",
  },
  en: {
    location: "Location",
    addrLabel: "Address",
    addr: ["705, Hanwha Bizmetro 1", "551-17 Yangcheon-ro, Gangseo-gu, Seoul"],
    telLabel: "Phone",
    tel: "+82-10-3889-4595",
    telHref: "tel:010-3889-4595",
    telW: 6.56,
    mailLabel: "Email",
    mail: "abo@abomedia.co.kr",
    mailW: 7.18,
    mapLabel: "Map",
    directions: "Directions",
    viewMap: "View Map",
    // (the English lettering of the directions and of the map is new: the English page had a plain map)
    station: "Line 9 Jeungmi Stn. Exit 1",
    walk: "About 3 min on foot",
    apps: [["Naver Map", APPS.naver], ["Kakao Map", APPS.kakao], ["Google Maps", APPS.google]] as [string, string][],
    mapAria: "Map of ABO Media — 705, Hanwha Bizmetro 1, 551-17 Yangcheon-ro, Gangseo-gu, Seoul. About 3 minutes on foot from Exit 1 of Jeungmi Station (Line 9)",
  },
};

// ------------------------------------------------------------------ IR, page not found
export const IR = {
  ko: { title: "IR 정보", text: "준비 중입니다" },
  en: { title: "IR Information", text: "Coming soon" },
};
export const NOT_FOUND = {
  ko: { title: "페이지를 찾을 수 없습니다", home: "홈으로" },
  en: { title: "Page not found", home: "Home" },
};

// ------------------------------------------------------------------ Home
export const HOME = {
  ko: {
    aboutLabel: "About Us",
    aboutP: ["예능·리얼리티·음악·디지털 콘텐츠", "기획부터 제작·유통까지"],
    say: ["이야기를 만들고", "세상을 움직이는"],
    sayEm: "크리에이티브 콘텐츠 그룹",
    film: "에이비오미디어 소개 영상",
    ytLabel: "Digital Contents",
    ytTitle: "YouTube Originals",
    ytDesc: ["유튜브 오리지널부터 아티스트 채널까지,", "에이비오미디어의 디지털 제작 라인업"],
    luLabel: "2026 Lineup",
    luTitle: "TV · OTT",
    luDesc: "올해 선보이는 에이비오미디어의 작품들",
    luCta: "전체 작품 보기",
    ctLabel: "Contact",
    ctH: ["함께 만들어갈", "콘텐츠의 미래"],
    ctBold: 1,
    ctP: "에이비오미디어와 협력하여 새로운 가치를 창조하세요",
    ctBtn1: "문의하기",
    ctBtn2: "IR 정보 보기",
    newsLabel: "News",
    hide: "오늘 하루 보지 않기",
    close: "닫기",
  },
  en: {
    aboutLabel: "About Us",
    aboutP: ["From planning to production and distribution", "of entertainment, reality, music, and digital content"],
    say: ["Creating Stories,", "Moving the World"],
    sayEm: "Creative Content Group",
    film: "ABO Media introduction film",
    ytLabel: "Digital Contents",
    ytTitle: "YouTube Originals",
    ytDesc: ["From YouTube originals to artist channels —", "ABO Media's digital content lineup"],
    luLabel: "2026 Lineup",
    luTitle: "TV · OTT",
    luDesc: "ABO Media's works launching this year",
    luCta: "View All Works",
    ctLabel: "Contact",
    ctH: ["The Future of Content", "We'll Create Together"],
    ctBold: 0,
    ctP: "Create new value through collaboration with ABO Media",
    ctBtn1: "Contact Us",
    ctBtn2: "IR Information",
    newsLabel: "News",
    hide: "Hide for today",
    close: "Close",
  },
};

export const FILM = "/ABO_introduce.mp4";
export const FILM_STILL = "/mono/intro-still.jpg";

/** the channels of YouTube Originals (live main page). English names: the live English page's where it had one; the others are romanised (to confirm) */
export const CHANNELS: { ko: string; en: string; src: string; href: string }[] = [
  { ko: "황정음", en: "Hwang Jung-eum", src: "/mono/yt/hwangjungeum.jpg", href: "https://www.youtube.com/@jung_eum" },
  { ko: "한채아 - 채아뜰", en: "Han Chae-ah - Chaeatteul", src: "/mono/yt/hanchaea.jpg", href: "" },
  { ko: "이수경 경력직", en: "Lee Sookyung", src: "/mono/yt/leesukyung.jpg", href: "https://www.youtube.com/@sookyung.yi_career" },
  { ko: "한그루 - 그루니까 말이야", en: "Han Gru - Because It's Gru", src: "/mono/yt/hangeuru.jpg", href: "https://youtube.com/@guru_han_s2?si=Ke-cFE9bAnuukKwS" },
  { ko: "헬로민영", en: "Hello Minyoung", src: "/mono/yt/minyoung.jpg", href: "" },
  { ko: "지상렬 대리점", en: "Ji Sang-ryul Agency", src: "/mono/yt/jisangryul.jpg", href: "https://www.youtube.com/@Ji_Daeri" },
];

/** the works the main page shows, in this order (the rest stay on the Works page) */
export const HOME_WORKS = [
  "yeonaejeonjaeng", // 연애전쟁
  "yeolhyeolnonggudan2", // 열혈농구단2
  "namgyeoseo-mwohage26", // 남겨서 뭐하게
  "sagikkundeul", // 史기꾼들
  "beolgeobeoseun-segyesa26", // 벌거벗은 세계사
  "beolgeobeoseun-hanguksa2", // 벌거벗은 한국사
  "seollok-ne-gaji-siseon-2", // 시간추적자 셜록
  "nunan-naege-yeojaya", // 누난 내게 여자야
  "solloraseo-sijeun2", // 솔로라서
];

/** the news notice of the main page (Korean page only). Change `id` with every new notice: it resets "오늘 하루 보지 않기" / "닫기" */
export const NOTICE = {
  id: "news-2026-11",
  date: "2026.11.02",
  title: "(주)에이비오미디어 - (주)아틀라스컴퍼니 업무협약 체결",
  url: "https://n.news.naver.com/mnews/article/014/0005597965?sid=105",
  startAt: "2026-11-01T00:00:00+09:00",
  endAt: "2026-11-30T23:59:59+09:00",
  seconds: 15, // it leaves by itself after this long (its hairline counts down)
};

// ------------------------------------------------------------------ History (About)
export type HistoryEvent = { network: string; shows: string[] };
export type HistoryItem = { year: string; events: HistoryEvent[] };

export const HISTORY_KO: HistoryItem[] = [
  {
    year: "2018",
    events: [
      { network: "ABO미디어 창립", shows: [] },
      { network: "MBC", shows: ["<공복자들>"] }
    ]
  },
  {
    year: "2019",
    events: [
      { network: "MBC", shows: ["<아육대 설 특집 방송>"] },
      { network: "SBS Plus", shows: ["<똥강아지들>"] }
    ]
  },
  {
    year: "2020",
    events: [
      { network: "MBN", shows: ["<지구 방위대>"] },
      { network: "JTBC", shows: ["<가장 보통의 가족>"] },
      { network: "SBS", shows: ["<추석특집 라면 당기는 시간>"] },
      { network: "KBS2", shows: ["<펫비타민>"] }
    ]
  },
  {
    year: "2021",
    events: [
      { network: "MBN", shows: ["<국제부부 시즌1>"] },
      { network: "JTBC", shows: ["<내가 키운다>"] },
      { network: "JTBC", shows: ["<펫키지>"] },
      { network: "MBN", shows: ["<국제부부 시즌2>"] },
      { network: "IHQ", shows: ["<리더의 하루>"] }
    ]
  },
  {
    year: "2022",
    events: [
      { network: "KBS2", shows: ["<빼고파>"] },
      { network: "WATCHA", shows: ["<도깨비>"] },
      { network: "KBS2", shows: ["<갓파더>"] },
      { network: "tvN", shows: ["<우리들의 차차차>"] },
      { network: "MBN", shows: ["<달인 VS 달인>"] },
      { network: "SBS", shows: ["<펫미픽미>"] },
      { network: "SBS Plus", shows: ["<우리 아이가 달라졌어요 리턴즈>"] }
    ]
  },
  {
    year: "2023",
    events: [
      { network: "tvN", shows: ["<벌거벗은 세계사>"] },
      { network: "TV조선", shows: ["<부부선수촌>"] },
      { network: "JYP", shows: ["<글로벌 오디션 A2K>"] },
      { network: "U+모바일tv", shows: ["<내편하자 1,2>"] },
      { network: "TV조선", shows: ["<형제라면>"] },
      { network: "TV조선", shows: ["<조선체육회>"] },
      { network: "MBN", shows: ["<오픈전쟁>"] },
      { network: "TV조선", shows: ["<아빠하고 나하고>"] }
    ]
  },
  {
    year: "2024",
    events: [
      { network: "Wavve", shows: ["엄맛찬스"] },
      { network: "TV조선", shows: ["<송승환의 초대>"] },
      { network: "U+모바일tv", shows: ["<내편하자 3>"] },
      { network: "E채널", shows: ["<설록 네가지 시선>"] },
      { network: "SBS Plus", shows: ["<솔로라서>"] },
      { network: "tvN", shows: ["<유별난 역사한끼>"] },
      { network: "tvN STORY", shows: ["<이젠 사랑할 수 있을까>"] }
    ]
  },
  {
    year: "2025",
    events: [
      { 
        network: "tvN", 
        shows: [
          "<벌거벗은 세계사>",
          "<벌거벗은 한국사>",
          "<유별난 역사 한 끼>",
          "<잘생긴 트롯>",
          "<백억짜리 아침식사>",
          "<남겨서 뭐하게 시즌 1,2>"
        ]
      },
      { 
        network: "JTBC", 
        shows: [
          "<샬라샬라>",
          "<1호가 될수없어 시즌2>",
          "<한끼합쇼>"
        ]
      },
      { network: "SBS플러스", shows: ["<솔로라서 시즌2>"] },
      { network: "LG유플러스", shows: ["<내편하자 시즌4>"] },
      { network: "MBN", shows: ["<이장우의 두유노집밥>"] },
      { network: "KBS Joy", shows: ["<오래된 만남 추구 시즌 1,2>"] },
      { network: "KBS", shows: ["<누난 내게 여자야>", "<배달 왔수다>"] }
    ]
  }
];

export const HISTORY_EN: HistoryItem[] = [
  {
    year: "2018",
    events: [
      { network: "ABO Media Founded", shows: [] },
      { network: "MBC", shows: ["<The Hungry>"] }
    ]
  },
  {
    year: "2019",
    events: [
      { network: "MBC", shows: ["<Idol Star Athletics Championships - Lunar New Year Special>"] },
      { network: "SBS Plus", shows: ["<Puppies>"] }
    ]
  },
  {
    year: "2020",
    events: [
      { network: "MBN", shows: ["<Earth Defense Force>"] },
      { network: "JTBC", shows: ["<The Most Ordinary Family>"] },
      { network: "SBS", shows: ["<Chuseok Special: Instant Noodle Time>"] },
      { network: "KBS2", shows: ["<Pet Vitamin>"] }
    ]
  },
  {
    year: "2021",
    events: [
      { network: "MBN", shows: ["<International Couple Season 1>"] },
      { network: "JTBC", shows: ["<I'm Raising It>"] },
      { network: "JTBC", shows: ["<Petkage>"] },
      { network: "MBN", shows: ["<International Couple Season 2>"] },
      { network: "IHQ", shows: ["<A Day in the Life of a Leader>"] }
    ]
  },
  {
    year: "2022",
    events: [
      { network: "KBS2", shows: ["<I Want to Lose Weight>"] },
      { network: "WATCHA", shows: ["<Goblin>"] },
      { network: "KBS2", shows: ["<Godfather>"] },
      { network: "tvN", shows: ["<Our Cha Cha Cha>"] },
      { network: "MBN", shows: ["<Master VS Master>"] },
      { network: "SBS", shows: ["<Pet Me Pick Me>"] },
      { network: "SBS Plus", shows: ["<Our Kid Has Changed Returns>"] }
    ]
  },
  {
    year: "2023",
    events: [
      { network: "tvN", shows: ["<Naked World History>"] },
      { network: "TV Chosun", shows: ["<Couple's Training Center>"] },
      { network: "JYP", shows: ["<Global Audition A2K>"] },
      { network: "U+ Mobile TV", shows: ["<Let's Be on Your Side 1,2>"] },
      { network: "TV Chosun", shows: ["<If You're Brothers>"] },
      { network: "TV Chosun", shows: ["<Chosun Sports Association>"] },
      { network: "MBN", shows: ["<Open War>"] },
      { network: "TV Chosun", shows: ["<Dad and I>"] }
    ]
  },
  {
    year: "2024",
    events: [
      { network: "Wavve", shows: ["Mom Taste Chance"] },
      { network: "TV Chosun", shows: ["<Song Seung-hwan's Invitation>"] },
      { network: "U+ Mobile TV", shows: ["<Let's Be on Your Side 3>"] },
      { network: "E Channel", shows: ["<Seolrok: Four Perspectives>"] },
      { network: "SBS Plus", shows: ["<Because I'm Slow>"] },
      { network: "tvN", shows: ["<One Unusual History Meal>"] },
      { network: "tvN STORY", shows: ["<Can I Love Now>"] }
    ]
  },
  {
    year: "2025",
    events: [
      { 
        network: "tvN", 
        shows: [
          "<Naked World History>",
          "<Naked Korean History>",
          "<One Unusual History Meal>",
          "<Handsome Trot>",
          "<10 Billion Won Night Meal>",
          "<What to Do with Leftovers Season 1,2>"
        ]
      },
      { 
        network: "JTBC", 
        shows: [
          "<Shala Sala>",
          "<Can't Be Number One Season 2>",
          "<Let's Do It Together>"
        ]
      },
      { network: "SBS Plus", shows: ["<Because I'm Solo Season 2>"] },
      { network: "LG U+", shows: ["<Let's Be on Your Side Season 4>"] },
      { network: "MBN", shows: ["<Lee Jang-woo's Do You Know Home Cooking>"] },
      { network: "KBS Joy", shows: ["<Looking for Old Meetings Season 1,2>"] },
      { network: "KBS", shows: ["<Sister, You're a Woman to Me>", "<Delivery Came>"] }
    ]
  }
];

/** history programme (Korean, without its <> marks) -> the work's title in the CMS, where the two differ in wording */
export const H2W: Record<string, string> = {
  "아육대 설 특집 방송": "2019 설특집 아이돌스타 선수권대회",
  "지구 방위대": "지구방위대",
  "추석특집 라면 당기는 시간": "추석특집 - 라면 당기는 시간",
  "펫비타민": "펫 비타민",
  "국제부부 시즌1": "한국에 반하다-국제부부",
  "내가 키운다": "용감한 솔로 육아 - 내가 키운다",
  "펫키지": "개취존중 여행배틀 - 펫키지",
  "국제부부 시즌2": "글로벌 썸&쌈 국제부부2",
  "도깨비": "지혜를 빼앗는 도깨비",
  "달인 VS 달인": "달인 vs 달인",
  "글로벌 오디션 A2K": "JYP 글로벌 오디션 A2K",
  "내편하자 1,2": "내편하자1",
  "오픈전쟁": "사장의 탄생-오픈전쟁",
  "내편하자 3": "내편하자3",
  "설록 네가지 시선": "설록 : 네 가지 시선",
  "유별난 역사한끼": "유별난 역사 한 끼",
  "남겨서 뭐하게 시즌 1,2": "남겨서 뭐하게? 시즌2",
  "샬라샬라": "늦기 전에 어학연수 샬라샬라",
  "1호가 될수없어 시즌2": "1호가 될 순 없어2",
  "내편하자 시즌4": "내편하자4",
  "배달 왔수다": "배달왔수다"
};
