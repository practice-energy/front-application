"use client"

import { useTranslations } from "@/hooks/use-translations"

interface SkillsProps {
  skills: string[]
}

export default function Skills({ skills }: SkillsProps) {
  const { t } = useTranslations()

  return (
    <div>
      <h3 className="text-xl font-bold mb-6 dark:text-gray-100">{t("skills")}</h3>
      <ul>
        {skills.map((skill) => (
          <li key={skill} className="flex items-center mb-2">
            {skill}
          </li>
        ))}
      </ul>
    </div>
  )
}
