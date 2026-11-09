'use client'

// COUNTER-style header: logo left, translucent pill nav in the centre,
// language switch + round menu button on the right, full-screen blue menu.
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import logo from "@/public/counter/abo-logo.png";
import { COMMON, COMPANY, NAV, type Lang } from "./content";
import { ArrowUR, Strips } from "./ui";

function MenuIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <rect x="1" y="1" width="5" height="5" />
      <rect x="10" y="1" width="5" height="5" />
      <rect x="1" y="10" width="5" height="5" />
      <rect x="10" y="10" width="5" height="5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export default function CounterHeader({ pathname }: { pathname: string }) {
  const lang: Lang = pathname.startsWith("/en") ? "en" : "ko";
  const t = COMMON[lang];
  const nav = NAV[lang];
  const hasColorHero = pathname === "/about" || pathname === "/en/about";

  const [scrollY, setScrollY] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => setOpen(false), [pathname]);

  // On the About page the header sits on the blue hero until it has scrolled past it.
  const heroLimit = hasColorHero ? 460 : 24;
  const solid = scrollY > heroLimit;
  const onColor = hasColorHero && !solid;

  const koreanPath = pathname.replace(/^\/en/, "") || "/";
  const englishPath = "/en" + (lang === "en" ? pathname.replace(/^\/en/, "") : pathname);
  const isCurrent = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <header className={`c-header c-wrap${solid ? " is-solid" : ""}`}>
        <Link href={lang === "en" ? "/en" : "/"} className={`c-logo${onColor ? " on-color" : ""}`} aria-label={t.home}>
          <Image src={logo} alt="ABO MEDIA" priority sizes="190px" />
        </Link>

        <nav className="c-pill c-desk" aria-label="Main">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} aria-current={isCurrent(item.href) ? "page" : undefined}>
              {item.label.toUpperCase()}
            </Link>
          ))}
          <span className="c-pill-lang">
            <Link href={koreanPath} aria-current={lang === "ko" ? "true" : undefined}>
              KOR
            </Link>
            <span aria-hidden="true">/</span>
            <Link href={englishPath} aria-current={lang === "en" ? "true" : undefined}>
              ENG
            </Link>
          </span>
        </nav>

        <div className="c-hright">
          <button type="button" className="c-round" aria-label={t.menuOpen} aria-expanded={open} onClick={() => setOpen(true)}>
            <MenuIcon />
          </button>
        </div>
      </header>

      <div className="c-float c-desk">
        <Link href={lang === "en" ? "/en/works" : "/works"}>
          {t.floatWorks} <ArrowUR size={14} />
        </Link>
        <Link href={lang === "en" ? "/en/contact" : "/contact"}>
          {t.floatContact} <ArrowUR size={14} />
        </Link>
      </div>

      {open && (
        <div className="c-menu c-wrap" role="dialog" aria-modal="true" aria-label="Menu">
          <Strips spec={[[58, 0, 26, 42, 0], [84, 42, 16, 58, -5]]} />
          <div className="c-menu-top">
            <Link href={lang === "en" ? "/en" : "/"} className="c-logo on-color" aria-label={t.home} onClick={() => setOpen(false)}>
              <Image src={logo} alt="ABO MEDIA" sizes="190px" />
            </Link>
            <button type="button" className="c-round" aria-label={t.menuClose} onClick={() => setOpen(false)}>
              <CloseIcon />
            </button>
          </div>
          <ul className="c-menu-list">
            {nav.map((item, i) => (
              <li key={item.href}>
                <Link href={item.href} onClick={() => setOpen(false)}>
                  {item.label}
                  <small>(0{i + 1})</small>
                </Link>
              </li>
            ))}
          </ul>
          <div className="c-menu-foot">
            <p style={{ margin: 0 }}>
              {COMPANY.name[lang]}
              <br />
              {COMPANY.addr[lang]}
              <br />
              Tel. {COMPANY.tel} · Email. {COMPANY.mail}
            </p>
            <p className="c-lang on-color" style={{ margin: 0, fontSize: 13 }}>
              <Link href={koreanPath} aria-current={lang === "ko" ? "true" : undefined} onClick={() => setOpen(false)}>
                KOR
              </Link>
              <span aria-hidden="true">/</span>
              <Link href={englishPath} aria-current={lang === "en" ? "true" : undefined} onClick={() => setOpen(false)}>
                ENG
              </Link>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
