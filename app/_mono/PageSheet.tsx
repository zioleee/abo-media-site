"use client";
// Going from one page of the site to another: the blue sheet of the phone menu sweeps across the
// window with the logo's lean, the page changes under it, and it leaves on the far side while the new page's first
// screen comes in. It lives in the root layout, outside the pages, so that it stays while they change.
//   Only for a plain press on a link to another page of this site: not for a new tab (Ctrl / Cmd / middle button), not
//   for links that leave the site or stay on the page, not for the browser's Back and Forward, and not at all with
//   "reduce motion". If the next page takes long, the sheet waits for it (at most 6 s).
import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

const IN = 560; // ms: the sheet covers the window
const MENU = 170; // ms: from the phone menu, its lines go out first
const HOLD = 90; // ms: between the new page being there and the sheet starting to leave
const OUT = 900; // ms: the sheet leaves

export default function PageSheet() {
  const el = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const st = useRef<{ phase: "idle" | "in" | "out"; t0: number; arrived: boolean; timers: number[] }>({ phase: "idle", t0: 0, arrived: false, timers: [] });

  const leave = () => {
    const s = st.current, box = el.current;
    if (!box || s.phase !== "in") return;
    s.phase = "out";
    box.classList.remove("in");
    box.classList.add("out");
    s.timers.push(window.setTimeout(() => {
      box.classList.remove("out", "now");
      s.phase = "idle";
      s.timers = [];
    }, OUT + 40));
  };

  useEffect(() => {
    const s = st.current;
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      let url: URL;
      try { url = new URL(a.href, window.location.href); } catch { return; }
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;
      // (pages only: not a file, not one of the site's own service addresses)
      if (/\.[a-z0-9]+$/i.test(url.pathname) || /^\/(api|_next)\//.test(url.pathname) || /\/clients\/?$/.test(url.pathname)) return;
      if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const box = el.current;
      if (!box) return;
      e.preventDefault();
      if (s.phase !== "idle") return; // (one at a time)
      const href = url.pathname + url.search + url.hash;
      s.phase = "in"; s.arrived = false;
      box.classList.remove("out", "now");
      void box.offsetWidth;
      try { router.prefetch(href); } catch {}
      const menu = a.closest(".mm");
      if (menu) {
        // From the phone menu the window is under a blue sheet already. That sheet stays where it is while the menu's
        // lines go out (data-go); then this one — the same blue, the same grid — is simply there in its place, and
        // leaves as usual. (Sweeping in would show the old page for a moment between the two sheets.)
        menu.setAttribute("data-go", ""); // (an attribute: the menu's own class is rewritten as it closes)
        s.t0 = performance.now() - (IN - MENU - 60);
        s.timers.push(window.setTimeout(() => { box.classList.add("now", "in"); }, MENU));
        s.timers.push(window.setTimeout(() => router.push(href), MENU + 40));
      } else {
        s.t0 = performance.now();
        box.classList.add("in");
        s.timers.push(window.setTimeout(() => router.push(href), IN - 60));
      }
      // (a page that does not come: the sheet does not stay for ever)
      s.timers.push(window.setTimeout(leave, 6000));
    };
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      s.timers.forEach((t) => window.clearTimeout(t));
      s.timers = [];
    };
  }, [router]);

  // the new page is there: the sheet leaves (not before it has covered the window)
  useEffect(() => {
    const s = st.current;
    if (s.phase !== "in") return;
    s.arrived = true;
    const wait = Math.max(0, IN - (performance.now() - s.t0)) + HOLD;
    s.timers.push(window.setTimeout(leave, wait));
  }, [pathname]);

  return <div ref={el} className="pgs" aria-hidden="true"><i><b /></i></div>;
}
