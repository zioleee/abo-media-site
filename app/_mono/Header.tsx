"use client";
// The header of the boards: the logo, the five tabs (the current one in bold after a leaning stroke), the language
// switch; on a phone the language and the menu button. `wordmark`: the main page's header, where the mark has left the
// logo to become the first screen. `ghost`: the same header once more, drawn in white over the main page's film
// (not read out, not in the tab order — the real one is).
import Link from "next/link";
import { LOGO, TABS, UI, hrefOf, type Lang, type TabKey } from "./content";
import { Hamburger } from "./parts";
import { useMono } from "./MonoRoot";

export default function Header({ lang, path, cur, wordmark = false, ghost = false }: { lang: Lang; path: string; cur?: TabKey; wordmark?: boolean; ghost?: boolean }) {
  const { openMenu, menuOpen } = useMono();
  const t = UI[lang];
  const tab = ghost ? -1 : undefined;
  const img = <img src={LOGO} alt={ghost ? "" : "ABO MEDIA"} />;
  const ko = hrefOf("ko", path), en = hrefOf("en", path);
  const inner = (
    <>
      <Link href={hrefOf(lang, "/")} className="m1-logo" aria-label={ghost ? undefined : t.home} tabIndex={tab}>
        {wordmark ? <span className="b-wm">{img}</span> : img}
      </Link>
      <nav className="m1-nav" aria-label={ghost ? undefined : t.nav}>
        {TABS.map((x) => (
          <Link key={x.key} href={hrefOf(lang, x.path)} aria-current={x.key === cur ? "page" : undefined} tabIndex={tab}>{x.label}</Link>
        ))}
        <span className="m1-lang">
          {lang === "ko" ? <b>KOR</b> : <Link href={ko} hrefLang="ko" lang="ko" tabIndex={tab}>KOR</Link>}
          {" / "}
          {lang === "en" ? <b>ENG</b> : <Link href={en} hrefLang="en" lang="en" tabIndex={tab}>ENG</Link>}
        </span>
      </nav>
      <div className="m1-mbtn">
        <span>{t.now}</span>
        <button
          type="button"
          tabIndex={tab}
          aria-label={ghost ? undefined : t.menuOpen}
          aria-expanded={ghost ? undefined : menuOpen}
          aria-controls={ghost ? undefined : "mono-menu"}
          onClick={(e) => openMenu(ghost ? null : e.currentTarget)}
        >
          <Hamburger />
        </button>
      </div>
    </>
  );
  return ghost ? <div className="m1-bar m1-pad">{inner}</div> : <header className="m1-bar m1-pad">{inner}</header>;
}
