import { authenticated } from "@/controllers/auth";
import ImageGrid from "@/components/imageGrid";
import { redirect } from "next/navigation";

export default async function Search(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  return (
    <div className="mx-auto w-full max-w-8xl px-6 flex justify-center align-center box-border pt-20">
      {(await authenticated()) ? (
        <div className="flex flex-col mx-auto w-full max-w-8xl px-6 justify-center align-center">
          <h1 className="font-semibold text-2xl">Showing Results for &apos;{query}&apos;</h1>
          <ImageGrid query={query} currentPage={currentPage}></ImageGrid>
        </div>
      ) : (
        redirect("/")
      )}
    </div>
  );
}
