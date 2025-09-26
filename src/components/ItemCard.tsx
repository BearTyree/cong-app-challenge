import Image from "next/image"
import Link from "next/link"

interface ItemCardProps {
  id: number
  name: string
  src: string
  condition: string
  distance: string
}

export default function ItemCard({ id, name, src, condition, distance }: ItemCardProps) {
  return (
    <Link href={`/listing/${id}`} className="group">
      <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-2">
        <Image
          src={src}
          alt={name}
          width={200}
          height={200}
          className="w-full h-full object-contain group-hover:scale-105 transition"
        />
      </div>
      <p className="font-medium text-sm">{name}</p>
      <p className="text-xs text-gray-600">{condition}</p>
      <p className="text-xs text-gray-600">{distance}</p>
    </Link>
  )
}