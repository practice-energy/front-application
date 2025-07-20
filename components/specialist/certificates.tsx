"use client"

import { useTranslations } from "@/hooks/use-translations"

interface CertificatesProps {
  certificates: { description: string }[]
}

export default function Certificates({ certificates }: CertificatesProps) {
  const { t } = useTranslations()

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Сертификаты</h2>
      <div className="space-y-4">
        {certificates.map((cert, index) => (
          <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Хогвартс, Слизерен</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{cert.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
