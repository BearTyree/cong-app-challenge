import Image from "next/image"
import Link from "next/link"

interface ItemCardProps {
  id: number
  title: string
  imageSrc: string | null
  condition: string
  categoryLabel: string
}

const fallbackImage = "/rackets.png"
const isRemote = (src: string) => /^https?:\/\//.test(src)

export default function ItemCard({
  id,
  title,
  imageSrc,
  condition,
  categoryLabel
}: ItemCardProps) {
  const resolvedSrc = imageSrc ?? fallbackImage

  return (
    <Link href={`/listing/${id}`} className="group">
      <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-2">
        <Image
          src={resolvedSrc}
          alt={title}
          width={200}
          height={200}
          className="w-full h-full object-contain group-hover:scale-105 transition"
          unoptimized={isRemote(resolvedSrc)}
        />
      </div>
      <p className="font-medium text-sm break-words overflow-wrap-anywhere">{title}</p>
      <p className="text-xs text-gray-600 break-words overflow-wrap-anywhere">{condition}</p>
      <p className="text-xs uppercase tracking-wide text-gray-500 break-words overflow-wrap-anywhere">{categoryLabel}</p>
    </Link>
  )
}
