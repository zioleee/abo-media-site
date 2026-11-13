// The footer of the boards: the logo (a link home), the tabs, the company's line; the copyright and the language below a
// hairline.
import Link from "next/link";
import { FOOTER, LOGO, TABS, UI, hrefOf, type Lang, type TabKey } from "./content";

export default function Footer({ lang, path, cur }: { lang: Lang; path: string; cur?: TabKey }) {
  const f = FOOTER[lang];
  // "Email. name@…": the address is a link (it was plain text)
  const cut = FOOTER.mail.indexOf(" ");
  const mailK = FOOTER.mail.slice(0, cut), mailV = FOOTER.mail.slice(cut + 1);
  return (
    <footer className="m1-pad m1-foot" data-m="fade">
      <div className="m1-g12" style={{ rowGap: 28, alignItems: "start" }}>
        <div style={{ gridColumn: "1 / 5" }}>
          <Link href={hrefOf(lang, "/")} aria-label={UI[lang].home} style={{ display: "block", width: "fit-content" }}>
            <img src={LOGO} alt="ABO MEDIA" style={{ height: 26, width: "auto", display: "block" }} />
          </Link>
        </div>
        <nav className="m1-fnav" style={{ gridColumn: "5 / 9" }} aria-label={UI[lang].footNav}>
          {TABS.map((x) => (
            <Link key={x.key} href={hrefOf(lang, x.path)} aria-current={x.key === cur ? "page" : undefined}>{x.label}</Link>
          ))}
        </nav>
        <div className="m1-finfo" style={{ gridColumn: "9 / 13" }}>
          <p style={{ fontWeight: 800 }}>{f.name}</p>
          <p style={{ marginTop: 6 }}>{f.addr}</p>
          <p><span className="nb">{FOOTER.tel}</span><span className="sp"> · </span><span className="nb">{mailK} <a href={`mailto:${mailV}`}>{mailV}</a></span></p>
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
