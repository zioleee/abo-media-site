// The first screen of every tab: the tab's name as a big serif label, the blue leaning slab, the title set vertically.
// (No "Scroll" mark here — user, 2026-11-14: the round mark is the main page's alone.)
import Header from "./Header";
import { Tag, vars, verticalTitle } from "./parts";
import type { Columns, Lang, TabKey } from "./content";

export default function Hero({ lang, path, cur, name, tgw, columns }: { lang: Lang; path: string; cur?: TabKey; name: string; tgw: number; columns: Columns }) {
  const { node, vn, text } = verticalTitle(columns, lang);
  return (
    <section className="m1-hero" style={vars({ "--vn": vn, "--tgw": tgw })}>
      <div className="m1-slabw" aria-hidden="true"><div className="m1-slab"><i /></div></div>
      <Header lang={lang} path={path} cur={cur} />
      <p style={{ margin: 0 }} aria-hidden="true"><Tag text={name} cls="big" /></p>
      <div className="m1-vtw">
        <h1 className="m1-vt" aria-label={`${name.toUpperCase()} — ${text}`}><span aria-hidden="true">{node}</span></h1>
      </div>
    </section>
  );
}
