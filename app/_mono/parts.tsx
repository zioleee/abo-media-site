// Small pieces every page uses, as on the boards: the serif label between two leaning strokes, the arrows,
// a poster in the 1 : 1.414 frame, the logo's forms, a title set vertically.
import { Fragment, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";
import { FORMS, MARK } from "./marks";
import type { Columns, Lang } from "./content";
import { hygraphSrcSet, optimizeHygraphImage } from "./data";

/** inline styles with custom properties */
export const vars = (o: Record<string, string | number | undefined>) => o as CSSProperties;

/** a serif label held between two strokes that lean like the logo */
export function Tag({ text, cls = "", ...rest }: { text: string; cls?: string } & HTMLAttributes<HTMLSpanElement>) {
  // the serif's W leans over the o: the pair gets a little air
  const inner = text.startsWith("Wo") ? (<><span style={{ marginRight: ".04em" }}>W</span>{text.slice(1)}</>) : text;
  return (
    <span className={"m1-tag" + (cls ? " " + cls : "")} {...rest}>
      <i aria-hidden="true" />
      <span>{inner}</span>
      <i aria-hidden="true" />
    </span>
  );
}

export const ArrowD = () => (
  <svg width="14" height="18" viewBox="0 0 14 18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M7 0v16M1 10l6 6 6-6" /></svg>
);
export const ArrowUR = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M2.5 13.5 13 3M5 3h8v8" /></svg>
);
export const Plus = () => (
  <svg className="p" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M8 1v14M1 8h14" /></svg>
);
export const Minus = () => (
  <svg className="m" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M1 8h14" /></svg>
);
export const Hamburger = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M3 7h14M3 13h14" /></svg>
);
export const Cross = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M4.5 4.5l11 11M15.5 4.5l-11 11" /></svg>
);

// ------------------------------------------------------------------ posters
const FRAME = 1 / 1.414; // the frame (width / height): the A-series ratio most posters have
const pc = (v: number) => v.toFixed(3);

/** A poster in the 1 : 1.414 frame, never cropped. One that matches the frame fills it; a slightly different one is
 *  completed by its own edges mirrored outward (a few pixels); a very different one stands whole over a soft copy of itself.
 *  `sizes`: how wide it is shown (as for an <img>) — with it a CMS picture is offered at 400 and 800 px, and a dense
 *  screen takes the larger one. */
export function Poster({ src, ratio, alt, lazy = true, width = 400, sizes }: { src?: string | null; ratio?: number | null; alt: string; lazy?: boolean; width?: number; sizes?: string }) {
  if (!src) return <span className="pst" />;
  const url = optimizeHygraphImage(src, width);
  const set = sizes ? hygraphSrcSet(src, [400, 800]) : undefined;
  const io = { ...(lazy ? ({ loading: "lazy", decoding: "async" } as const) : ({ decoding: "async" } as const)), ...(set ? { srcSet: set, sizes } : {}) };
  if (ratio && Math.abs((ratio - FRAME) / FRAME) <= 0.015) {
    return <span className="pst"><img className="cv" src={url} alt={alt} {...io} /></span>;
  }
  if (ratio && Math.abs((ratio - FRAME) / FRAME) <= 0.1) {
    let main: CSSProperties, c1: CSSProperties, c2: CSSProperties;
    if (ratio < FRAME) {
      // narrower than the frame: spare room left and right
      const pw = (100 * ratio) / FRAME, bar = (100 - pw) / 2;
      main = { left: `${pc(bar)}%`, top: 0, width: `${pc(pw)}%`, height: "100%" };
      c1 = { left: `calc(${pc(bar - pw)}% + 1.5px)`, top: 0, width: `${pc(pw)}%`, height: "100%", transform: "scaleX(-1)" };
      c2 = { left: `calc(${pc(bar + pw)}% - 1.5px)`, top: 0, width: `${pc(pw)}%`, height: "100%", transform: "scaleX(-1)" };
    } else {
      // wider: spare room above and below
      const ph = (100 * FRAME) / ratio, bar = (100 - ph) / 2;
      main = { left: 0, top: `${pc(bar)}%`, width: "100%", height: `${pc(ph)}%` };
      c1 = { left: 0, top: `calc(${pc(bar - ph)}% + 1.5px)`, width: "100%", height: `${pc(ph)}%`, transform: "scaleY(-1)" };
      c2 = { left: 0, top: `calc(${pc(bar + ph)}% - 1.5px)`, width: "100%", height: `${pc(ph)}%`, transform: "scaleY(-1)" };
    }
    return (
      <span className="pst mr">
        <img src={url} alt="" aria-hidden="true" style={c1} {...io} />
        <img src={url} alt="" aria-hidden="true" style={c2} {...io} />
        <img src={url} alt={alt} style={main} {...io} />
      </span>
    );
  }
  return (
    <span className="pst whole">
      <img className="bk" src={url} alt="" aria-hidden="true" loading={lazy ? "lazy" : undefined} decoding="async" />
      <img src={url} alt={alt} {...io} />
    </span>
  );
}

