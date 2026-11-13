"use client";
// The phone menu: a blue sheet with the sheared white grid sweeps in with the logo's lean; the tabs in the serif (no
// numbers beside them — user, 2026-11-13), the one you are on held between the two strokes; the language switch and
// the company's line at its foot.
import Link from "next/link";
import { useEffect, useRef } from "react";
import { FOOTER, LOGO, TABS, UI, hrefOf, type Lang, type TabKey } from "./content";
import { Cross, vars } from "./parts";

export default function MobileMenu({ lang, path, cur, open, onClose }: { lang: Lang; path: string; cur?: TabKey; open: boolean; onClose: () => void }) {
  const t = UI[lang];
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const before = html.style.overflow;
    html.style.overflow = "hidden";
    const focus = requestAnimationFrame(() => closeBtn.current?.focus({ preventScroll: true }));
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    // the menu belongs to the phone layout: a window made wide closes it
    const onSize = () => { if (window.innerWidth > 760) onClose(); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onSize);
    return () => {
      cancelAnimationFrame(focus);
      html.style.overflow = before;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onSize);
    };
  }, [open, onClose]);

  const ko = hrefOf("ko", path), en = hrefOf("en", path);
  return (
    <div className={"mm" + (open ? " on" : "")} id="mono-menu" role="dialog" aria-modal="true" aria-label={t.menu} lang={lang} inert={!open || undefined}>
      <div className="mm-sheet" aria-hidden="true"><i /></div>
      <div className="mm-in">
        <div className="mm-bar">
          <Link href={hrefOf(lang, "/")} className="mm-logo" aria-label={t.home} onClick={onClose}>
            <img src={LOGO} alt="ABO MEDIA" />
          </Link>
          <div className="mm-btn">
            <span>{t.now}</span>
            <button ref={closeBtn} type="button" aria-label={t.menuClose} onClick={onClose}><Cross /></button>
          </div>
        </div>
        <nav className="mm-nav" aria-label={t.nav}>
          {TABS.map((x, i) => (
            <Link key={x.key} href={hrefOf(lang, x.path)} className="mm-it" style={vars({ "--k": i + 1 })} aria-current={x.key === cur ? "page" : undefined} onClick={onClose}>
              <span className="tx"><i aria-hidden="true" /><span>{x.label}</span><i aria-hidden="true" /></span>
            </Link>
          ))}
        </nav>
        <div className="mm-foot" style={vars({ "--k": TABS.length + 1 })}>
          <p className="mm-lang">
            {lang === "ko" ? <b>KOR</b> : <Link href={ko} hrefLang="ko" lang="ko" onClick={onClose}>KOR</Link>}
            {" / "}
            {lang === "en" ? <b>ENG</b> : <Link href={en} hrefLang="en" lang="en" onClick={onClose}>ENG</Link>}
          </p>
          <p className="mm-info">{FOOTER.tel}<br />{FOOTER.mail}</p>
        </div>
      </div>
    </div>
  );
}
