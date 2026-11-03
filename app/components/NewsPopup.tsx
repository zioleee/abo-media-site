'use client'

import { useEffect, useState } from "react";

// ========================================
// 팝업 내용 설정 - 여기만 수정하면 됩니다
// ========================================
const POPUP = {
  id: "news-2026-11",                 // 팝업을 바꿀 때 새 값으로 변경 (숨김 기록 초기화용)
  date: "2026.11.02",
  title: "(주)에이비오미디어 - (주)아틀라스컴퍼니 업무협약 체결",
  url: "https://n.news.naver.com/mnews/article/014/0005597965?sid=105",
  // 기사 대표 이미지(og:image). 비우면 브랜드 그라데이션 + 로고 표시
  image: "https://imgnews.pstatic.net/image/014/2026/11/02/0005597965_001_20261102115215546.jpg?type=w800",
  startAt: "2026-11-01T00:00:00+09:00",
  endAt: "2026-11-30T23:59:59+09:00",
};

const STORAGE_KEY = `abo-popup-hide:${POPUP.id}`;          // 오늘 하루 보지 않기 (localStorage)
const SESSION_KEY = `abo-popup-closed:${POPUP.id}`;        // 닫기 → 창을 닫을 때까지 숨김 (sessionStorage)

const AUTO_HIDE_SEC = 15;     // 등장 후 자동으로 빠지는 시간(초)
const SLIDE_IN_MS = 600;
const SLIDE_OUT_MS = 1200;    // 천천히 빠지도록

function todayKST() {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export default function NewsPopup() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [remaining, setRemaining] = useState(AUTO_HIDE_SEC);

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

  // 1초씩 카운트다운 후 자동으로 빠짐 (마우스를 올려 두는 동안은 멈춤, 새로고침하면 다시 뜸)
  useEffect(() => {
    if (!visible || hovered) return;
    if (remaining <= 0) {
      dismiss("none");
      return;
    }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [visible, hovered, remaining]);

  if (!open) return null;

  return (
    <aside
      aria-label="뉴스 알림"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ transitionDuration: `${visible ? SLIDE_IN_MS : SLIDE_OUT_MS}ms` }}
      className={`fixed inset-x-3 bottom-3 z-[100] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.25)] transition-transform ease-in-out md:inset-x-auto md:bottom-6 md:right-6 md:w-[380px] ${
        visible
          ? "translate-y-0 md:translate-x-0"
          : "translate-y-[calc(100%+1rem)] md:translate-y-0 md:translate-x-[calc(100%+2rem)]"
      }`}
    >
      <button
        type="button"
        onClick={() => dismiss("session")}
        aria-label="닫기"
        className="absolute right-1 top-1 z-10 flex h-8 w-8 items-center justify-center text-gray-400 hover:text-gray-800"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <path d="M1 1l12 12M13 1L1 13" />
        </svg>
      </button>

      <a href={POPUP.url} target="_blank" rel="noopener noreferrer" className="group flex gap-3 p-3 pr-9">
        <div className="relative h-[76px] w-[110px] shrink-0 overflow-hidden bg-[linear-gradient(135deg,#1c7a9e_0%,#2596be_50%,#3db3d9_100%)]">
          {POPUP.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={POPUP.image}
              alt=""
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/ABO_Logo_Transparent.png" alt="" className="h-8 w-auto brightness-0 invert" />
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-col justify-between">
          <div>
            <p className="text-xs text-gray-500">{POPUP.date}</p>
            <p className="mt-0.5 line-clamp-2 break-keep text-sm font-bold leading-snug text-gray-900 group-hover:text-[#2596be]">
              {POPUP.title}
            </p>
          </div>
          <span className="mt-1 text-xs font-semibold text-[#2596be]">
            기사 보기 <span aria-hidden>→</span>
          </span>
        </div>
      </a>

      <div className="flex items-center justify-between border-t border-gray-100 px-3">
        <p className="text-xs text-gray-400" aria-live="off">
          <span className="inline-block min-w-[1.25rem] text-right font-semibold tabular-nums text-[#2596be]">
            {Math.max(remaining, 0)}
          </span>
          초 뒤 자동으로 사라집니다
        </p>
        <button
          type="button"
          onClick={() => dismiss("local")}
          className="py-2 text-xs text-gray-500 hover:text-gray-800"
        >
          오늘 하루 보지 않기
        </button>
      </div>
    </aside>
  );
}
