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

const peopleComponents: { title: string; href: string; description?: string}[] = [
  {
    title: "Shoes",
    href: "/#",
    description:
      "New and Vintage Sneakers",
  },
  {
    title: "Clothing",
    href: "/#",
    description:
      "Latest styles, all gently used",
  },
  {
    title: "Accessories",
    href: "/#",
    description:
      "Spice up your outfits"
  },
  {
    title: "Athletic Clothing",
    href: "/#",
    description:
      "Wide selection for all athletes"
  },
  {
    title: "Athletic Equipment",
    href: "/#",
    description:
      "New paddles and balls available"
  },
  {
    title: "Hygine",
    href: "/#",
    description:
      "All in original packaging"
  },
];

const techComponents: { title: string; href: string; description?: string}[] = [
  {
    title: "Smartphones",
    href: "/#",
    description:
      "Refurbished IPhones and Andrioids",
  },
  {
    title: "Tablets",
    href: "/#",
    description:
      "eReaders, IPads, and more",
  },
  {
    title: "Television",
    href: "/#",
    description:
      "Cable not included"
  },
  {
    title: "Laptops",
    href: "/#",
    description:
      "Portable and affordable"
  },
  {
    title: "Cords and Chargers",
    href: "/#",
    description:
      "USBs, HDMI, and Lightning"
  },
  {
    title: "Earphones and Microphones",
    href: "/#",
    description:
      "Namebrand, mostly functional"
  },
];

const homeComponents: { title: string; href: string; description?: string}[] = [
  {
    title: "Furniture",
    href: "/#",
    description:
      "Well loved chairs and tables",
  },
  {
    title: "Appliances",
    href: "/#",
    description:
      "Coffee makers, toasters, and fans",
  },
  {
    title: "Decorations",
    href: "/#",
    description:
      "Various decor for every season"
  },
  {
    title: "Comfort",
    href: "/#",
    description:
      "Blankets and pillows"
  },
  {
    title: "Bags",
    href: "/#",
    description:
      "Totes, Backpacks, and Fannys"
  },
  {
    title: "Misc",
    href: "/#",
    description:
      "Toys, plates, and almost anything"
  },
];

export default async function Header() {
  return (
    <div className="flex flex-col min-w-screen fixed top-0 z-50">
      <NavigationMenu className="min-w-full justify-between py-2 px-2 box-border right-0 border-b z-10 bg-white">
        <div className="relative w-28 h-10">
          <Link href="/">
            <Image src="/logo.svg" alt="logo" fill></Image>
          </Link>
        </div>
        {(await authenticated()) && <SearchBar></SearchBar>}
        <NavigationMenuList className="flex justify-end w-full">
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className="bg-[#78A75A] rounded-sm cursor-pointer hover:bg-[#638b4a] active:bg-[#638b4a] focus:outline-none focus:bg-[#638b4a]"
            >
              <Link href="/listing/new" className="flex flex-row items-center px-3 py-2">
                <Plus color="white" size={16} strokeWidth={3} className="mr-1" />
                <h1 className="text-white text-sm">New Listing (TEMP)</h1>
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          {(await authenticated()) ? (
            <>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className="bg-[#78A75A] rounded-sm cursor-pointer hover:bg-[#638b4a] active:bg-[#638b4a] focus:outline-none focus:bg-[#638b4a] visited:bg-[#78A75A]"
                >
                  <Link href="/" className="flex flex-row items-center">
                    <Plus color="white" size={2} strokeWidth={3} />
                    <h1 className="text-white">Donate</h1>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <button onClick={logout}>Logout</button>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </>
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
      {(await authenticated()) && (
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
