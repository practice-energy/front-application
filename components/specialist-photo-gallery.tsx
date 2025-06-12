"use client"
import { Grid } from "lucide-react"

interface SpecialistPhotoGalleryProps {
  images: string[]
  name: string
  onImageClick: (index: number) => void
}

export function SpecialistPhotoGallery({ images, name, onImageClick }: SpecialistPhotoGalleryProps) {
  // Ensure we have at least 5 images, use placeholders if needed
  const displayImages = [...images]
  while (displayImages.length < 5) {
    displayImages.push("/placeholder.svg?height=300&width=300")
  }

  return (
    <div className="w-full h-[300px] flex gap-2 overflow-hidden rounded-lg">
      {/* Main large photo on the left */}
      <div className="flex-1 cursor-pointer overflow-hidden" onClick={() => onImageClick(0)}>
        <img
          src={displayImages[0] || "/placeholder.svg"}
          alt={`${name} main photo`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* 4 smaller photos in a 2x2 grid on the right */}
      <div className="w-[300px] grid grid-cols-2 grid-rows-2 gap-2">
        {displayImages.slice(1, 5).map((image, index) => (
          <div
            key={index}
            className={`cursor-pointer overflow-hidden relative ${
              // Apply rounded corners only to the outer edges
              index === 0 ? "rounded-tr-lg" : index === 1 ? "rounded-br-lg" : ""
            }`}
            onClick={() => onImageClick(index + 1)}
          >
            <img
              src={image || "/placeholder.svg"}
              alt={`${name} photo ${index + 1}`}
              className="w-full h-full object-cover"
            />

            {/* Show more button on the last image */}
            {index === 3 && displayImages.length > 5 && (
              <div
                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                onClick={(e) => {
                  e.stopPropagation()
                  onImageClick(0) // Open gallery from the beginning
                }}
              >
                <div className="text-white text-center">
                  <Grid className="h-5 w-5 mx-auto mb-1" />
                  <span className="text-sm font-medium">+{displayImages.length - 5}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
