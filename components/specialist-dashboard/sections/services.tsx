"use client"

import React, { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useTranslations } from "@/hooks/use-translations"
import { Images, Check, X, PlusCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { ModeToggleBar } from "@/components/profile/mode-toggle-bar"
import { motion, AnimatePresence } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import {mockServices, mockSpecialist} from "@/services/mock-data"
import { ANIMATION_DURATION, ANIMATION_TIMING } from "@/components/main-sidebar"
import {InstagramServiceCard} from "@/components/instagram-service-card";

// Компонент грида карточек
const Cards = ({
                   services,
                   isEditMode,
                   onToggleService,
                   onCardClick,
                   onAddService
               }: {
    services: any[];
    isEditMode: boolean;
    onToggleService: (id: number) => void;
    onCardClick: (service: any) => void;
    onAddService: () => void;
}) => {
    return (
        <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {isEditMode ? "My Services" : "Services Offered"}
                </h2>

                {isEditMode && (
                    <button
                        onClick={onAddService}
                        className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                    >
                        <PlusCircle className="h-5 w-5" />
                        Add Service
                    </button>
                )}
            </div>

            <AnimatePresence>
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 gap-5"
                >
                    {services.map(service => (
                        <InstagramServiceCard
                            key={service.id}
                            service={service}
                            // isEditMode={isEditMode}
                            // isActive={service.isActive}
                            onToggleActive={() => onToggleService(service.id)}
                            onClick={() => onCardClick(service)}
                        />
                    ))}

                    {isEditMode && (
                        <motion.div
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                            className={`
                border-2 border-dashed rounded-sm flex flex-col items-center justify-center
                border-gray-300 dark:border-gray-600 hover:border-indigo-400
                cursor-pointer min-h-[150px] transition-colors bg-white dark:bg-gray-800
              `}
                            onClick={onAddService}
                        >
                            <PlusCircle className="h-8 w-8 text-gray-400 mb-2" />
                            <span className="text-gray-600 dark:text-gray-400 font-medium">
                Add New Service
              </span>
                        </motion.div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default function Services() {
    const router = useRouter()
    const { isAuthenticated, user } = useAuth()
    const [isEditMode, setIsEditMode] = useState(false)
    const [isTransitioning, setIsTransitioning] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [hasChanges, setHasChanges] = useState(false)
    const [isAnimating] = useState(false)

    // State for editable data
    const [savedData, setSavedData] = useState(mockSpecialist)
    const [draftData, setDraftData] = useState(mockSpecialist)
    const [errors, setErrors] = useState<Record<string, string>>({})

    // State for services
    const [services, setServices] = useState(mockServices);

    // Check for changes between draft and saved data
    useEffect(() => {
        const changed = JSON.stringify(draftData) !== JSON.stringify(savedData)
        setHasChanges(changed)
    }, [draftData, savedData])

    const handleInputChange = (field: string, value: any) => {
        setDraftData((prev) => ({ ...prev, [field]: value }));

        // Clear specific error when field changes
        setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        });
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!draftData.name?.trim()) newErrors.name = "Name is required";
        if (!draftData.title?.trim()) newErrors.title = "Title is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handlePublish = async () => {
        setIsSaving(true)
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000))

            // Update saved data to new published state
            setSavedData(draftData)
            setHasChanges(false)

            console.log("Saving profile data:", draftData)
        } catch (error) {
            console.error("Failed to save profile:", error)
        } finally {
            setIsSaving(false)
        }
    }

    const handleModeToggle = async (mode: "view" | "edit") => {
        if (mode === "view") {
            // Validate before switching to view mode
            if (!validateForm()) {
                return
            }

            setIsTransitioning(true)

            if (hasChanges) {
                await handlePublish()
            }

            // Small delay for smoother transition
            await new Promise((resolve) => setTimeout(resolve, 300))
            setIsTransitioning(false)
        }

        setIsTransitioning(true)
        setIsEditMode(mode === "edit")

        // Small delay for smoother transition
        await new Promise((resolve) => setTimeout(resolve, 300))
        setIsTransitioning(false)
    }

    // Toggle service active state
    const handleToggleService = (id: number) => {
        setServices(prevServices =>
            prevServices.map(service =>
                service.id === id
                    ? { ...service, isActive: !service.isActive }
                    : service
            )
        );
    };

    // Handle service card click - navigate to service page
    const handleServiceCardClick = (service: any) => {
        router.push(`/service-edit/${service.id}`)
    };

    // Handle adding a new service
    const handleAddService = () => {
        const newService = {
            id: services.length + 1,
            title: "New Service",
            price: 0,
            duration: 30,
            imageUrl: "",
            isActive: true
        };

        setServices(prev => [...prev, newService]);
    };

    const currentData = isEditMode ? draftData : savedData
    const hasErrors = Object.keys(errors).length > 0

    // If data is still loading
    // if (isAuthenticated === null) {
    //     return (
    //         <div className="flex items-center justify-center min-h-[400px]">
    //             <div className="animate-pulse text-muted-foreground">Loading user data...</div>
    //         </div>
    //     )
    // }

    return (
        <>
            <ModeToggleBar
                isEditMode={isEditMode}
                onModeToggle={handleModeToggle}
                hasErrors={hasErrors}
                errors={errors}
                hasChanges={hasChanges}
                isSaving={isSaving}
            />

            <AnimatePresence mode="wait">
                {isTransitioning ? (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
                            <Skeleton className="h-[300px] w-full rounded-sm" />
                            <Skeleton className="h-[200px] w-full rounded-sm" />
                            <Skeleton className="h-[250px] w-full rounded-sm" />
                            <Skeleton className="h-[300px] w-full rounded-sm" />
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="content"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                    >
                        <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
                            <div
                                style={{
                                    transition: `all ${ANIMATION_DURATION}ms ${ANIMATION_TIMING}`,
                                }}
                                data-animating={isAnimating ? "true" : "false"}
                            >
                                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
                                    {/* Instagram-style centered card */}
                                    <div className="bg-white dark:bg-gray-800 rounded-sm shadow-sm border-gray-200 dark:border-gray-700 overflow-hidden">
                                    {/* Service Cards Grid */}
                                    <Cards
                                        services={services}
                                        isEditMode={isEditMode}
                                        onToggleService={handleToggleService}
                                        onCardClick={handleServiceCardClick}
                                        onAddService={handleAddService}
                                    />
                                    </div>
                                </div>
                            </div>
                        </main>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
