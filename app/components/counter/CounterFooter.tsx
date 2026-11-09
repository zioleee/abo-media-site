// COUNTER-style footer: blue band with a grid-paper strip.
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/counter/abo-logo.png";
import { COMPANY, NAV, type Lang } from "./content";
import { Strips } from "./ui";

export default function CounterFooter({ lang }: { lang: Lang }) {
  return (
    <footer className="c-footer c-wrap">
      <Strips spec={[[70, 0, 16, 70, -3]]} />
      <div className="c-footer-in">
        <div style={{ display: "grid", gap: 18 }}>
          <Image src={logo} alt="ABO MEDIA" sizes="200px" />
          <p>
            {COMPANY.name[lang]}
            <br />
            {COMPANY.addr[lang]}
            <br />
            Tel. {COMPANY.tel} · Email. {COMPANY.mail}
          </p>
        </div>
        <nav aria-label="Footer">
          {NAV[lang].map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label.toUpperCase()}
            </Link>
          ))}
        </nav>
      </div>
      <p className="c-copy">© {new Date().getFullYear()} ABO MEDIA. All rights reserved.</p>
    </footer>
  );
}
