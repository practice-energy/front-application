"use client"

import { InstagramServiceCard } from "@/components/instagram-service-card"
import { cn } from "@/lib/utils"
import {Service, Specialist} from "@/types/common";
import {AddEntityButton} from "@/components/add-entity-button";
import {PracticePlaceholder} from "@/components/practice-placeholder";
import React from "react";
import {v4 as uuidv4} from "uuid";
import {SpecialistData} from "@/components/specialist/types/common";
import {useRouter} from "next/navigation";
import {useIsMobile} from "@/hooks/use-mobile";

interface PracticeBlockSectionProps {
    services: Service[]
    className?: string
    isEditMode: boolean
    onInputChange: (field: keyof SpecialistData, value: Service[]) => void
    specialist: Specialist
}

export function PracticeBlockSection({ services, className, isEditMode, onInputChange, specialist }: PracticeBlockSectionProps) {
    const router = useRouter()
    const isMobile = useIsMobile()

    const handleAddService = () => {
        const newService: Service = {
            id: uuidv4(),
            title: "",
            format: [],
            description: "",
            practice: "",
            price: 0,
            duration: "",
            images: [],
            includes: [],
            specialist: {
                id: specialist.id,
                name: specialist.name,
                title: specialist.title,
                avatar: specialist.avatar
            },
            tags: [],
            reviews: []
        }
        onInputChange("services", [...services, newService])
    }

    const handleRemoveService = (id: string) => {
        const updatedServices = services.filter(service => service.id !== id)
        onInputChange("services", updatedServices)
    }

    const handleCopyService = (id: string) => {
        const serviceToCopy = services.find(service => service.id === id)
        if (!serviceToCopy) return

        const copiedService = {
            ...serviceToCopy,
            id: uuidv4() // Генерируем новый ID для копии
        }
        onInputChange("services", [...services, copiedService])
    }

    const handleEdit = (service: Service) => {
        router.push(`/service/${service.id}?mode=${isEditMode ? "edit" : "view"}`)
    }

    return (
        <div className={cn("w-full ", className)}>
            <div className="flex flex-row gap-2 items-center pb-1">
                {(isEditMode || services?.length > 0) && (
                    <div className={cn(
                        "font-semibold text-neutral-900 line-clamp-1 leading-relaxed",
                        isMobile ? "text-mobilebase" : "text-base",
                    )}>
                        Практис
                    </div>
                )}
                {isEditMode && <AddEntityButton onClick={handleAddService}/>}
            </div>

            {(!services || services.length === 0) && (
                <div className="mx-6 mb-2 items-center justify-center flex flex-col">
                    <PracticePlaceholder width={120} height={120} iconClassName="text-gray-400" />
                    <div className="text-gray-400 text-center">Практис не добавлены</div>
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 w-full">
                {services?.map((service) => (
                    <InstagramServiceCard
                        key={service.id}
                        service={service}
                        isEditMode={isEditMode}
                        onCopy={() => handleCopyService(service.id)}
                        onEdit={() => handleEdit(service)}
                        onBurn={() => handleRemoveService(service.id)}
                    />
                ))}
            </div>
        </div>
    )
}
