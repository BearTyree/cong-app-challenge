import { logout } from "@/actions/auth";
import { authenticated } from "@/controllers/auth";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";

// export default async function Header({ req }: { req: Request }) {
//   if (await authenticated(req))
//     return (
//       <div>
//         <button onClick={logout}>Logout</button>
//       </div>
//     );
//   return (
//     <div>
//       <Link href="/login">Login</Link>
//       <Link href="/signup">Sign Up</Link>
//     </div>
//   );
// }
export default async function Header({ req }: { req: Request }) {
  if (await authenticated(req))
    return (
      <div className="w-screen flex justify-end">
        <NavigationMenu className="w-full justify-end p-1">
          <NavigationMenuList className="flex justify-end w-full">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <button onClick={logout}>Logout</button>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    );
  return (
    <div className="w-screen flex justify-end">
      <NavigationMenu className="w-full justify-end p-1">
        <NavigationMenuList className="flex justify-end w-full">
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/login" className="px-4 py-2">
                Login
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/signup" className="px-4 py-2">
                Sign Up
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
