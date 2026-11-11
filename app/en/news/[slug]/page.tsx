// app/en/news/[slug]/page.tsx — the page is drawn by the design layer (app/_mono)
import NewsDetailView from "../../../_mono/views/NewsDetailView";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <NewsDetailView lang="en" slug={slug} />;
}
