import Dashboard from "@/components/dashboard";
import { authenticated } from "@/controllers/auth";
import Landing from "@/components/landing";

export default async function Home() {
  return (
    <div className="flex w-full h-screen justify-center align-center">
      {(await authenticated()) ? <Dashboard /> : <Landing />}
    </div>
  );
}
