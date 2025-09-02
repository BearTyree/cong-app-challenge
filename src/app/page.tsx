import Dashboard from "@/components/dashboard";
import { authenticated } from "@/controllers/auth";
import Landing from "@/components/landing";

export default async function Home() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-center align-center box-border pt-10">
      {(await authenticated()) ? <Dashboard /> : <Landing />}
    </div>
  );
}
