import { AppCarousel } from "@/components/appCarousel";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ImageGrid from "@/components/imageGrid";

export default function Landing() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center mt-5">
      <AppCarousel />
      <div className="my-2 flex flex-col justify-center items-center">
        <p className="text-4xl font-medium">
          A donation driven marketplace for communities
        </p>
        <p className="mb-3 text-xl italic">built by communities</p>
        <Link href="/listing/new">
          <Button className="bg-[#212121] cursor-pointer hover:bg-[#303030]">
            Donate Now
          </Button>
        </Link>
      </div>
      <p className="w-full font-bold">From Top Givers</p>
      <ImageGrid></ImageGrid>
    </div>
  );
}
