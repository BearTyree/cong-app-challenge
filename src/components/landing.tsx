import { AppCarousel } from "@/components/appCarousel";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <AppCarousel />
      <p className="text-4xl font-medium mt-4">A donation driven marketplace for communities</p>
      <p className="mb-3 text-xl italic">built by communities</p>

      <Button className="cursor-pointer">Donate Now</Button>
    </div>
  );
}
