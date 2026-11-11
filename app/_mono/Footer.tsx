// The footer of the boards: the logo, the tabs, the company's line; the copyright and the language below a hairline.
import Link from "next/link";
import { FOOTER, LOGO, TABS, UI, hrefOf, type Lang, type TabKey } from "./content";

export default function Footer({ lang, path, cur }: { lang: Lang; path: string; cur?: TabKey }) {
  const f = FOOTER[lang];
  return (
    <footer className="m1-pad m1-foot" data-m="fade">
      <div className="m1-g12" style={{ rowGap: 28, alignItems: "start" }}>
        <div style={{ gridColumn: "1 / 5" }}>
          <img src={LOGO} alt="ABO MEDIA" style={{ height: 26, width: "auto", display: "block" }} />
        </div>
        <nav className="m1-fnav" style={{ gridColumn: "5 / 9" }} aria-label={UI[lang].footNav}>
          {TABS.map((x) => (
            <Link key={x.key} href={hrefOf(lang, x.path)} aria-current={x.key === cur ? "page" : undefined}>{x.label}</Link>
          ))}
        </nav>
        <div className="m1-finfo" style={{ gridColumn: "9 / 13" }}>
          <p style={{ fontWeight: 800 }}>{f.name}</p>
          <p style={{ marginTop: 6 }}>{f.addr}</p>
          <p>{FOOTER.tel} · {FOOTER.mail}</p>
        </div>
      </div>
      <div className="m1-fbot">
        <p>© {new Date().getFullYear()} ABO MEDIA. All rights reserved.</p>
        <p style={{ letterSpacing: ".06em" }}>
          {lang === "ko" ? <b style={{ fontWeight: 800 }}>KOR</b> : <Link href={hrefOf("ko", path)} hrefLang="ko" lang="ko">KOR</Link>}
          {" / "}
          {lang === "en" ? <b style={{ fontWeight: 800 }}>ENG</b> : <Link href={hrefOf("en", path)} hrefLang="en" lang="en">ENG</Link>}
        </p>
      </div>
    </footer>
  );
}
