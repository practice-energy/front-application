"use client"

import { useTranslations } from "@/hooks/use-translations"

interface EducationProps {
  education: { description: string }[]
}

export default function Education({ education }: EducationProps) {
  const { t } = useTranslations()

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Образование</h2>
      <div className="space-y-4">
        {education.map((edu, index) => (
          <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Хогвартс, Слизерен</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{edu.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
