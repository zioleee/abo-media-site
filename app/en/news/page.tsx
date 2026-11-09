// app/en/news/page.tsx
import NewsView from "../../components/counter/NewsView";
import { getNewsItems } from "../../components/counter/newsData";

export default async function EnNewsPage() {
  const items = await getNewsItems();
  return <NewsView lang="en" items={items} />;
}
