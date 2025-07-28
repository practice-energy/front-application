"use client"

import React, {useEffect, useRef} from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {MapPin, Share, MessagesSquare, ChevronDown} from "lucide-react"
import { InstagramServiceCard } from "@/components/instagram-service-card"
import { BackButton } from "@/components/ui/button-back"
import type { Specialist } from "@/types/common"
import { PentagramIcon } from "@/components/icons/icon-pentagram"
import { useLikes } from "@/hooks/use-likes"
import { IconPractice } from "@/components/icons/icon-practice"
import {formatCompactNumber, formatNumber} from "@/utils/format"
import { Certificates } from "./certificates"
import { Skills } from "./skills"
import { AboutSkillsSection } from "./about-skills-section"
import Image from "next/image";
import {cn} from "@/lib/utils";
import {ServicesSection} from "@/components/specialist/practice";
import {ModeToggleBar} from "@/components/profile/mode-toggle-bar";
import {SpecialistData} from "@/components/specialist/types/common";

interface MobileSpecialistProfileProps {
    specialist: Specialist
}

export default function MobileSpecialistProfile({ specialist }: MobileSpecialistProfileProps) {
    const router = useRouter()
    const [shareModalOpen, setShareModalOpen] = useState(false)
    const { isLiked, toggleLike } = useLikes()

    const [isExpanded, setIsExpanded] = useState(false)
    const [shouldShowToggle, setShouldShowToggle] = useState(false)
    const [contentHeight, setContentHeight] = useState(0)
    const expRef = useRef<HTMLDivElement>(null)
    const isEditable = true //user?.specialistProfile?.id === specialist.id
    const [isEditMode, setIsEditMode] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [hasChanges, setHasChanges] = useState(false)

    // Saved data (what's displayed in View mode)
    const [savedData, setSavedData] = useState<SpecialistData>({
        name: specialist.name || "",
        description: specialist.description || "",
        title: specialist.title || "",
        location: specialist.location || "",
        avatar: specialist.avatar || "",
        experience: specialist.experience || [],
        education: specialist.education || [],
        certificates: specialist.certificates || [],
        skills: specialist.skills || [],
        services: specialist.services || [],
    })

    // Draft data (what's being edited in Edit mode)
    const [draftData, setDraftData] = useState<SpecialistData>({
        name: specialist.name || "",
        description: specialist.description || "",
        title: specialist.title || "",
        location: specialist.location || "",
        avatar: specialist.avatar || "",
        experience: specialist.experience || [],
        education: specialist.education || [],
        certificates: specialist.certificates || [],
        skills: specialist.skills || [],
        services: specialist.services || [],
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        const targetElement = expRef.current
        if (targetElement) {
            const height = targetElement.scrollHeight
            setContentHeight(height)
            setShouldShowToggle(height > 130)
        }
    }, [draftData.experience])

    useEffect(() => {
        // Рассчитываем высоту только для описания на мобильных устройствах
        const targetElement = expRef.current;
        if (targetElement) {
            const height = targetElement.scrollHeight
            setContentHeight(height)
            setShouldShowToggle(height > 130)
        }
    },)

    const handleToggle = () => {
        setIsExpanded(!isExpanded)
    }

    const liked = isLiked(specialist.id)

    const handleLikeClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        toggleLike(specialist.id)
    }

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation()
        setShareModalOpen(true)
    }

    const handleReply = (e: React.MouseEvent) => {
        e.stopPropagation()
        router.push(`/search/${specialist.id}`)
    }

    const handlePublish = async () => {
        // setIsSaving(true)
        // try {
        //     // Simulate avatar upload if new file was selected
        //     if (avatarFile) {
        //         await new Promise(resolve => setTimeout(resolve, 1000))
        //         const mockFileUrl = URL.createObjectURL(avatarFile)
        //         handleInputChange("avatar", mockFileUrl)
        //         setAvatarFile(null)
        //     }
        //
        //     // Update saved data
        //     setSavedData(draftData)
        //     setHasChanges(false)
        //     setIsTransitioning(true)
        //     setIsEditMode(false)
        //
        //     await new Promise(resolve => setTimeout(resolve, 300))
        //     setIsTransitioning(false)
        // } catch (error) {
        //     console.error("Failed to save profile:", error)
        // } finally {
        //     setIsSaving(false)
        // }
    }

    const handleModeToggle = async (mode: "view" | "edit") => {
        if (mode === "view") {
            if (!validateForm()) {
                return
            }

            setIsTransitioning(true)

            if (hasChanges) {
                await handlePublish()
            }

            await new Promise(resolve => setTimeout(resolve, 300))
            setIsTransitioning(false)
        }

        setIsTransitioning(true)
        setIsEditMode(mode === "edit")
        await new Promise(resolve => setTimeout(resolve, 300))
        setIsTransitioning(false)
    }

    return (
        <main className="min-h-screen w-full relative">
            <div className="w-full">
                {/* Header with Back Button and Action Buttons */}
                <div className="flex items-center justify-between mb-4 px-4 relative">
                    <div className="flex-1">
                        <BackButton className="text-neutral-700 opacity-80" text={"назад к чату"} />
                    </div>

                    <div className="flex flex-row gap-3 items-center pt-2.5 pr-6">
                        {isEditable ? (
                            <>
                                <ModeToggleBar
                                    isEditMode={isEditMode}
                                    onModeToggle={handleModeToggle}
                                    onPublish={handlePublish}
                                    isSaving={isSaving}
                                    hasChanges={hasChanges}
                                />
                            </>
                        ) : (
                            <>
                                {/* Star Button */}
                                <button
                                    type="button"
                                    onClick={handleLikeClick}
                                    className={`
                rounded-sm flex h-9 w-9 items-center justify-center transition-colors duration-200 shadow-sm aspect-square p-0 border-none 
                ${
                                        liked
                                            ? "bg-violet-600 hover:bg-violet-700 text-white"
                                            : "bg-white hover:bg-violet-50 dark:hover:bg-violet-700 text-gray-700 opacity-80"
                                    }
                active:bg-violet-600 dark:active:bg-violet-600
                active:text-white dark:active:text-white
                active:border-violet-600 dark:active:border-violet-600
                text-black dark:text-white
                focus:outline-none
            `}
                                    title="Сохранить в избранное"
                                >
                                    <PentagramIcon size={24} />
                                </button>

                                {/* Message Button */}
                                <button
                                    type="button"
                                    onClick={handleReply}
                                    className="rounded-sm h-9 w-9 flex items-center justify-center bg-white hover:bg-violet-50 shadow-sm transition-colors aspect-square duration-200 text-gray-700 opacity-80"
                                    title="Написать специалисту"
                                >
                                    <MessagesSquare size={24} />
                                </button>

                                {/* Share Button */}
                                <button
                                    type="button"
                                    onClick={handleShare}
                                    className="rounded-sm h-9 w-9 flex items-center justify-center bg-white hover:bg-violet-50 shadow-sm transition-colors aspect-square duration-200 text-gray-700 opacity-80"
                                    title="Написать специалисту"
                                >
                                    <Share size={24} />
                                </button>
                            </>
                        )}

                        <button
                            type="button"
                            onClick={handleShare}
                            className="rounded-sm h-9 w-9 flex items-center justify-center bg-white hover:bg-violet-50 shadow-sm transition-colors aspect-square duration-200 text-gray-700 opacity-80"
                            title="Написать специалисту"
                        >
                            <Share size={24} />
                        </button>
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="bg-white relative">
                    {/* Аватар */}
                    <div className="relative">
                        <div className="w-full rounded-sm p-1 overflow-hidden relative aspect-[4/5]">
                            <img
                                src={specialist.avatar || "/placeholder.svg"}
                                alt={specialist.name}
                                className="w-full h-full rounded-sm object-cover"
                            />
                        </div>

                        {/* Квадратный фрейм в нижнем правом углу фото */}
                        <div className="absolute bottom-3 right-3 bg-colors-neutral-150 rounded-sm p-1 w-[78px] h-[84px] gap-3">
                            {/* Блок лайков */}
                            <div className="flex flex-row items-center gap-1 text-violet-600 w-full border p-1 rounded-sm h-[36px]">
                                <PentagramIcon size={24} />
                                <div className="ml-auto text-sm">{formatCompactNumber(specialist.likes)}</div>
                            </div>

                            {/* Блок практик */}
                            <div className="flex flex-row items-center gap-1 w-full border h-[36px] p-1 rounded-sm mt-1">
                                <IconPractice width={22} height={20} />
                                <div className="ml-auto text-sm">{formatCompactNumber(specialist.practices)}</div>
                            </div>
                        </div>
                    </div>

                    {/* Информация о специалисте */}
                    <div className="px-4 pt-2">
                        <div className="text-mobilebase font-bold text-neutral-900 leading-relaxed">{specialist.name}</div>
                        <div className="text-mobilebase text-neutral-700 opacity-80 line-clamp-2 leading-relaxed mt-2">
                            {specialist.description}
                        </div>
                        <div className="flex items-center mt-3 text-neutral-600">
                            <MapPin className="w-4 h-4 mr-1" />
                            <div className="text-base font-normal">{specialist.location}</div>
                        </div>
                    </div>
                </div>

                {/* About and Skills Section */}
                <div className="bg-white rounded-b-sm shadow-md">
                    <AboutSkillsSection
                        description={specialist.description}
                        skills={specialist.skills}
                    />
                </div>

                {/* Services, Experience and Certificates */}
                <div className="bg-colors-neutral-150 rounded-sm shadow-md p-4">

                    <ServicesSection services={specialist.services} />

                    <div className="relative">
                        {/* Секция "Опыт" */}
                        <div className="mt-4">
                            <Skills title="Опыт" items={specialist.experience.map((exp) => exp.description)} />
                        </div>
                    </div>

                    {/* Секция "Образование и сертификаты" - вертикально друг за другом */}
                    <div className="mt-4 space-y-4">
                        {/* Образование - показываем если есть данные */}
                        {specialist.education?.length > 0 && (
                            <Certificates title="Образование" items={specialist.education} />
                        )}

                        {/* Сертификаты - показываем если есть данные */}
                        {specialist.certificates?.length > 0 && (
                            <Certificates title="Сертификаты" items={specialist.certificates} />
                        )}
                    </div>

                    <div className="h-24"/>
                </div>
            </div>
        </main>
    )
}
