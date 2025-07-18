"use client"

import { useTranslations } from "@/hooks/use-translations"

interface EducationProps {
  education: { description: string }[]
}

export default function Education({ education }: EducationProps) {
  const { t } = useTranslations()

  return (
    <div>
      <h3 className="text-xl font-bold mb-6 dark:text-gray-100">{t("education")}</h3>
      <ul>
        {education.map((item, index) => (
          <li key={index} className="flex items-center mb-2">
            {item.description}
          </li>
        ))}
      </ul>
    </div>
  )
}
