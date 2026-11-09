'use client'

// Contact page in the COUNTER /contact structure: label rows with an underline,
// the Naver map (same setup as the current site) and wide blue bars instead of a submit button.
import { useEffect, useRef } from "react";
import { CONTACT, type Lang } from "./content";
import { ArrowR, ArrowUR, PageHead } from "./ui";

type NaverMaps = {
  maps: {
    LatLng: new (lat: number, lng: number) => unknown;
    Map: new (el: HTMLElement, options: unknown) => unknown;
    Marker: new (options: unknown) => unknown;
    InfoWindow: new (options: { content: string }) => {
      open: (map: unknown, marker: unknown) => void;
    };
    Position: {
      TOP_RIGHT: unknown;
    };
  };
};

declare global {
  interface Window {
    naver?: NaverMaps;
  }
}

export default function ContactView({ lang }: { lang: Lang }) {
  const t = CONTACT[lang];
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;
    if (!clientId) {
      console.warn("NEXT_PUBLIC_NAVER_MAP_CLIENT_ID is missing");
      return;
    }

    const initMap = () => {
      if (!mapRef.current || !window.naver) return;
      const location = new window.naver.maps.LatLng(37.5595, 126.8464);
      const map = new window.naver.maps.Map(mapRef.current, {
        center: location,
        zoom: 17,
        zoomControl: true,
        zoomControlOptions: { position: window.naver.maps.Position.TOP_RIGHT },
      });
      const marker = new window.naver.maps.Marker({ position: location, map, title: t.markerTitle });
      const infoWindow = new window.naver.maps.InfoWindow({ content: t.infoHtml });
      infoWindow.open(map, marker);
    };

    const existing = document.querySelector<HTMLScriptElement>('script[data-naver-maps="true"]');
    if (existing) {
      if (window.naver) initMap();
      else existing.addEventListener("load", initMap, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.dataset.naverMaps = "true";
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`;
    script.async = true;
    script.addEventListener("load", initMap);
    document.head.appendChild(script);

    return () => {
      script.removeEventListener("load", initMap);
    };
  }, [t.markerTitle, t.infoHtml]);

  return (
    <div className="c-page">
      <PageHead lang={lang} title="Contact" sub={t.title} crumb="Contact" />

      <section className="c-wrap" style={{ paddingTop: 56, paddingBottom: 140 }}>
        <div className="c-form">
          <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 700, color: "var(--c-blue)" }}>{t.location}</p>

          <div className="c-field">
            <p>{t.addrLabel}</p>
            <p className="c-field-v">
              {t.addr[0]}
              <br />
              {t.addr[1]}
            </p>
          </div>
          <div className="c-field">
            <p>{t.telLabel}</p>
            <p className="c-field-v">
              <a href={t.telHref}>{t.tel}</a>
            </p>
          </div>
          <div className="c-field">
            <p>{t.mailLabel}</p>
            <p className="c-field-v">
              <a href={`mailto:${t.mail}`}>{t.mail}</a>
            </p>
          </div>
          <div className="c-field">
            <p>{t.mapLabel}</p>
            <div ref={mapRef} className="c-map" />
          </div>

          <a className="c-bar" href={`mailto:${t.mail}`}>
            {t.mail} <ArrowR size={34} stroke={1.4} />
          </a>
          <div className="c-bar2">
            <a href={t.mapHref} target="_blank" rel="noopener noreferrer">
              {t.directions} <ArrowUR size={20} />
            </a>
            <a href={t.mapHref} target="_blank" rel="noopener noreferrer">
              {t.viewMap} <ArrowUR size={20} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
