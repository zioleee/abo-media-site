// app/en/news/page.tsx — the page is drawn by the design layer (app/_mono)
import NewsView from "../../_mono/views/NewsView";

// The list was refreshed every 6 hours before (through the og-image requests the old list made, which set that
// interval for the whole page); the new list makes no such requests, so the interval is kept here explicitly.
export const revalidate = 21600;

export default function Page() {
  return <NewsView lang="en" />;
}
