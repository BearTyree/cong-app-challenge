"use client"
import { useState, useEffect } from "react"
import { formatFileSize } from "@/lib/listing"

interface ImagePreviewProps {
  files: File[]
  onRemove: (index: number) => void
  maxImages: number
}

export default function ImagePreview({ files, onRemove, maxImages }: ImagePreviewProps) {
  const [previews, setPreviews] = useState<string[]>([])

  useEffect(() => {
    const urls = files.map(file => URL.createObjectURL(file))
    setPreviews(urls)

    return () => {
      urls.forEach(url => URL.revokeObjectURL(url))
    }
  }, [files])

  if (files.length === 0) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <p className="text-gray-500 text-sm">No images selected</p>
        <p className="text-gray-400 text-xs mt-1">Maximum {maxImages} images</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {files.map((file, index) => (
        <div key={index} className="relative group">
          <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
            <img
              src={previews[index]}
              alt={`Preview ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Remove image"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <p className="text-xs text-gray-500 mt-1 truncate">
            {formatFileSize(file.size)}
          </p>
        </div>
      ))}
    </div>
  )
}