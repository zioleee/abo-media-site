"use client";
// A picture from the CMS, asked for at the size it is shown (data.ts). Should the image service fail to make that size,
// the original is shown instead: a poster never stays empty because of the resizing.
import { useEffect, useRef, useState, type ImgHTMLAttributes } from "react";

export default function CmsImg({ fallback, src, srcSet, sizes, alt = "", ...rest }: ImgHTMLAttributes<HTMLImageElement> & { fallback?: string | null }) {
  const ref = useRef<HTMLImageElement>(null);
  const [original, setOriginal] = useState(false);
  const useOriginal = !!fallback && fallback !== src && original;
  const fail = () => { if (fallback && fallback !== src) setOriginal(true); };
  // (an error that came before the page's script was listening)
  useEffect(() => {
    const im = ref.current;
    if (im && im.complete && im.naturalWidth === 0 && im.getAttribute("src")) fail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img ref={ref} {...rest} alt={alt} src={useOriginal ? (fallback as string) : src} srcSet={useOriginal ? undefined : srcSet} sizes={useOriginal ? undefined : sizes} onError={fail} />
  );
}
