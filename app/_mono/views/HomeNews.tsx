"use client";
// The news notice of the main page, as a line at the foot of the first screen (Korean page only). Same rules as the
// popup it replaces: shown between its dates; "오늘 하루 보지 않기" hides it for the day, "닫기" until the window is
// closed (the same storage keys, so whoever hid the popup today does not see the line); by itself it leaves after its
// fifteen seconds — counted on its own hairline, which waits while the pointer rests on the line or it holds the focus.
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUR } from "../parts";
import { HOME, NOTICE, type Lang } from "../content";

const STORAGE_KEY = `abo-popup-hide:${NOTICE.id}`; // 오늘 하루 보지 않기 (localStorage)
const SESSION_KEY = `abo-popup-closed:${NOTICE.id}`; // 닫기 → until the window is closed (sessionStorage)

function todayKST() {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

function due() {
  const now = Date.now();
  if (now < Date.parse(NOTICE.startAt) || now > Date.parse(NOTICE.endAt)) return false;
  try {
    if (localStorage.getItem(STORAGE_KEY) === todayKST()) return false;
    if (sessionStorage.getItem(SESSION_KEY)) return false;
  } catch {}
  return true;
}

export default function HomeNews({ lang }: { lang: Lang }) {
  const h = HOME[lang];
  const [on, setOn] = useState(false);
  const line = useRef<HTMLSpanElement>(null);
  const anim = useRef<Animation | null>(null);
  const holds = useRef({ hover: false, focus: false });

  useEffect(() => {
    if (lang === "ko" && due()) setOn(true);
  }, [lang]);

  const dismiss = useCallback((storage: "local" | "session" | "none") => {
    try {
      if (storage === "local") localStorage.setItem(STORAGE_KEY, todayKST());
      else if (storage === "session") sessionStorage.setItem(SESSION_KEY, "1");
    } catch {}
    setOn(false);
  }, []);

  // the countdown starts once the line has come in with the first screen
  useEffect(() => {
    const pl = line.current;
    if (!on || !pl || typeof pl.animate !== "function") return;
    const still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = window.setTimeout(() => {
      const a = pl.animate([{ transform: "scaleX(1)" }, { transform: "scaleX(0)" }], { duration: NOTICE.seconds * 1000, easing: "linear", fill: "forwards" });
      a.onfinish = () => dismiss("none");
      if (holds.current.hover || holds.current.focus) a.pause();
      anim.current = a;
    }, still ? 800 : 3200);
    return () => {
      window.clearTimeout(t);
      if (anim.current) { anim.current.onfinish = null; anim.current.cancel(); anim.current = null; }
    };
  }, [on, dismiss]);

  const hold = (key: "hover" | "focus", v: boolean) => {
    holds.current[key] = v;
    const a = anim.current;
    if (!a) return;
    if (holds.current.hover || holds.current.focus) a.pause();
    else if (a.playState === "paused") a.play();
  };

  if (lang !== "ko") {
    return <div className="b-news off"><i className="pl" aria-hidden="true" style={{ transform: "scaleX(0)" }} /></div>;
  }
  const words = NOTICE.title.split(" ");
  return (
    <div
      className={"b-news" + (on ? "" : " off")}
      inert={!on || undefined}
      onMouseEnter={() => hold("hover", true)}
      onMouseLeave={() => hold("hover", false)}
      onFocus={() => hold("focus", true)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) hold("focus", false); }}
    >
      <i ref={line} className="pl" aria-hidden="true" style={on ? undefined : { transform: "scaleX(0)" }} />
      <span className="lb">{h.newsLabel}</span>
      <span className="dt">{NOTICE.date}</span>
      <span className="tw">
        <a href={NOTICE.url} target="_blank" rel="noopener noreferrer">
          <span>{words.slice(0, -2).join(" ")} <span className="nb">{words.slice(-2).join(" ")}</span></span>
          <ArrowUR />
        </a>
      </span>
      <span className="sp" />
      <button type="button" onClick={() => dismiss("local")}>{h.hide}</button>
      <button type="button" className="x" onClick={() => dismiss("session")}>{h.close}</button>
    </div>
  );
}
