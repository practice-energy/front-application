"use client"

import type React from "react"
import { useState } from "react"
import { Plus, X } from "lucide-react"
import { Label } from "@/components/ui/label"

interface PhotoUploadProps {
  photos: File[]
  onPhotosChange: (photos: File[]) => void
  maxPhotos?: number
  title?: string
  description?: string
  className?: string
  showTitle: boolean
}

export function PhotoUpload({
                              photos,
                              onPhotosChange,
                              maxPhotos = 5,
                              title = "Upload Photos",
                              description = "Add photos to showcase your practice and create a welcoming presence",
                              className = "",
                              showTitle = true,
                            }: PhotoUploadProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const handlePhotoUpload = (files: FileList | null) => {
    if (!files) return

    const newPhotos = Array.from(files)
        .filter((file) => file.size <= 5 * 1024 * 1024) // 5MB limit
        .slice(0, maxPhotos - photos.length)

    onPhotosChange([...photos, ...newPhotos].slice(0, maxPhotos))
  }

  const removePhoto = (index: number) => {
    onPhotosChange(photos.filter((_, i) => i !== index))
  }

  const clearAllPhotos = () => {
    onPhotosChange([])
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex !== null && draggedIndex !== index) {
      const newPhotos = [...photos]
      const draggedPhoto = newPhotos[draggedIndex]
      newPhotos.splice(draggedIndex, 1)
      newPhotos.splice(index, 0, draggedPhoto)
      onPhotosChange(newPhotos)
    }
    setDraggedIndex(null)
  }

  return (
      <div className={`space-y-6 ${className}`}>
        <div>
          {showTitle && (<div>
            <Label className="mb-2 block text-sm font-medium">{title}</Label>
            <p className="text-sm text-muted-foreground mb-4">{description}</p>
            <p className="text-sm text-purple-600 font-medium mb-4">Maximum {maxPhotos} photos allowed</p>
          </div>)}

          <div className="border-2 border-dashed border-muted-foreground/25 rounded-sm p-8 text-center cursor-pointer border-purple-300 hover:border-purple-400 transition-colors bg-violet-400/10">
            <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handlePhotoUpload(e.target.files)}
                className="hidden bg-purple-100"
                id="photo-upload"
            />
            <label htmlFor="photo-upload" className="block cursor-pointer">
              <div className="space-y-3">
                <div className="mx-auto w-12 h-12 bg-purple-100 border-purple-600 rounded-2xl flex items-center justify-center">
                  <Plus className="h-5 w-5 text-purple-400" />
                </div>
                <p className="font-medium ">Upload Photos</p>
                <p className="text-sm text-muted-foreground">Click to select or drag and drop multiple photos</p>
                <p className="text-xs text-muted-foreground">Supported formats: JPG, PNG, WebP (max 5MB each)</p>
              </div>
            </label>
          </div>
        </div>

        {photos.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
            <span className="text-sm font-medium">
              {photos.length} of {maxPhotos} photos uploaded
            </span>
                <button type="button" onClick={clearAllPhotos} className="text-sm text-destructive hover:underline">
                  Clear All
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {photos.map((photo, index) => (
                    <div
                        key={index}
                        className="relative group cursor-move bg-card rounded-lg border border-border overflow-hidden hover:border-purple-600 hover:shadow-md transition-all duration-200"
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDrop={(e) => handleDrop(e, index)}
                    >
                      {/* Photo Preview */}
                      <div className="aspect-square relative">
                        <img
                            src={URL.createObjectURL(photo) || "/placeholder.svg"}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-full object-cover"
                        />

                        {/* Photo Number */}
                        <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-sm font-medium">
                          {index + 1}
                        </div>

                        {/* Remove Button */}
                        <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              removePhoto(index)
                            }}
                            className="absolute top-2 right-2 text-destructive bg-transparent p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Photo Info */}
                      <div className="p-3 bg-card">
                        <p className="text-xs text-muted-foreground truncate font-medium">{photo.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{(photo.size / 1024 / 1024).toFixed(1)} MB</p>
                      </div>
                    </div>
                ))}
              </div>
            </div>
        )}
      </div>
  )
}
