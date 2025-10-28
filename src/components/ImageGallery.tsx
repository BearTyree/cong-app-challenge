"use client"
import Image from "next/image"
import { useState } from "react"

interface ImageGalleryProps {
  images: string[]
  title: string
}

const isRemoteImage = (src: string) => /^https?:\/\//.test(src)

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const galleryImages = images.length > 0 ? images : ["/rackets.png"]
  const [selectedImage, setSelectedImage] = useState(0)

  return (
    <div>
      <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-4">
        <Image
          src={galleryImages[selectedImage]}
          alt={title}
          width={600}
          height={600}
          className="w-full h-full object-contain"
          unoptimized={isRemoteImage(galleryImages[selectedImage])}
        />
      </div>
      <div className="grid grid-cols-4 gap-2">
        {galleryImages.map((img, idx) => (
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
              unoptimized={isRemoteImage(img)}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
