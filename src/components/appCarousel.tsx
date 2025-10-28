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
      src: "/banner_school.jpg",
      text: "Back to School Essentials",
      sub: "Find all the class room necessities",
      href: "/",
      right: false,
      color: "#F34F4F",
    },
    {
      id: 2,
      src: "/banner_tech.jpg",
      text: "Used Laptops, Tablets, and Phones",
      sub: "Get recycled tech here",
      href: "/",
      right: true,
      color: "#4F83F4",
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
                    <div
                      className={clsx(
                        "absolute w-1/2",
                        { "left-0": b.right },
                        { "right-0": !b.right }
                      )}
                    >
                      <Image
                        src={b.src}
                        alt={b.text}
                        width={0}
                        height={0}
                        sizes="100vw"
                        style={{ width: "100%", height: "auto" }} // optional
                      />
                    </div>

                    <div
                      className={clsx(
                        `absolute flex flex-col gap-1 w-1/2 h-full justify-center box-border p-15 z-20`,
                        { "items-start left-0": !b.right },
                        { "items-end right-0": b.right }
                      )}
                      style={{backgroundColor: b.color}}
                    >
                      <h1 className={clsx("font-bold text-4xl text-white",
                        {"text-left": !b.right},
                        {"text-right": b.right}
                      )}>
                        {b.text}
                      </h1>
                      <h1 className="font-bold text-white">{b.sub}</h1>
                      <Button className="bg-[#212121] cursor-pointer hover:bg-[#303030]">
                        Search Now
                      </Button>
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
