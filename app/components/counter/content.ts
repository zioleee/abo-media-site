// Text for the COUNTER-style sub pages. Every string below is taken from the
// current site pages (app/*/page.tsx and app/en/*/page.tsx); only the layout changes.

export type Lang = "ko" | "en";

export type HistoryEvent = { network: string; shows: string[] };
export type HistoryItem = { year: string; events: HistoryEvent[] };

export const NAV: Record<Lang, { href: string; label: string }[]> = {
  ko: [
    { href: "/about", label: "About" },
    { href: "/business", label: "Business" },
    { href: "/works", label: "Works" },
    { href: "/news", label: "News" },
    { href: "/contact", label: "Contact" },
  ],
  en: [
    { href: "/en/about", label: "About" },
    { href: "/en/business", label: "Business" },
    { href: "/en/works", label: "Works" },
    { href: "/en/news", label: "News" },
    { href: "/en/contact", label: "Contact" },
  ],
};

export const COMPANY = {
  tel: "02-2668-0877",
  mail: "business@abomedia.co.kr",
  name: { ko: "㈜에이비오미디어", en: "ABO Media Co., Ltd." },
  addr: {
    ko: "서울특별시 강서구 양천로 551-17 한화비즈메트로 1차 705호",
    en: "705, Hanwha Bizmetro 1st, 551-17 Yangcheon-ro, Gangseo-gu, Seoul, Republic of Korea",
  },
};

export const COMMON = {
  ko: {
    floatWorks: "작품 보기",
    floatContact: "문의하기",
    ctaWorks: "작품 보기",
    ctaWorksSub: "에이비오미디어의 작품을 소개합니다",
    ctaContact: "문의하기",
    ctaContactSub: `${COMPANY.mail} · ${COMPANY.tel}`,
    menuOpen: "메뉴 열기",
    menuClose: "메뉴 닫기",
    home: "ABO MEDIA 홈",
  },
  en: {
    floatWorks: "Works",
    floatContact: "Contact",
    ctaWorks: "Works",
    ctaWorksSub: "Introducing ABO Media's Productions",
    ctaContact: "Get in Touch",
    ctaContactSub: `${COMPANY.mail} · ${COMPANY.tel}`,
    menuOpen: "Open menu",
    menuClose: "Close menu",
    home: "ABO MEDIA Home",
  },
};

export const ABOUT = {
  ko: {
    label: "ABOUT",
    title: "에이비오미디어를 소개합니다",
    idLabel: "Our Identity",
    idTitle: "ABO MEDIA는 세 가지 핵심 가치로 콘텐츠를 창조합니다",
    values: [
      { letter: "A", word: "ABILITY", desc1: "재능과 실력을 겸비한", desc2: "우수한 제작진" },
      { letter: "B", word: "BRILLIANT", desc1: "우수하고 성공적인", desc2: "성과와 제작 이력" },
      { letter: "O", word: "ORIGINALITY", desc1: "독창적인 아이디어가", desc2: "가득한 연출과 기획력" },
    ],
    // statement pieces: plain text and highlighted words alternate
    statement: [
      { t: "에이비오미디어는 " },
      { em: "재능" },
      { t: ", " },
      { em: "성과" },
      { t: ", " },
      { em: "독창성" },
      { t: "을 바탕으로 시청자에게 감동과 즐거움을 선사하는 콘텐츠를 만듭니다." },
    ],
    historyLabel: "HISTORY",
  },
  en: {
    label: "ABOUT",
    title: "Introducing ABO Media",
    idLabel: "Our Identity",
    idTitle: "ABO MEDIA creates content based on three core values",
    values: [
      { letter: "A", word: "ABILITY", desc1: "Talented and skilled", desc2: "production team" },
      { letter: "B", word: "BRILLIANT", desc1: "Outstanding and successful", desc2: "achievements and track record" },
      { letter: "O", word: "ORIGINALITY", desc1: "Creative ideas and", desc2: "innovative direction" },
    ],
    statement: [
      { t: "ABO Media creates content that brings " },
      { em: "emotion" },
      { t: " and " },
      { em: "joy" },
      { t: " to viewers based on " },
      { em: "talent" },
      { t: ", " },
      { em: "achievement" },
      { t: ", and " },
      { em: "originality" },
      { t: "." },
    ],
    historyLabel: "HISTORY",
  },
};

