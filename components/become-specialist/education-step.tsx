"use client"

import ExperienceForm from "@/components/experience-item"
import { useTranslations } from "@/hooks/use-translations"

interface ExperienceItem {
  description: string
  certificate?: File | null
}

interface EducationStepProps {
  education: ExperienceItem[]
  onEducationChange: (education: ExperienceItem[]) => void
}

export function EducationStep({ education, onEducationChange }: EducationStepProps) {
  const { t } = useTranslations()

  return (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">
          Education
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto transition-colors duration-300">
          We've pre-loaded your existing education from your profile. You can add additional education below.
        </p>
      </div>

      <ExperienceForm
        title={t("specialist.education")}
        description={t("specialist.educationDesc")}
        items={education}
        onChange={onEducationChange}
        showCertificates={true}
      />
    </div>
  )
}
