import { logout } from "@/actions/auth";
import { authenticated } from "@/controllers/auth";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

export default async function Header() {
  return (
    <NavigationMenu className="w-full justify-end p-1 box-border absolute right-0">
      <NavigationMenuList className="flex justify-end w-full">
        {(await authenticated()) ? (
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <button onClick={logout}>Logout</button>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ) : (
          <>
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
          </>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
