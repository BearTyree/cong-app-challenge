import Image from "next/image";
import Link from "next/link";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface ImageCardProps {
  id: number;
  title: string;
  imageSrc: string | null;
  condition: string;
  categoryLabel: string;
}

const isRemoteImage = (src: string) => /^https?:\/\//.test(src);
const fallbackImage = "/rackets.png";

export default function ImageCard({
  id,
  title,
  imageSrc,
  condition,
  categoryLabel
}: ImageCardProps) {
  const resolvedSrc = imageSrc ?? fallbackImage;
  return (
    <Link
      href={`/listing/${id}`}
      className="w-full mx-auto flex flex-col items-center cursor-pointer"
    >
        <AspectRatio ratio={1 / 1} className="bg-muted rounded-lg">
          <Image
            src={resolvedSrc}
            alt={title}
            fill
            className="h-full w-full rounded-lg object-cover dark:brightness-[0.2] dark:grayscale"
            unoptimized={isRemoteImage(resolvedSrc)}
          />
        </AspectRatio>
        <h1 className="text-left w-full text-lg hover:underline">{title}</h1>
        <p className="text-left w-full text-sm text-gray-600">{condition}</p>
        <p className="text-left w-full text-xs uppercase tracking-wide text-gray-500">{categoryLabel}</p>
    </Link>
  );
}
