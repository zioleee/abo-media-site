// (Trial, 2026-11-14.) A tab ends the way the main page does: with a door to another page. The next tab's name stands as
// the big serif label, beside it that page's own title (the one set vertically on its first screen) as a line; under
// the pointer the blue slab sweeps across the whole band with the logo's lean. About → Business → Works → News → Contact;
// Contact, the last, has none.
import { Fragment } from "react";
import Link from "next/link";
import { ArrowUR, Tag, vars } from "./parts";
import { HERO, TABS, TAGW, hrefOf, type Lang, type TabKey } from "./content";

export default function NextDoor({ lang, cur }: { lang: Lang; cur: TabKey }) {
  const next = TABS[TABS.findIndex((t) => t.key === cur) + 1];
  if (!next) return null;
  const cols = HERO[next.key][lang];
  const text = cols.map((c) => c.map((s) => (typeof s === "string" ? s : s.b)).join("")).join(" ");
  return (
    <section className="m1-door" style={vars({ "--tgw": TAGW[next.key] })}>
      <Link href={hrefOf(lang, next.path)} className="m1-door-a m1-pad" aria-label={`${next.label} — ${text}`}>
        <span className="sw" aria-hidden="true"><i /></span>
        <span className="k" aria-hidden="true" data-m="fade">Next</span>
        <span className="ar" aria-hidden="true" data-m="fade"><ArrowUR /></span>
        <span className="lb" aria-hidden="true" data-m="line" data-at="0.97"><Tag text={next.label} /></span>
        <span className="tl" aria-hidden="true" data-m="rise" data-at="0.97">
          {cols.map((c, i) => (
            <Fragment key={i}>
              {i > 0 ? " " : null}
              {c.map((s, j) => (typeof s === "string" ? <Fragment key={j}>{s}</Fragment> : <b key={j}>{s.b}</b>))}
            </Fragment>
          ))}
        </span>
      </Link>
    </section>
  );
}
