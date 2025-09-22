"use client";
import clsx from "clsx";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";

import { AspectRatio } from "@/components/ui/aspect-ratio";

import { Card, CardContent } from "@/components/ui/card";
import { useRef } from "react";
import Image from "next/image";

export function AppCarousel() {
  const banners = [
    {
      id: 1,
      src: "/banner_blank.png",
      text: "Back to School Essentials",
      sub: "Find all the class room necessities",
      href: "/",
      right: false,
    },
    {
      id: 2,
      src: "/banner_blank_2.jpg",
      text: "Used Laptops, Tablets, and Phones",
      sub: "Get recycled tech here",
      href: "/",
      right: true,
    },
  ];
  const plugin = useRef(Autoplay({ delay: 4000 }));
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
        watchDrag: false,
      }}
      plugins={[plugin.current]}
      className="w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent className="h-full">
        {banners.map((b) => (
          <CarouselItem key={b.id} className="h-full">
            <div className=" h-full py-5">
              <Card className="h-full p-0 shadow-none rounded-2xl border-none">
                <CardContent className="flex items-center justify-center h-full p-0 rounded-2xl">
                  <AspectRatio
                    ratio={4 / 1}
                    className="overflow-hidden rounded-2xl relative"
                  >
                    <Image src={b.src} fill alt={b.text}></Image>
                    <div
                      className={clsx(
                        "absolute flex flex-col gap-1 w-full h-full justify-center box-border p-15",
                        { "items-start": !b.right },
                        { "items-end": b.right }
                      )}
                    >
                      <h1 className="font-bold text-4xl text-white">
                        {b.text}
                      </h1>
                      <h1 className="font-bold text-white">{b.sub}</h1>
                      <Button className="cursor-pointer hover:bg-[#303030]">Search Now</Button>
                    </div>
                  </AspectRatio>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
