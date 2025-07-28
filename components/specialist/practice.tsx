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

interface PracticeBlockSectionProps {
    services: Service[]
    className?: string
    isEditMode: boolean
    onInputChange: (field: keyof SpecialistData, value: Service[]) => void
    specialist: Specialist
}

export function PracticeBlockSection({ services, className, isEditMode, onInputChange, specialist }: PracticeBlockSectionProps) {
    const router = useRouter()

    const handleAddService = () => {
        const updatedServices = [...services, {
            id: uuidv4(),
            title: "",
            format: "video",
            description: "",
            practice: 0,
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
        }]
        onInputChange("services", updatedServices)
    }

    const handleRemoveService = (index: number) => {
        const updatedServices = services.filter((_, i) => i !== index)
        onInputChange("services", updatedServices)
    }

    const handleCopyService = (index: number) => {
        const updatedServices = [...services, services[index]]
        onInputChange("services", updatedServices)
    }

    const handleEdit = (service: Service) => {
        router.push(`/service/${service.id}?mode=edit`)
    }

    return (
        <div className={cn("w-full ", className)}>
            <div className="flex flex-row gap-2">
                {isEditMode ? (<>
                    <div className="text-base font-semibold text-neutral-900 mb-3 md:mb-4 line-clamp-1 leading-relaxed">
                        Практис
                    </div>
                    <AddEntityButton onClick={handleAddService}/>
                </>) : (<>
                    {services && services.length > 0 && (
                        <div className="text-base font-semibold text-neutral-900 mb-3 md:mb-4 line-clamp-1 leading-relaxed">
                            Практис
                        </div>
                    )}
                </>)}
            </div>

            {!services || services.length === 0 && (
                <div className="mx-6 mb-2 items-center justify-center flex flex-col">
                    <PracticePlaceholder width={120} height={120} iconClassName="text-gray-400" />
                    <div className="text-gray-400 text-center">Практис не добавлены</div>
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 w-full">
                {services.map((service, index) => (
                    <InstagramServiceCard
                        key={service.id}
                        service={service}
                        isEditMode={isEditMode}
                        onCopy={() => handleCopyService(index)}
                        onEdit={() => handleEdit(service)}
                        onBurn={() => handleRemoveService(index)}
                    />
                ))}
            </div>
        </div>
    )
}