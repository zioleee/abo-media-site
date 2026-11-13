// Contact (board: M4-Contact, with the drawn map): the address, the number and the e-mail at one width in the serif;
// how to get there and the map apps; the map in the one blue, leaning like the logo (© OpenStreetMap contributors).
import MonoRoot from "../MonoRoot";
import Hero from "../Hero";
import Footer from "../Footer";
import { ArrowUR, Tag, vars } from "../parts";
import { CONTACT, HERO, TAGW, hrefOf, type Lang } from "../content";
import { MAP_HTML } from "../map";

export default function ContactView({ lang }: { lang: Lang }) {
  const c = CONTACT[lang];
  const path = "/contact";
  return (
    <MonoRoot key={hrefOf(lang, path)} page="contact" lang={lang} path={path} cur="contact">
      <main>
        <Hero lang={lang} path={path} cur="contact" name="Contact" tgw={TAGW.contact} columns={HERO.contact[lang]} />
        <section className="m1-idn m1-pad">
          <div className="m1-g12"><p style={{ gridColumn: "1 / 6" }} data-m="line"><Tag text={c.location} cls="mid" /></p></div>
          <div className="m1-crows">
            <div className="m1-g12 m1-crow">
              <p className="k" data-m="fade">{c.addrLabel}</p>
              <p className="v m1-addr" data-m="rise" style={vars({ "--d": ".08s" })}><b>{c.addr[0]}</b>{c.addr[1]}</p>
            </div>
            <div className="m1-g12 m1-crow">
              <p className="k" data-m="fade">{c.telLabel}</p>
              <p className="v"><a href={c.telHref} className="m1-fit" style={vars({ "--wem": c.telW })}><span data-m="line" style={vars({ "--d": ".08s" })}>{c.tel}</span></a></p>
            </div>
            <div className="m1-g12 m1-crow">
              <p className="k" data-m="fade">{c.mailLabel}</p>
              <p className="v"><a href={`mailto:${c.mail}`} className="m1-fit" style={vars({ "--wem": c.mailW })}><span data-m="line" style={vars({ "--d": ".08s" })}>{c.mail}</span></a></p>
            </div>
          </div>
        </section>
        <section className="m1-hist">
          <div className="m1-paper" aria-hidden="true" />
          <div className="m1-pad" style={{ position: "relative" }}>
            <div className="m1-g12" style={{ alignItems: "end" }}>
              <p style={{ gridColumn: "1 / 5" }} data-m="line"><Tag text={c.mapLabel} cls="mid" /></p>
              <div className="m1-dir" data-m="rise" style={vars({ "--d": ".12s" })}>
                <p className="m1-way"><span className="k">{c.directions}</span><span className="t"><b>{c.station}</b><i aria-hidden="true" />{c.walk}</span></p>
                <p className="m1-apps">
                  <span className="k">{c.viewMap}</span>
                  {c.apps.map(([name, url]) => (
                    <a key={name} href={url} target="_blank" rel="noopener" className="m1-btn sm"><span>{name}</span><ArrowUR /></a>
                  ))}
                </p>
              </div>
            </div>
            <div className="m1-map" data-m="map" data-at="0.8" role="img" aria-label={c.mapAria}>
              <div className="in" dangerouslySetInnerHTML={{ __html: MAP_HTML[lang] }} />
            </div>
            <p className="m1-osm"><a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">© OpenStreetMap contributors</a></p>
          </div>
        </section>
      </main>
      <Footer lang={lang} path={path} cur="contact" />
    </MonoRoot>
  );
}
