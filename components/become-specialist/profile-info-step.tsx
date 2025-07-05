"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useTranslations } from "@/hooks/use-translations"
import type React from "react";

interface ProfileInfoStepProps {
  title: string
  bio: string
  onTitleChange: (title: string) => void
  onBioChange: (bio: string) => void
}

export function ProfileInfoStep({ title, bio, onTitleChange, onBioChange }: ProfileInfoStepProps) {
  const { t } = useTranslations()

  return (
    <div className="space-y-6">
        <div className="space-y-6">
            <div className="text-center space-y-3">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">
                    Bio
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto transition-colors duration-300">
                    Enter your professional information below. This will be displayed publicly on your profile.
                </p>
            </div>
        <Label htmlFor="title" className="mb-2 block">
          {t("specialist.professionalTitle")} *
        </Label>
        <Input
          id="title"
          name="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder={t("specialist.titlePlaceholder")}
          required
        />
      </div>

      <div>
        <Label htmlFor="bio" className="mb-2 block">
          {t("specialist.professionalBio")}
        </Label>
        <Textarea
          id="bio"
          name="bio"
          value={bio}
          onChange={(e) => onBioChange(e.target.value)}
          placeholder={t("specialist.bioPlaceholder")}
          rows={5}
        />
      </div>
    </div>
  )
}
