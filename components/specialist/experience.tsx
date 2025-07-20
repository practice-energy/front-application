"use client"

import { useTranslations } from "@/hooks/use-translations"

interface ExperienceProps {
  experience: { description: string }[]
}

export default function Experience({ experience }: ExperienceProps) {
  const { t } = useTranslations()

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Опыт</h2>
      <div className="space-y-2">
        {experience.map((exp, index) => (
          <div key={index} className="flex items-start">
            <div className="w-2 h-2 bg-purple-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
            <span className="text-gray-600 dark:text-gray-400 leading-relaxed">{exp.description}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
