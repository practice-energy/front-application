"use client"

import { InstagramServiceCard } from "@/components/instagram-service-card"
import { cn } from "@/lib/utils"
import {Service} from "@/types/common";
import {AddEntityButton} from "@/components/add-entity-button";

interface PracticeSectionProps {
    services: Service[]
    className?: string
    isEditMode: boolean
    onAdd: () => void
    onCopy: () => void
    onEdit: (service: Service) => void
    onBurn: () => void
}

export function ServicesSection({ services, className, isEditMode, onAdd }: PracticeSectionProps) {
    if (!services || services.length === 0) return null

    return (
        <div className={cn("w-full ", className)}>
            <div className="flex flex-row gap-2">
                <div className="text-base font-semibold text-neutral-900 mb-3 md:mb-4 line-clamp-1 leading-relaxed">
                    Практис
                </div>
                {isEditMode && (<AddEntityButton onClick={onAdd}/>)}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 w-full">
                {services.map((service) => (
                    <InstagramServiceCard
                        key={service.id}
                        service={service}
                    />
                ))}
            </div>
        </div>
    )
}