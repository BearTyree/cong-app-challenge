"use client"
import { useState } from "react"
import Image from "next/image"

interface ImageGalleryProps {
  images: string[]
  title: string
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  return (
    <div>
      <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-4">
        <Image
          src={images[selectedImage]}
          alt={title}
          width={600}
          height={600}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="grid grid-cols-4 gap-2">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedImage(idx)}
            className={`aspect-square bg-gray-50 rounded-lg overflow-hidden border-2 ${
              selectedImage === idx ? "border-black" : "border-transparent"
            }`}
          >
            <Image
              src={img}
              alt={`${title} ${idx + 1}`}
              width={150}
              height={150}
              className="w-full h-full object-contain"
            />
          </button>
        ))}
      </div>
    </div>
  )
}