import { logout } from "@/actions/auth";
import { authenticated } from "@/controllers/auth";
import Link from "next/link";
import { Plus } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import Image from "next/image";
import { SearchBar } from "@/components/searchBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCurrentUserProfile } from "@/lib/auth-helpers";

const peopleComponents: {
  title: string;
  href: string;
  description?: string;
}[] = [
  {
    title: "Shoes",
    href: "/search?query=mens+shoes",
    description: "New and Vintage Sneakers",
  },
  {
    title: "Clothing",
    href: "/search?query=mens+clothing",
    description: "Latest styles, all gently used",
  },
  {
    title: "Accessories",
    href: "/search?query=mens+accessories",
    description: "Spice up your outfits",
  },
  {
    title: "Athletic Clothing",
    href: "/search?query=mens+athletic+clothing",
    description: "Wide selection for all athletes",
  },
  {
    title: "Athletic Equipment",
    href: "/search?query=mens+athletic+equipment",
    description: "New paddles and balls available",
  },
  {
    title: "Hygine",
    href: "/search?query=mens+hygine",
    description: "All in original packaging",
  },
];

const techComponents: { title: string; href: string; description?: string }[] =
  [
    {
      title: "Smartphones",
      href: "/search?query=smartphones",
      description: "Refurbished IPhones and Andrioids",
    },
    {
      title: "Tablets",
      href: "/search?query=tablets",
      description: "eReaders, IPads, and more",
    },
    {
      title: "Television",
      href: "/search?query=television",
      description: "Cable not included",
    },
    {
      title: "Laptops",
      href: "/search?query=laptops",
      description: "Portable and affordable",
    },
    {
      title: "Cords and Chargers",
      href: "/search?query=cords+chargers",
      description: "USBs, HDMI, and Lightning",
    },
    {
      title: "Earphones and Microphones",
      href: "/search?query=earphones+microphones",
      description: "Namebrand, mostly functional",
    },
  ];

const homeComponents: { title: string; href: string; description?: string }[] =
  [
    {
      title: "Furniture",
      href: "/search?query=furniture",
      description: "Well loved chairs and tables",
    },
    {
      title: "Appliances",
      href: "/search?query=appliances",
      description: "Coffee makers, toasters, and fans",
    },
    {
      title: "Decorations",
      href: "/search?query=decorations",
      description: "Various decor for every season",
    },
    {
      title: "Comfort",
      href: "/search?query=comfort",
      description: "Blankets and pillows",
    },
    {
      title: "Bags",
      href: "/search?query=bags",
      description: "Totes, Backpacks, and Fannys",
    },
    {
      title: "Misc",
      href: "/search?query=misc",
      description: "Toys, plates, and almost anything",
    },
  ];

export default async function Header() {
  const isAuthenticated = await authenticated();
  const userProfile = isAuthenticated ? await getCurrentUserProfile(isAuthenticated) : null;

  return (
    <div className="flex flex-col min-w-screen fixed top-0 z-50">
      <NavigationMenu className="min-w-full justify-between py-2 px-2 box-border right-0 border-b z-10 bg-white">
        <div className="relative w-28 h-10">
          <Link href="/">
            <Image src="/logo.svg" alt="logo" fill />
          </Link>
        </div>
        {isAuthenticated && <SearchBar />}
        <NavigationMenuList className="flex justify-end w-full">
          {isAuthenticated && (
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className="bg-[#78A75A] rounded-sm cursor-pointer hover:bg-[#638b4a] active:bg-[#638b4a] focus:outline-none focus:bg-[#638b4a]"
              >
                <Link
                  href="/listing/new"
                  className="flex flex-row items-center px-3 py-2"
                >
                  <Plus color="white" size={16} strokeWidth={3} className="mr-1" />
                  <span className="text-white text-sm">New Listing</span>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          )}
        {userProfile && (
          <div className="pl-4 pr-4">
            <Link
              href={`/profile/${userProfile.id}`}
              className="hover:opacity-80 transition-opacity"
            >
              <Avatar className="h-11 w-11 cursor-pointer border-2">
                {userProfile.avatar && (
                  <AvatarImage src={userProfile.avatar} alt={userProfile.username} />
                )}
                <AvatarFallback className="bg-[#9bc27d] text-white font-semibold">
                  {userProfile.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        )}
          {isAuthenticated ? (
            <NavigationMenuItem>
              <form action={logout}>
                <NavigationMenuLink asChild>
                  <button type="submit" className="px-4 py-2 border-2 cursor-pointer">
                    Logout
                  </button>
                </NavigationMenuLink>
              </form>
            </NavigationMenuItem>
          ) : (
            <div className="flex">
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
            </div>
          )}
        </NavigationMenuList>
        
      </NavigationMenu>
      {isAuthenticated && (
        <NavigationMenu
          viewport={false}
          className="p-1 bg-white min-w-full border-b"
        >
          <NavigationMenuList className="flex justify-center w-full">
            <NavigationMenuItem>
              <NavigationMenuTrigger>Men&apos;s</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {peopleComponents.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Women&apos;s</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {peopleComponents.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Children&apos;s</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {peopleComponents.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Tech</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {techComponents.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Home Goods</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {homeComponents.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )}
    </div>
  );
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
