"use client";
// A picture from the CMS, asked for at the size it is shown (data.ts). The image service makes a size the first time it
// is asked for, and under many first requests at once a few answer with an error (seen on the works wall right after
// the sizes were introduced). So a failed picture is asked for once more a moment later; if that fails too, the original
// is shown instead — a poster never stays empty because of the resizing.
import { useEffect, useRef, useState, type ImgHTMLAttributes } from "react";

export default function CmsImg({ fallback, src, srcSet, sizes, alt = "", ...rest }: ImgHTMLAttributes<HTMLImageElement> & { fallback?: string | null }) {
  const ref = useRef<HTMLImageElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [stage, setStage] = useState(0); // 0 as asked · 1 asked once more · 2 the original
  const canFall = !!fallback && fallback !== src;
  const fail = () => {
    if (!canFall) return;
    if (stage === 0) {
      if (!timer.current) timer.current = setTimeout(() => { timer.current = null; setStage(1); }, 1500);
    } else if (stage === 1) setStage(2);
  };
  useEffect(() => {
    // (an error that came before the page's script was listening)
    const im = ref.current;
    if (im && im.complete && im.naturalWidth === 0 && im.getAttribute("src")) fail();
    return () => { if (timer.current) clearTimeout(timer.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const original = canFall && stage === 2;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img key={stage} ref={ref} {...rest} alt={alt} src={original ? (fallback as string) : src} srcSet={original ? undefined : srcSet} sizes={original ? undefined : sizes} onError={fail} />
  );
}
