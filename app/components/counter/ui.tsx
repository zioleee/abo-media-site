// Shared building blocks for the COUNTER-style sub pages.
import Link from "next/link";
import type { ReactNode } from "react";
import type { Lang } from "./content";
import { COMMON } from "./content";

/** Grid-paper strips: [left%, top%, width%, height%, animationDelaySeconds] */
export type StripSpec = [number, number, number, number, number];

export function Strips({ spec, keepFirst = false }: { spec: StripSpec[]; keepFirst?: boolean }) {
  return (
    <>
      {spec.map(([l, t, w, h, d], i) => (
        <div
          key={i}
          aria-hidden="true"
          className={`c-strip${keepFirst && i === 0 ? " c-keep" : ""}`}
          style={{ left: `${l}%`, top: `${t}%`, width: `${w}%`, height: `${h}%`, animationDelay: `${d}s` }}
        />
      ))}
    </>
  );
}

export function ArrowUR({ size = 18, stroke = 1.6 }: { size?: number; stroke?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export function ArrowR({ size = 18, stroke = 1.6 }: { size?: number; stroke?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} aria-hidden="true">
      <path d="M4 12h16M14 6l6 6-6 6" />
    </svg>
  );
}

export function PageHead({
  title,
  sub,
  crumb,
  lang,
  aside,
}: {
  title: string;
  sub: string;
  crumb: string;
  lang: Lang;
  aside?: ReactNode;
}) {
  return (
    <section className="c-phead c-wrap">
      <h1 className="c-h">{title}</h1>
      <p className="c-phead-sub">{sub}</p>
      {aside}
      <p className="c-crumb">
        <Link href={lang === "en" ? "/en" : "/"}>TOP</Link>
        <span aria-hidden="true" style={{ color: "inherit", margin: "0 6px" }}>
          ·
        </span>
        <span>{crumb}</span>
      </p>
    </section>
  );
}

export function CtaBlock({ lang }: { lang: Lang }) {
  const t = COMMON[lang];
  const prefix = lang === "en" ? "/en" : "";
  return (
    <section className="c-wrap c-bg" style={{ paddingTop: 96, paddingBottom: 96, borderTop: "1px solid var(--c-blue)" }}>
      <div className="c-cta">
        <Link href={`${prefix}/works`}>
          <p className="c-serif" style={{ fontSize: "clamp(40px, 4vw, 58px)" }}>
            (Works)
          </p>
          <p className="c-cta-t">{t.ctaWorks}</p>
          <p className="c-cta-s">{t.ctaWorksSub}</p>
          <span className="c-cta-arrow">
            <ArrowUR size={30} stroke={1.4} />
          </span>
        </Link>
        <Link href={`${prefix}/contact`}>
          <p className="c-serif" style={{ fontSize: "clamp(40px, 4vw, 58px)" }}>
            (Contact)
          </p>
          <p className="c-cta-t">{t.ctaContact}</p>
          <p className="c-cta-s">{t.ctaContactSub}</p>
          <span className="c-cta-arrow">
            <ArrowUR size={30} stroke={1.4} />
          </span>
        </Link>
      </div>
    </section>
  );
}
