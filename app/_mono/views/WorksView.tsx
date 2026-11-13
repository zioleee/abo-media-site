// Works (board: M4-Works): the first screen, then the wall — a serif year beside its posters, every poster in the
// one blue until it is looked at. The list is the CMS's, read in the browser as before.
import MonoRoot from "../MonoRoot";
import Hero from "../Hero";
import Footer from "../Footer";
import NextDoor from "../NextDoor";
import WorksWall from "./WorksWall";
import { HERO, TAGW, hrefOf, type Lang } from "../content";

export default function WorksView({ lang }: { lang: Lang }) {
  const path = "/works";
  return (
    <MonoRoot key={hrefOf(lang, path)} page="works" lang={lang} path={path} cur="works">
      <main>
        <Hero lang={lang} path={path} cur="works" name="Works" tgw={TAGW.works} columns={HERO.works[lang]} />
        <WorksWall lang={lang} />
        <NextDoor lang={lang} cur="works" />
      </main>
      <Footer lang={lang} path={path} cur="works" />
    </MonoRoot>
  );
}
