'use client'

type HistoryEvent = {
  network: string;
  shows: string[];
};

type HistoryItem = {
  year: string;
  events: HistoryEvent[];
};

const historyData: HistoryItem[] = [
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
      { network: "SBS Plus", shows: ["<슬로라서>"] },
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
          "<백억짜리 야짐식사>",
          "<남겨서 뭐하게 시즌 1,2>"
        ]
      },
      { 
        network: "JTBC", 
        shows: [
          "<샬라살라>",
          "<1호가 될수없어 시즌2>",
          "<함께합쇼>"
        ]
      },
      { network: "SBS플러스", shows: ["<솔로라서 시즌2>"] },
      { network: "LG유플러스", shows: ["<내편하자 시즌4>"] },
      { network: "MBN", shows: ["<이장우의 두유노집밥>"] },
      { network: "KBS Joy", shows: ["<오래된 만남 추구 시즌 1,2>"] },
      { network: "KBS", shows: ["<누나 내게 여자야>", "<배달 왔수다>"] }
    ]
  }
];

export default function About() {
  return (
    <main className="bg-white">
      {/* Hero Section */}
     <section className="relative bg-gradient-to-br from-[#1c7a9e] via-[#2596be] to-[#3db3d9] text-white py-20">
        <div className="container-main">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">ABOUT</h1>
          <p className="text-lg text-white/90">
            에이비오미디어를 소개합니다
          </p>
        </div>
      </section>

      {/* ABO Identity Section */}
      <section className="relative bg-[#0A0F1A] text-white py-32 overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-[10%] right-[20%] w-96 h-96 bg-[#2596be]/30 rounded-full blur-3xl" />
          <div className="absolute bottom-[20%] left-[10%] w-96 h-96 bg-[#3db3d9]/20 rounded-full blur-3xl" />
        </div>

        <div className="relative container-main max-w-7xl">
          {/* Section Title */}
          <div className="mb-24">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">Our Identity</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#2596be] to-[#3db3d9]" />
            <p className="mt-6 text-xl text-white/60">
              ABO MEDIA는 세 가지 핵심 가치로 콘텐츠를 창조합니다
            </p>
          </div>

          {/* ABO Grid */}
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {/* A - Ability */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#2596be]/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative border border-white/10 rounded-3xl p-10 lg:p-12 hover:border-[#2596be]/50 transition-all duration-500">
                <div className="mb-8">
                  <span className="text-8xl font-black text-white/10 group-hover:text-[#2596be]/30 transition-colors duration-500">
                    A
                  </span>
                </div>
                <h3 className="text-3xl font-bold mb-4 tracking-tight">
                  <span className="text-[#3db3d9]">A</span>BILITY
                </h3>
                <p className="text-white/60 leading-relaxed text-lg">
                  재능과 실력을 겸비한<br />
                  <span className="text-white/90 font-semibold">우수한 제작진</span>
                </p>
              </div>
            </div>

            {/* B - Brilliant */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#2596be]/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative border border-white/10 rounded-3xl p-10 lg:p-12 hover:border-[#2596be]/50 transition-all duration-500">
                <div className="mb-8">
                  <span className="text-8xl font-black text-white/10 group-hover:text-[#2596be]/30 transition-colors duration-500">
                    B
                  </span>
                </div>
                <h3 className="text-3xl font-bold mb-4 tracking-tight">
                  <span className="text-[#3db3d9]">B</span>RILLIANT
                </h3>
                <p className="text-white/60 leading-relaxed text-lg">
                  우수하고 성공적인<br />
                  <span className="text-white/90 font-semibold">성과와 제작 이력</span>
                </p>
              </div>
            </div>

            {/* O - Originality */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#2596be]/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative border border-white/10 rounded-3xl p-10 lg:p-12 hover:border-[#2596be]/50 transition-all duration-500">
                <div className="mb-8">
                  <span className="text-8xl font-black text-white/10 group-hover:text-[#2596be]/30 transition-colors duration-500">
                    O
                  </span>
                </div>
                <h3 className="text-3xl font-bold mb-4 tracking-tight">
                  <span className="text-[#3db3d9]">O</span>RIGINALITY
                </h3>
                <p className="text-white/60 leading-relaxed text-lg">
                  독창적인 아이디어가<br />
                  <span className="text-white/90 font-semibold">가득한 연출과 기획력</span>
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Message */}
          <div className="mt-24 text-center max-w-3xl mx-auto">
            <p className="text-xl md:text-2xl text-white/80 leading-relaxed">
              에이비오미디어는 <span className="text-[#3db3d9] font-bold">재능</span>, <span className="text-[#3db3d9] font-bold">성과</span>, <span className="text-[#3db3d9] font-bold">독창성</span>을 바탕으로<br className="hidden md:block" />
              시청자에게 감동과 즐거움을 선사하는 콘텐츠를 만듭니다.
            </p>
          </div>
        </div>
      </section>

     {/* History Timeline */}
<section className="relative py-32 bg-white border-t border-gray-100">
  <div className="container-main">
    {/* Title */}
    <div className="mb-28">
      <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
        HISTORY
      </h2>
      <div className="w-24 h-1 bg-gradient-to-r from-[#2596be] to-[#3db3d9]" />
    </div>

    {/* Cards Grid */}
    {/* 핵심: 위로 올라가는 커넥터를 위한 공간 */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-28 pt-24">
      {historyData.map((item) => (
        <div key={item.year} className="relative group">
          {/* Connector (Desktop only) */}
          <div className="hidden lg:flex pointer-events-none absolute left-1/2 -translate-x-1/2 -top-24 z-0 flex-col items-center">
            <div className="w-2 h-2 rounded-full bg-[#2596be] group-hover:scale-150 transition-transform duration-300" />
            <div className="mt-3 h-20 w-px bg-[#2596be]/30" />
          </div>

          {/* Card */}
          <div className="relative z-10 bg-white border border-gray-100 rounded-2xl p-10 hover:border-[#2596be]/30 hover:shadow-brand transition-all duration-300">
            {/* Year */}
            <div className="mb-10">
              <h3 className="text-6xl font-bold text-[#2596be] tracking-tight mb-4">
                {item.year}
              </h3>
              <div className="h-px w-12 bg-gradient-to-r from-[#2596be] to-[#3db3d9]" />
            </div>

            {/* Events */}
            <div className="space-y-7">
              {item.events.map((event, eventIndex) => (
                <div key={eventIndex}>
                  <h4 className="text-sm font-bold text-gray-900 mb-2 tracking-wide">
                    {event.network}
                  </h4>
                  {event.shows.length > 0 && (
                    <div className="space-y-1">
                      {event.shows.map((show, showIndex) => (
                        <p
                          key={showIndex}
                          className="text-sm text-gray-600 leading-relaxed"
                        >
                          {show}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>


      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-br from-[#1c7a9e] via-[#2596be] to-[#3db3d9]">
        <div className="container-main">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
            <div className="text-center group">
              <div className="text-6xl md:text-7xl font-bold mb-3 text-white group-hover:scale-110 transition-transform duration-300">
                7+
              </div>
              <p className="text-white/70 text-sm tracking-[0.2em] uppercase">Years</p>
            </div>
            <div className="text-center group">
              <div className="text-6xl md:text-7xl font-bold mb-3 text-white group-hover:scale-110 transition-transform duration-300">
                70+
              </div>
              <p className="text-white/70 text-sm tracking-[0.2em] uppercase">Programs</p>
            </div>
            <div className="text-center group">
              <div className="text-6xl md:text-7xl font-bold mb-3 text-white group-hover:scale-110 transition-transform duration-300">
                15+
              </div>
              <p className="text-white/70 text-sm tracking-[0.2em] uppercase">Partners</p>
            </div>
            <div className="text-center group">
              <div className="text-6xl md:text-7xl font-bold mb-3 text-white group-hover:scale-110 transition-transform duration-300">
                10+
              </div>
              <p className="text-white/70 text-sm tracking-[0.2em] uppercase">Platforms</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="container-main">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Partners</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#2596be] to-[#3db3d9]" />
            <p className="mt-6 text-lg text-gray-600">함께 성장해온 파트너사</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {['KBS', 'MBC', 'SBS', 'tvN', 'JTBC', 'MBN', 'TV조선', 'Wavve', 'WATCHA', 'U+모바일tv', 'E채널', 'JYP'].map((partner) => (
              <div
                key={partner}
                className="aspect-square flex items-center justify-center bg-white border border-gray-200 rounded-2xl hover:border-[#2596be]/50 hover:shadow-md transition-all duration-300 group"
              >
                <span className="text-lg font-bold text-gray-700 group-hover:text-[#2596be] group-hover:scale-110 transition-all duration-300">
                  {partner}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}