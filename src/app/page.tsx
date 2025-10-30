import Dashboard from "@/components/Dashboard";
import { authenticated } from "@/controllers/auth";

export default async function Home(props: {
  searchParams?: Promise<{
    page?: string;
    category?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const isAuthenticated = await authenticated();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-center align-center box-border pt-10">
      <Dashboard searchParams={searchParams} isAuthenticated={!!isAuthenticated} />
    </div>
  );
}
