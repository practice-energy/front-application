"use client"

import type React from "react"
import { useState } from "react"
import {ImageUp, Plus, X} from "lucide-react"
import { Label } from "@/src/components/ui/label"
import {BurnEntityButton} from "@/src/components/burn-entity-button";
import {cn} from "@/src/lib/utils";

interface PhotoUploadProps {
  photos: File[]
  onPhotosChange: (photos: File[]) => void
  maxPhotos?: number
  title?: string
  description?: string
  className?: string
  showTitle: boolean
  bgClassName?: string
}

export function PhotoUpload({
                              photos,
                              onPhotosChange,
                              maxPhotos = 3,
                              title = "Upload Photos",
                              description = "Add photos to showcase your practice and create a welcoming presence",
                              className = "",
    bgClassName = "",
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
      <div className={`space-y-6 ${className} w-full`}>
        <div>
          <div className={cn(
              "bg-colors-neutral-150 md:rounded-sm border-muted-foreground/25 rounded-sm p-8 text-center cursor-pointer transition-colors",
              bgClassName
          )}
          >
            <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handlePhotoUpload(e.target.files)}
                className="hidden "
                id="photo-upload"
            />
            <label htmlFor="photo-upload" className="block cursor-pointer">
              <div className="space-y-3">
                <div className="mx-auto w-12 h-12 bg-violet-50 rounded-sm flex items-center justify-center">
                  <ImageUp className="h-5 w-5 text-neutral-700" />
                </div>
                <p className="font-medium">Загрузите фото вашей практис</p>
                {/*<p className="text-xs text-muted-foreground">Поддерживаемые форматы: JPG, PNG, WebP до 5MB</p>*/}
              </div>
            </label>
          </div>
        </div>

        {photos.length > 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 sm:grid-rows-1 gap-4">
                {photos.map((photo, index) => (
                    <>
                      <div
                          key={index}
                          className="relative group cursor-move bg-card rounded-sm overflow-hidden hover:shadow-md transition-all duration-200"
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
                          <BurnEntityButton
                              onClick={(e) => {
                                e.stopPropagation()
                                removePhoto(index)
                              }}
                              className="absolute top-2 right-2"
                          />
                        </div>

                        {/* Photo Info */}
                        <div className="p-3 bg-card">
                          <p className="text-xs text-muted-foreground truncate font-medium">{photo.name}</p>
                        </div>
                      </div>
                    </>
                ))}
              </div>
            </div>
        )}
      </div>
  )
}
