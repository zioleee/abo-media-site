// The five tabs (and the pages made like them): what moves besides the arrivals (the engine's own).
// From the boards (m4kit.EXTRA). The Works page's years open and close in the page itself (WorksWall), not here.
export default function tabsMotion({ $, $$, W, X }) {
  const slabw = $('.m1-slabw'), hero = $('.m1-hero');
  // Works on a phone: the posters at mid-screen bloom into colour
  let cards = $$('.m1-work');
  X.frame = (c) => {
    // the slab falls behind the page as it scrolls and leans away from the pointer
    if (slabw && hero && c.y < hero.offsetHeight + 60) slabw.style.transform = 'translate3d(' + (-c.ptr.sx * 16).toFixed(2) + 'px,' + (c.y * 0.2).toFixed(1) + 'px,0)';
    if (cards.length && W <= 760) {
      cards.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (!r.height || r.bottom < -200 || r.top > c.H + 200) return;
        const mid = r.top + r.height * 0.42;
        el.classList.toggle('lit', mid > c.H * 0.2 && mid < c.H * 0.68);
      });
    }
  };
  // the list arrived from the CMS
  X.rescan = () => { cards = $$('.m1-work'); };
  X.stop = () => {
    if (slabw) slabw.style.transform = '';
    cards.forEach((el) => el.classList.remove('lit'));
  };
}