export const STATS = [
  { value: "7+", label: "Years" },
  { value: "70+", label: "Programs" },
  { value: "15+", label: "Partners" },
  { value: "10+", label: "Platforms" },
];

export const BUSINESS = {
  ko: {
    label: "Business Areas",
    title: "사업영역",
    leadA: "방송 프로그램 제작부터 디지털 콘텐츠, 브랜디드 콘텐츠, 커머스까지",
    leadEm: "4가지 핵심 영역",
    leadB: "으로 콘텐츠 가치를 확장합니다.",
    items: [
      {
        id: "01",
        tag: "Broadcast Production",
        title: "방송 프로그램 제작",
        subtitle: "지상파 · 케이블 · 종편",
        description:
          "방송 환경에서 예능 · 교양 프로그램의 기획부터 촬영, 편집, 후반 작업까지 완성도 높은 콘텐츠를 안정적으로 제작합니다.",
        keywords: ["기획", "촬영", "편집", "후반작업"],
      },
      {
        id: "02",
        tag: "MCN & Digital Contents",
        title: "MCN · 디지털 콘텐츠",
        subtitle: "YouTube · 디지털 플랫폼",
        description:
          "유튜브 채널 기획과 운영을 중심으로, 디지털 플랫폼에 최적화된 콘텐츠를 통해 채널 성장과 시청자 반응을 함께 설계합니다.",
        keywords: ["채널 기획", "운영", "그로스", "퍼포먼스"],
      },
      {
        id: "03",
        tag: "Branded Content & Advertising",
        title: "브랜디드 콘텐츠 · 광고",
        subtitle: "Native Ads · 캠페인",
        description:
          "브랜드 메시지가 자연스럽게 스며드는 네이티브 애드와 캠페인형 콘텐츠로, 몰입도와 커뮤니케이션 목표를 함께 달성합니다.",
        keywords: ["네이티브 애드", "캠페인", "크리에이티브", "통합 운영"],
      },
      {
        id: "04",
        tag: "Commerce & IP Business",
        title: "커머스 연계 사업",
        subtitle: "IP 기반 상품화 · 유통",
        description:
          "콘텐츠 IP를 상품 기획과 유통까지 연결해, 제작 단계부터 커머스 확장 가능성을 함께 고려한 통합 수익 모델을 구축합니다.",
        keywords: ["IP 비즈니스", "상품 기획", "유통", "수익 모델"],
      },
    ],
    pipeLabel: "One Pipeline",
    pipeTitle: ["기획부터 유통까지", "하나의 흐름으로"],
    pipeText: "에이비오미디어는 4가지 사업 영역을 유기적으로 연결해 콘텐츠가 가진 가치를 끝까지 확장합니다.",
    pipeCta: "협업 문의하기",
    pipeHref: "/contact",
  },
  en: {
    label: "Business Areas",
    title: "BUSINESS",
    leadA: "From broadcast production to digital content, branded content, and commerce —",
    leadEm: "4 core areas",
    leadB: " that expand the value of content.",
    items: [
      {
        id: "01",
        tag: "Broadcast Production",
        title: "Broadcast Program Production",
        subtitle: "Terrestrial · Cable · General Programming",
        description:
          "From planning to filming, editing, and post-production, we deliver high-quality entertainment and educational programs aligned with each broadcaster's production standards.",
        keywords: ["Planning", "Filming", "Editing", "Post-Production"],
      },
      {
        id: "02",
        tag: "MCN & Digital Contents",
        title: "MCN · Digital Contents",
        subtitle: "YouTube · Digital Platforms",
        description:
          "Centered on YouTube channel planning and operations, we design digitally optimized content that drives both channel growth and measurable audience engagement.",
        keywords: ["Channel Planning", "Operations", "Growth", "Performance"],
      },
      {
        id: "03",
        tag: "Branded Content & Advertising",
        title: "Branded Content · Advertising",
        subtitle: "Native Ads · Campaigns",
        description:
          "Through native advertising and campaign-style branded content that seamlessly integrates brand messaging, we achieve both immersion and clear communication goals.",
        keywords: ["Native Ads", "Campaigns", "Creative", "Integrated Operations"],
      },
      {
        id: "04",
        tag: "Commerce & IP Business",
        title: "Commerce & IP Business",
        subtitle: "IP-Based Merchandising · Distribution",
        description:
          "By connecting content IP through to product planning and distribution, we build integrated revenue models that consider commerce potential from the production stage itself.",
        keywords: ["IP Business", "Product Planning", "Distribution", "Revenue Model"],
      },
    ],
    pipeLabel: "One Pipeline",
    pipeTitle: ["From Planning to Distribution,", "All in One Flow"],
    pipeText: "ABO Media organically connects 4 business areas to expand the value of content to its fullest potential.",
    pipeCta: "Get in Touch",
    pipeHref: "/en/contact",
  },
};

