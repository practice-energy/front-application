"use client"

import { useTranslations } from "@/hooks/use-translations"

interface ExperienceProps {
  experience: { description: string }[]
}

export default function Experience({ experience }: ExperienceProps) {
  const { t } = useTranslations()

  return (
    <div>
      <h3 className="text-xl font-bold mb-6 dark:text-gray-100">{t("experience")}</h3>
      <ul>
        {experience.map((item, index) => (
          <li key={index} className="flex items-center mb-2">
            {item.description}
          </li>
        ))}
      </ul>
    </div>
  )
}
