"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase } from "lucide-react"
import ExperienceForm from "@/components/experience-item"
import { useCallback } from "react"

interface ExperienceItem {
    description: string
    certificate?: File | null
}

interface ExperienceCardProps {
    data: ExperienceItem[]
    isEditMode: boolean
    onExperienceChange: (experience: ExperienceItem[]) => void
}

// Вспомогательный компонент для элемента опыта в режиме просмотра
function ExperienceListItem({ item }: { item: ExperienceItem }) {
    const openCertificate = useCallback(() => {
        if (!item.certificate) return

        // Создаём временную ссылку на файл
        const fileUrl = URL.createObjectURL(item.certificate)

        // Открываем файл в новой вкладке
        const win = window.open(fileUrl, '_blank')

        // Освобождаем ресурсы после загрузки
        if (win) {
            win.onload = () => URL.revokeObjectURL(fileUrl)
        } else {
            // Если не удалось открыть окно, освобождаем ресурсы сразу
            URL.revokeObjectURL(fileUrl)
        }
    }, [item.certificate])

    return (
        <li className="flex items-start gap-3">
            {/* Точка с выравниванием по центру текста */}
            <div className="w-3 h-3 bg-violet-500 dark:bg-violet-600 flex-shrink-0 mt-1.5 rounded-sm" />

            {/* Кликабельное описание, если есть сертификат */}
            {item.certificate ? (
                <button
                    onClick={openCertificate}
                    className="text-left text-gray-700 dark:text-gray-300 hover:underline focus:outline-none focus:ring-2 focus:ring-violet-500 rounded"
                    title="View certificate"
                >
                    {item.description}
                </button>
            ) : (
                <span className="text-gray-700 dark:text-gray-300">
          {item.description}
        </span>
            )}
        </li>
    )
}

export function ExperienceCard({ data, isEditMode, onExperienceChange }: ExperienceCardProps) {
    return (
        <Card className="shadow-sm border-border bg-card dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-6">
                <div className="flex items-center gap-2">
                    <CardTitle className="text-lg text-foreground dark:text-gray-100">Professional Experience</CardTitle>
                </div>
            </CardHeader>

            <CardContent>
                {isEditMode ? (
                    <ExperienceForm items={data} onChange={onExperienceChange} showCertificates={false} />
                ) : (
                    <div className="space-y-3">
                        {data.filter((exp) => exp.description.trim()).length > 0 ? (
                            <ul className="space-y-3">
                                {data
                                    .filter((exp) => exp.description.trim())
                                    .map((item, index) => (
                                        <ExperienceListItem key={index} item={item} />
                                    ))}
                            </ul>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground dark:text-gray-400">
                                <Briefcase className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p>No experience added yet</p>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
