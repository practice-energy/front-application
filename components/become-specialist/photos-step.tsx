"use client"

import { PhotoUpload } from "@/components/photo-upload"
import { useTranslations } from "@/hooks/use-translations"
import type React from "react";

interface PhotosStepProps {
  photos: File[]
  onPhotosChange: (photos: File[]) => void
}

export function PhotosStep({ photos, onPhotosChange }: PhotosStepProps) {
  const { t } = useTranslations()

  return (
      <div className="space-y-6">
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">
            Photos
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto transition-colors duration-300">
            We've pre-loaded your existing photos from your profile. You can add additional below.
          </p>
        </div>

        <PhotoUpload
            photos={photos}
            onPhotosChange={onPhotosChange}
            maxPhotos={5}
            title={t("specialist.profilePhotos")}
            description={t("specialist.uploadPhotosDesc")}
            showTitle={false}
        />
      </div>
  )
}