export const WORKS_TEXT = {
  ko: {
    label: "WORKS",
    title: "에이비오미디어의 작품을 소개합니다",
    yearLabel: "연도",
    all: "전체",
    count: (n: number) => `${n}편`,
    emptyTitle: "작품이 없습니다",
    emptySub: "다른 연도를 선택해주세요",
    loading: "작품을 불러오는 중입니다",
  },
  en: {
    label: "WORKS",
    title: "Introducing ABO Media's Productions",
    yearLabel: "Year",
    all: "All",
    count: (n: number) => `${n} works`,
    emptyTitle: "No works found",
    emptySub: "Please select a different year",
    loading: "Loading works",
  },
};

export const NEWS_TEXT = {
  ko: {
    label: "NEWS",
    title: "에이비오미디어의 최신 소식을 전해드립니다",
    all: "All Post",
    emptyTitle: "소식이 없습니다",
    emptySub: "곧 새로운 소식을 전해드리겠습니다",
    back: "목록보기",
  },
  en: {
    label: "NEWS",
    title: "The latest news from ABO Media",
    all: "All Post",
    emptyTitle: "No news yet",
    emptySub: "We'll be sharing updates soon",
    back: "Back to list",
  },
};

const NAVER_SEARCH = `https://map.naver.com/p/search/${encodeURIComponent("서울특별시 강서구 양천로 551-17")}`;
const NAVER_SEARCH_EN = `https://map.naver.com/p/search/${encodeURIComponent("서울특별시 강서구 양천로 551-17 한화비즈메트로 1차 705호")}`;

export const CONTACT = {
  ko: {
    label: "CONTACT",
    title: "에이비오미디어와 함께 콘텐츠의 미래를 만들어보세요",
    location: "Location",
    addrLabel: "주소",
    addr: ["서울특별시 강서구 양천로 551-17", "한화비즈메트로 1차 705호"],
    telLabel: "연락처",
    tel: "02-2668-0877",
    telHref: "tel:010-3889-4595",
    mailLabel: "이메일",
    mail: "business@abomedia.co.kr",
    mapLabel: "Map",
    directions: "길찾기",
    viewMap: "지도 보기",
    mapHref: NAVER_SEARCH,
    markerTitle: "에이비오미디어",
    infoHtml:
      '<div style="padding:15px;font-size:14px;"><strong>에이비오미디어</strong><br/>서울 강서구 양천로 551-17</div>',
  },
  en: {
    label: "CONTACT",
    title: "Let’s build the future of content with ABO Media.",
    location: "Location",
    addrLabel: "Address",
    addr: ["705, Hanwha Bizmetro 1", "551-17 Yangcheon-ro, Gangseo-gu, Seoul"],
    telLabel: "Phone",
    tel: "+82-10-3889-4595",
    telHref: "tel:010-3889-4595",
    mailLabel: "Email",
    mail: "abo@abomedia.co.kr",
    mapLabel: "Map",
    directions: "Directions",
    viewMap: "View Map",
    mapHref: NAVER_SEARCH_EN,
    markerTitle: "ABO Media",
    infoHtml:
      '<div style="padding:15px;font-size:14px;"><strong>ABO Media</strong><br/>705, Hanwha Bizmetro 1, 551-17 Yangcheon-ro, Gangseo-gu, Seoul</div>',
  },
};

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
