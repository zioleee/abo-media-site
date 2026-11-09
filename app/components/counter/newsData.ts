// Hygraph news list query shared by /news and /en/news (same query as the current site).
import { GraphQLClient, gql } from "graphql-request";
import type { NewsListItem } from "./NewsView";

const QUERY = gql`
  query NewsList {
    newsItems(orderBy: publishedDate_DESC, first: 100) {
      id
      title
      slug
      externalUrl
      publishedDate
    }
  }
`;

export async function getNewsItems(): Promise<NewsListItem[]> {
  try {
    const endpoint = process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT!;
    const token = process.env.NEXT_PUBLIC_HYGRAPH_TOKEN;
    const client = new GraphQLClient(endpoint, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
    const data = await client.request<{ newsItems: NewsListItem[] }>(QUERY);
    return data.newsItems ?? [];
  } catch (e) {
    console.error("Failed to fetch newsItems:", e);
    return [];
  }
}
