// app/works/page.tsx
import Image from "next/image";
import { GraphQLClient, gql } from "graphql-request";

export const revalidate = 60;

// Hygraph 클라이언트
const client = new GraphQLClient(process.env.HYGRAPH_ENDPOINT as string, {
  headers: { Authorization: `Bearer ${process.env.HYGRAPH_TOKEN}` },
});

// GraphQL 쿼리
const QUERY = gql`
  query Works {
    works(orderBy: year_DESC, first: 50) {
      id
      title
      slug
      year
      category
      coverImage { url width height }
      client {
        name
        website
        logo { url width height }
      }
    }
  }
`;

type Asset = { url: string; width: number; height: number };
type Client = { name: string; website?: string | null; logo?: Asset | null };
type Work = {
  id: string;
  title: string;
  slug: string;
  year: number;
  category: string;
  coverImage?: Asset | Asset[] | null;
  client?: Client | null;
};

async function getWorks(): Promise<Work[]> {
  const data = await client.request<{ works: Work[] }>(QUERY);
  return data.works ?? [];
}

export default async function WorksPage() {
  const works = await getWorks();

  if (!works.length) {
    return (
      <main className="container-main py-16">
        <h1 className="text-3xl font-semibold mb-4">포트폴리오</h1>
        <p className="text-muted">
          아직 등록된 포트폴리오가 없습니다. Hygraph에서 Work 콘텐츠를 생성하고
          <span className="ml-1 font-medium"> Publish</span> 해 주세요.
        </p>
      </main>
    );
  }

  return (
    <main className="container-main py-12">
      <h1 className="text-3xl font-semibold mb-8">포트폴리오</h1>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {works.map((w) => {
          const img = Array.isArray(w.coverImage) ? w.coverImage[0] : w.coverImage;

          return (
            <li
              key={w.id}
              className="rounded-xl border border-subtle overflow-hidden bg-white hover:shadow-md transition"
            >
              <div className="relative aspect-[16/9] bg-gray-100">
                {img?.url && (
                  <Image
                    src={img.url}
                    alt={w.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                )}
              </div>

              <div className="p-4">
                <div className="text-sm text-muted">
                  {w.year} · {w.category}
                </div>
                <h2 className="mt-1 text-lg font-semibold">{w.title}</h2>

                {w.client?.name && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-700">
                    {w.client.logo?.url && (
                      <Image
                        src={w.client.logo.url}
                        alt={w.client.name}
                        width={20}
                        height={20}
                        className="rounded"
                      />
                    )}
                    <span>{w.client.name}</span>
                    {w.client.website && (
                      <a
                        href={w.client.website}
                        target="_blank"
                        rel="noreferrer"
                        className="ml-2 underline text-muted hover:text-foreground"
                      >
                        Website
                      </a>
                    )}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
