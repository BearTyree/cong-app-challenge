import Dashboard from "@/components/dashboard";
import { authenticated } from "@/controllers/auth";
import Landing from "@/components/landing";

export default async function Home() {
  /* For testing im just going to test dashboard as the default, idk auth lol*/
  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-center align-center box-border pt-10">
      {(await authenticated()) ? <Landing /> : <Dashboard /> }
    </div>
  );
}
