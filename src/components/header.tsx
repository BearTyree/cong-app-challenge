import { logout } from "@/actions/auth";
import { authenticated } from "@/controllers/auth";
import Link from "next/link";

export default async function Header({ req }: { req: Request }) {
  if (await authenticated(req))
    return (
      <div>
        <button onClick={logout}>Logout</button>
      </div>
    );
  return (
    <div>
      <Link href="/login">Login</Link>
      <Link href="/signup">Sign Up</Link>
    </div>
  );
}
