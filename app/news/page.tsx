// app/news/page.tsx
import NewsView from "../components/counter/NewsView";
import { getNewsItems } from "../components/counter/newsData";

export default async function NewsPage() {
  const items = await getNewsItems();
  return <NewsView lang="ko" items={items} />;
}
