'use client'

import { Fragment, useEffect, useRef, useState } from "react";

// ========================================
// 팝업 내용 설정 - 여기만 수정하면 됩니다
// ========================================
const POPUP = {
  id: "news-2026-11",                 // 팝업을 바꿀 때 새 값으로 변경 (숨김 기록 초기화용)
  date: "2026.11.02",
  title: "(주)에이비오미디어 - (주)아틀라스컴퍼니 업무협약 체결",
  url: "https://n.news.naver.com/mnews/article/014/0005597965?sid=105",
  // 기사 대표 이미지(og:image). 비우거나 불러오지 못하면 브랜드 그라데이션 배경으로 표시
  image: "https://imgnews.pstatic.net/image/014/2026/11/02/0005597965_001_20261102115215546.jpg?type=w800",
  startAt: "2026-11-01T00:00:00+09:00",
  endAt: "2026-11-30T23:59:59+09:00",
};

const STORAGE_KEY = `abo-popup-hide:${POPUP.id}`;          // 오늘 하루 보지 않기 (localStorage)
const SESSION_KEY = `abo-popup-closed:${POPUP.id}`;        // 닫기 → 창을 닫을 때까지 숨김 (sessionStorage)

const AUTO_HIDE_SEC = 15;     // 등장 후 자동으로 빠지는 시간(초). 사진 아래 얇은 선이 줄어드는 걸로 표시
const SLIDE_IN_MS = 600;
const SLIDE_OUT_MS = 1200;    // 천천히 빠지도록

function todayKST() {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

function isKeyboardFocus(el: Element) {
  try {
    return el.matches(":focus-visible");
  } catch {
    return false;
  }
}

export default function NewsPopup() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const barRef = useRef<HTMLSpanElement>(null);
  const timer = useRef<Animation | null>(null);
  const holds = useRef({ hover: false, focus: false });

  useEffect(() => {
    const now = Date.now();
    if (now < Date.parse(POPUP.startAt) || now > Date.parse(POPUP.endAt)) return;
    try {
      if (localStorage.getItem(STORAGE_KEY) === todayKST()) return;
      if (sessionStorage.getItem(SESSION_KEY)) return;
    } catch {}
    // 첫 화면이 뜬 뒤 살짝 늦게 등장
    const t = setTimeout(() => {
      setOpen(true);
      requestAnimationFrame(() => setVisible(true));
    }, 800);
    return () => clearTimeout(t);
  }, []);

  // local: 오늘 하루 숨김 / session: 창을 닫을 때까지 숨김 / none: 기록 없음 (새로고침하면 다시 뜸)
  const dismiss = (storage: "local" | "session" | "none") => {
    try {
      if (storage === "local") localStorage.setItem(STORAGE_KEY, todayKST());
      else if (storage === "session") sessionStorage.setItem(SESSION_KEY, "1");
    } catch {}
    setVisible(false);
    setTimeout(() => setOpen(false), SLIDE_OUT_MS);
  };

  // 사진 아래 선이 AUTO_HIDE_SEC 동안 줄어든 뒤 자동으로 빠짐 (새로고침하면 다시 뜸)
  useEffect(() => {
    const bar = barRef.current;
    if (!visible || !bar) return;
    const anim = bar.animate([{ transform: "scaleX(1)" }, { transform: "scaleX(0)" }], {
      duration: AUTO_HIDE_SEC * 1000,
      easing: "linear",
      fill: "forwards",
    });
    anim.onfinish = () => dismiss("none");
    timer.current = anim;
    return () => {
      anim.pause(); // 빠지는 동안 선이 다시 차오르지 않게 그 자리에서 멈춤
      timer.current = null;
    };
  }, [visible]);

  // 마우스를 올려 두거나 키보드로 들어오면 멈춤. 터치는 제외 (탭한 뒤 풀리지 않아 계속 멈춰 있게 됨)
  const hold = (key: "hover" | "focus", on: boolean) => {
    holds.current[key] = on;
    const anim = timer.current;
    if (!anim || anim.playState === "finished") return;
    if (holds.current.hover || holds.current.focus) anim.pause();
    else anim.play();
  };

  if (!open) return null;

  const showImage = Boolean(POPUP.image) && !imageFailed;

  return (
    <aside
      aria-label="뉴스 알림"
      onPointerEnter={(e) => e.pointerType === "mouse" && hold("hover", true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && hold("hover", false)}
      onFocus={(e) => isKeyboardFocus(e.target) && hold("focus", true)}
      onBlur={() => hold("focus", false)}
      style={{ transitionDuration: `${visible ? SLIDE_IN_MS : SLIDE_OUT_MS}ms` }}
      // z-[45]: 헤더(z-40)보다 위, 모바일 메뉴(z-50)보다 아래 → 메뉴를 열면 메뉴가 팝업을 덮음
      className={`fixed inset-x-3 bottom-3 z-[45] mx-auto max-w-[400px] overflow-hidden rounded-xl bg-white shadow-[0_24px_48px_-16px_rgba(15,23,42,0.45)] ring-1 ring-black/5 transition-transform ease-in-out motion-reduce:transition-none md:inset-x-auto md:bottom-6 md:right-6 md:mx-0 md:w-[380px] md:max-w-none ${
        visible
          ? "translate-y-0 md:translate-x-0"
          : "translate-y-[calc(100%+1rem)] md:translate-y-0 md:translate-x-[calc(100%+2rem)]"
      }`}
    >
      <a
        href={POPUP.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block aspect-video overflow-hidden bg-[linear-gradient(135deg,#1c7a9e_0%,#2596be_55%,#3db3d9_100%)] outline-none"
      >
        {showImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={POPUP.image}
            alt=""
            onError={() => setImageFailed(true)}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
          />
        )}
        {/* 사진 위에서도 글씨가 읽히도록 아래쪽만 어둡게 */}
        <span aria-hidden className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
        <span className="absolute inset-x-0 bottom-0 px-4 pb-4">
          <span className="block text-xs tabular-nums text-white/80">{POPUP.date}</span>
          <span className="mt-1 line-clamp-3 text-balance text-base font-bold leading-[1.4] tracking-[-0.01em] text-white">
            {/* 띄어쓰기에서만 줄바꿈 ("(주)" 뒤에서 회사명이 끊기지 않게) */}
            {POPUP.title.split(" ").map((word, i) => (
              <Fragment key={i}>
                {i > 0 && " "}
                <span className="whitespace-nowrap">{word}</span>
              </Fragment>
            ))}
          </span>
        </span>
        {/* 자동으로 빠지기까지 남은 시간 */}
        <span ref={barRef} aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-[#3db3d9]" />
        {/* 키보드로 들어왔을 때 테두리 표시 (사진 위에 그려지도록 맨 마지막에 둠) */}
        <span aria-hidden className="pointer-events-none absolute inset-0 hidden ring-2 ring-inset ring-white group-focus-visible:block" />
      </a>

      <div className="flex h-10 items-center justify-between px-4 text-[13px]">
        <button
          type="button"
          onClick={() => dismiss("local")}
          className="text-gray-500 transition-colors hover:text-gray-900"
        >
          오늘 하루 보지 않기
        </button>
        <button
          type="button"
          onClick={() => dismiss("session")}
          className="font-medium text-gray-900 transition-colors hover:text-[#2596be]"
        >
          닫기
        </button>
      </div>
    </aside>
  );
}
