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

export default function AboutEN() {
  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1c7a9e] via-[#2596be] to-[#3db3d9] text-white py-20">
        <div className="container-main">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">ABOUT</h1>
          <p className="text-lg text-white/90">
            Introducing ABO Media
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
              ABO MEDIA creates content based on three core values
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
                  Talented and skilled<br />
                  <span className="text-white/90 font-semibold">production team</span>
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
                  Outstanding and successful<br />
                  <span className="text-white/90 font-semibold">achievements and track record</span>
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
                  Creative ideas and<br />
                  <span className="text-white/90 font-semibold">innovative direction</span>
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Message */}
          <div className="mt-24 text-center max-w-3xl mx-auto">
            <p className="text-xl md:text-2xl text-white/80 leading-relaxed">
              ABO Media creates content that brings <span className="text-[#3db3d9] font-bold">emotion</span> and <span className="text-[#3db3d9] font-bold">joy</span><br className="hidden md:block" />
              to viewers based on <span className="text-[#3db3d9] font-bold">talent</span>, <span className="text-[#3db3d9] font-bold">achievement</span>, and <span className="text-[#3db3d9] font-bold">originality</span>.
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
            <p className="mt-6 text-lg text-gray-600">Partners we've grown with</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {['KBS', 'MBC', 'SBS', 'tvN', 'JTBC', 'MBN', 'TV Chosun', 'Wavve', 'WATCHA', 'U+ Mobile TV', 'E Channel', 'JYP'].map((partner) => (
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