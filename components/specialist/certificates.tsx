"use client"

import { useTranslations } from "@/hooks/use-translations"

interface CertificatesProps {
  certificates: { description: string }[]
}

export default function Certificates({ certificates }: CertificatesProps) {
  const { t } = useTranslations()

  return (
    <div>
      <h3 className="text-xl font-bold mb-6 dark:text-gray-100">{t("certificates")}</h3>
      <ul>
        {certificates.map((item, index) => (
          <li key={index} className="flex items-center mb-2">
            {item.description}
          </li>
        ))}
      </ul>
    </div>
  )
}
