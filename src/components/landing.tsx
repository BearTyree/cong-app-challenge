import { AppCarousel } from "@/components/appCarousel";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center mt-5">
      <AppCarousel />
      <p className="text-4xl font-medium mt-2">
        A donation driven marketplace for communities
      </p>
      <p className="mb-3 text-xl italic">built by communities</p>

      <Button className="cursor-pointer">Donate Now</Button>
    </div>
  );
}
