// Pages with only a line to say (IR, page not found): the tabs' first screen, then the line.
import Link from "next/link";
import MonoRoot from "../MonoRoot";
import Hero from "../Hero";
import Footer from "../Footer";
import { ArrowUR } from "../parts";
import { TAGW, hrefOf, type Columns, type Lang } from "../content";

export default function NoteView({ lang, path, page, name, columns, text, home }: { lang: Lang; path: string; page: string; name: string; columns: Columns; text: string; home?: string }) {
  return (
    <MonoRoot key={hrefOf(lang, path)} page={page} lang={lang} path={path}>
      <main>
        <Hero lang={lang} path={path} name={name} tgw={TAGW[name.toLowerCase()] ?? 2.5} columns={columns} />
        <section className="m1-note m1-pad">
          <div className="m1-g12">
            <p className="m1-ititle" data-m="rise">{text}</p>
            {home && (
              <p className="m1-btns" data-m="rise"><Link href={hrefOf(lang, "/")} className="m1-btn"><span>{home}</span><ArrowUR /></Link></p>
            )}
          </div>
        </section>
      </main>
      <Footer lang={lang} path={path} />
    </MonoRoot>
  );
}
