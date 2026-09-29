import { TitleGrid } from "@/components/TitleGrid";
import { OmdbTitleDetails } from "@/lib/types";

const FEATURED_IDS = ['tt0111161', 'tt0068646', 'tt0468569', 'tt0110912', 'tt0133093'];

async function getFeatured(): Promise<OmdbTitleDetails[]> {
  const results = await Promise.all(
    FEATURED_IDS.map((id) =>
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/media/details?imdbId=${id}`, {
        next: { revalidate: 3600 },
      }).then((res) => res.json()),
    ),
  );
  return results;
}
export default async function Home() {
  const featured = await getFeatured();

  const items = featured.map((f) => ({
    Title: f.Title,
    Year: f.Year,
    imdbID: f.imdbID,
    Type: f.Type,
    Poster: f.Poster,
  }));

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold">Featured</h1>
      <TitleGrid items={items} />
    </div>
  );
}
