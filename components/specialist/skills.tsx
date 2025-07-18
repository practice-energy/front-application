"use client"

import { useTranslations } from "@/hooks/use-translations"

interface SkillsProps {
  skills: string[]
}

export default function Skills({ skills }: SkillsProps) {
  const { t } = useTranslations()

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Навыки</h2>
      <div className="space-y-2">
        {skills.map((skill, index) => (
          <div key={index} className="flex items-center">
            <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
            <span className="text-gray-600 dark:text-gray-400">{skill}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