// ------------------------------------------------------------------ the logo's forms
/** a form of the mark drawn like a figure on graph paper: solid, with the sheared grid knocked out */
export function GridForm({ g, uid }: { g: "A" | "B" | "O"; uid: string }) {
  const f = FORMS[g];
  return (
    <svg viewBox={f.viewBox} aria-hidden="true" style={{ display: "block", height: "100%", width: "auto", overflow: "visible" }}>
      <defs>
        <pattern id={uid} width="107" height="107" patternUnits="userSpaceOnUse" patternTransform={`translate(${f.x0} ${f.y0}) skewX(25.15)`}>
          <path d="M0 0H107M0 0V107" fill="none" style={{ stroke: "var(--pbg,#fff)" }} strokeOpacity=".5" strokeWidth="5" />
        </pattern>
      </defs>
      <path d={f.d} fill="currentColor" />
      <path d={f.d} fill={`url(#${uid})`} />
    </svg>
  );
}

/** the whole mark */
export function MarkSvg({ fill = "#2596be" }: { fill?: string }) {
  return (
    <svg viewBox={MARK.viewBox} aria-hidden="true" preserveAspectRatio="xMidYMid meet" style={{ display: "block", overflow: "visible" }}>
      {MARK.d.map((d, i) => <path key={i} d={d} fill={fill} />)}
    </svg>
  );
}

// ------------------------------------------------------------------ a title set vertically
// Korean: every character a piece of its own (they arrive one after another); English (set sideways): every word.
// `vn`: the longest column's length in the units the title's size is worked out from, so that it fits the first screen
// (a Korean character is 1; an English column's length is measured — VN_EN — or, for any other, estimated from its letters).
const W_LATIN = (c: string) => 0.66 * (c === " " ? 0.3 : /[A-Z]/.test(c) ? 0.68 : /[a-z]/.test(c) ? 0.52 : /[0-9]/.test(c) ? 0.58 : 0.3);
// measured in the page (sideways, weight 300 and 700 alike; +1 %): a column's length in em / 1.12
const VN_EN: Record<string, number> = {
  "Introducing": 4.204,
  "ABO Media": 4.14,
  "Business Areas": 5.674,
  "ABO Media’s": 4.676,
  "Productions": 4.456,
  "The latest news": 5.787,
  "from ABO Media": 6.025,
  "Let’s build": 3.647,
  "the future of content": 7.46,
  "with ABO Media.": 6.079,
  "IR Information": 5.043,
  "Page not found": 5.532,
  "The Future of Content": 7.987,
  "We'll Create Together": 7.819,
};

export function verticalTitle(cols: Columns, lang: Lang): { node: ReactNode; vn: number; text: string } {
  let n = 0;
  const flat = (seg: Columns[number][number]) => (typeof seg === "string" ? seg : seg.b);
  const text = cols.map((c) => c.map(flat).join("")).join(" ");
  const vn = Math.max(
    ...cols.map((c) => {
      const s = c.map(flat).join("");
      return lang === "ko" ? (s.match(/[A-Za-z0-9]{1,4}|[\s\S]/g) ?? []).reduce((a, ch) => a + (ch === " " ? 0.35 : 1), 0) : VN_EN[s] ?? Array.from(s).reduce((a, ch) => a + W_LATIN(ch), 0);
    }),
  );
  // (a space before each break: nothing on the page — a space at a line's end is dropped — but the title's text reads
  // as words, not as one run, for search engines and anything else that reads it as text)
  const node = cols.map((col, ci) => (
    <Fragment key={ci}>
      {ci > 0 && <>{" "}<br /></>}
      {col.map((seg, si) => {
        const bold = typeof seg !== "string";
        const str = flat(seg);
        let inner: ReactNode[];
        if (lang === "ko") {
          // a short run of Latin letters or figures among Korean ("IR") stands upright in one cell, as in Korean vertical setting
          inner = (str.match(/[A-Za-z0-9]{1,4}|[\s\S]/g) ?? []).map((ch, k) =>
            ch === " " ? " " : ch.length > 1 ? (
              <span key={k} className="ch" style={{ ...vars({ "--i": n++ }), textCombineUpright: "all" }}>{ch}</span>
            ) : (
              <span key={k} className="ch" style={vars({ "--i": n++ })}>{ch}</span>
            ),
          );
        } else {
          inner = str.split(/( )/).map((w, k) => {
            if (w === " ") return " ";
            if (!w) return null;
            const i = Math.round(n * 4.5) / 10; // a word comes in where its first letter would
            n += w.length;
            return <span key={k} className="ch" style={vars({ "--i": i })}>{w}</span>;
          });
        }
        return bold ? <b key={si}>{inner}</b> : <Fragment key={si}>{inner}</Fragment>;
      })}
    </Fragment>
  ));
  return { node, vn: Math.round(vn * 1000) / 1000, text };
}
