"use client";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useRouter } from "next/navigation";

interface ImageCardProps {
  name: string;
  src: string;
  id: number;
  dateListed: string;
}

export default function ImageCard(props: ImageCardProps) {
  const router = useRouter();
  return (
      <div className="w-full mx-auto flex flex-col items-center cursor-pointer" onClick={() => router.push(`/${props.id}`)}>
        <AspectRatio ratio={1 / 1} className="bg-muted rounded-lg">
          <Image
            src={props.src}
            alt={props.name}
            fill
            className="h-full w-full rounded-lg object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </AspectRatio>
        <h1 className="text-left w-full text-lg hover:underline">{props.name}</h1>
        <p className="text-left w-full text-sm italic text-">{props.dateListed}</p>
      </div>

  );
}
