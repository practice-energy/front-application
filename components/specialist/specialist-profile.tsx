"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import {MapPin, Share, MessageCircle, Reply, MessagesSquare} from "lucide-react"
import { InstagramServiceCard } from "@/components/instagram-service-card"
import { BackButton } from "@/components/ui/button-back"
import type { Specialist } from "@/types/common"
import { PentagramIcon } from "@/components/icons/icon-pentagram"
import { cn } from "@/lib/utils"
import {useLikes} from "@/hooks/use-likes";
import {IconPractice} from "@/components/icons/icon-practice";
import {InstagramSpecialistCard} from "@/components/instagram-specialist-card";
import Image from "next/image";
import {formatCompactNumber} from "@/utils/format";

interface SpecialistProfileProps {
    specialist: Specialist
}

export default function SpecialistProfile({ specialist }: SpecialistProfileProps) {
    const router = useRouter()
    const [shareModalOpen, setShareModalOpen] = useState(false)
    const { isLiked, toggleLike } = useLikes()
    const [showFullDescription, setShowFullDescription] = useState(false)

    const liked = isLiked(specialist.id)

    const handleServiceCardClick = (service: any) => {
        router.push(`/service/${service.id}`)
    }

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

    return (
        <main className="min-h-screen  pb-[144px] relative">
            <div className="w-full mx-auto px-4 sm:px-6 py-8 md:w-[845px]">
                {/* Header with Back Button and Action Buttons */}
                <div className="flex items-center justify-between mb-8 relative">
                    <div className="flex-1">
                        <BackButton className="text-neutral-700 opacity-80" text={"назад к чату"} />
                    </div>

                    <div className="flex flex-row gap-3 items-center pt-2.5">
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
                            <PentagramIcon size={24}/>
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
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="bg-white rounded-t-sm shadow-md relative min-h-[350px] ">
                    {/* Черная шапка (фон) */}
                    <div className="h-[104px] bg-neutral-800 w-full rounded-t-sm "  />

                    {/* Основной контент */}
                    <div className="relative px-6 pt-6">
                        {/* Аватар, накладывающийся на шапку */}
                        <div className="absolute -top-20 left-6">
                            <div className="w-[250px] h-[312.5px] rounded-sm shadow-md overflow-hidden">
                                <img
                                    src={specialist.avatar || "/placeholder.svg"}
                                    alt={specialist.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Блок с информацией справа от аватара и квадратный фрейм */}
                        <div className="ml-[286px] pt-6 flex justify-between items-start ">
                            <div className="pr-4">
                                <div className="text-xl font-bold text-neutral-900 line-clamp-1 leading-relaxed">{specialist.name}</div>
                                <div className="text-sm text-neutral-700 opacity-80 line-clamp-2 leading-relaxed mt-6">{specialist.description}</div>
                                <div className="flex items-center mt-4 text-neutral-600">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    <span>{specialist.location}</span>
                                </div>
                            </div>

                            {/* Квадратный фрейм 100x100 px */}
                            <div className="bg-colors-neutral-150 rounded-sm shadow-md shadow-violet-100 aspect-square p-2 w-[100px]">
                                {/* Блок лайков */}
                                <div className="flex flex-row items-center gap-1 text-violet-600 w-full border h-1/2 p-2 rounded-sm">
                                    <PentagramIcon size={20} />
                                    <div className="ml-auto">{formatCompactNumber(specialist.likes)}</div>
                                </div>

                                {/* Блок практик */}
                                <div className="flex flex-row items-center gap-1 w-full border h-1/2 p-2 rounded-sm mt-3">
                                    <IconPractice
                                        width={20}
                                        height={18}
                                    />
                                    <div className="ml-auto">{formatCompactNumber(specialist.practices)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-b-sm shadow-md relative">
                    {/* Блок под шапкой с двумя колонками */}
                    <div className="relative px-6 pt-6 flex pb-7">
                        {/* Колонка "О мастере" (2/3 ширины) */}
                        <div className="w-2/3 pr-6">
                            <div className="text-base font-semibold text-neutral-900 mb-4 line-clamp-1 leading-relaxed">О мастере</div>
                            <div className="overflow-hidden transition-all duration-300 ease-in-out">
                                <div className="ml-1 text-neutral-700">
                                    {specialist.description}
                                </div>
                            </div>
                        </div>

                        {/* Колонка "Навыки" (1/3 ширины) */}
                        <div className="w-1/3">
                            {specialist.skills.length > 0 && (
                                <>
                                    <div className="text-base font-semibold text-neutral-900 mb-4 line-clamp-1 leading-relaxed">Навыки</div>
                                    <ul className="space-y-2 ml-1">
                                        {specialist.skills.map((item, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <div className="w-3 h-3 bg-violet-500 dark:bg-violet-600 rounded-sm mt-1.5 flex-shrink-0" />
                                                <span className="text-gray-700 dark:text-gray-300">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="bg-colors-neutral-150 relative rounded-b-sm shadow-md ">
                    <div className="relative px-6 pt-6 pb-4">
                        {/* Секция "Практис" с карточками услуг */}
                        {specialist.services?.length > 0 && (<>
                            <div className="text-base font-semibold text-neutral-900 mb-4 line-clamp-1 leading-relaxed">Практис</div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full">
                                {specialist.services?.slice(0, 3).map((service, index) => (
                                    <InstagramServiceCard
                                        key={index}
                                        onClick={() => {}}
                                        service={service}
                                    />
                                ))}
                            </div>
                        </>)}

                        {/* Секция "Опыт" */}
                        {specialist.experience.length > 0 && (
                            <>
                                <div className="text-base font-semibold text-neutral-900 mb-4 mt-6 line-clamp-1 leading-relaxed">Опыт</div>
                                <ul className="space-y-2 ml-1">
                                    {specialist.experience.map((item, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <div className="w-3 h-3 bg-violet-500 dark:bg-violet-600 rounded-sm mt-1.5 flex-shrink-0" />
                                            <span className="text-gray-700 dark:text-gray-300">{item.description}</span>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}

                        {/* Секция "Образование и сертификаты" */}
                        <div className="mt-6">
                            {/* Определяем, какие секции нужно показывать */}
                            {specialist.education?.length > 0 || specialist.certificates?.length > 0 ? (
                                <div className={`grid ${!specialist.education?.length || !specialist.certificates?.length ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-6`}>
                                    {/* Образование - показываем если есть данные */}
                                    {specialist.education?.length > 0 && (
                                        <div className={!specialist.certificates?.length ? 'w-full' : ''}>
                                            <div className="text-base font-semibold text-neutral-900 mb-4 line-clamp-1 leading-relaxed">Образование</div>
                                            <div className="space-y-4">
                                                {specialist.education.map((edu, index) => (
                                                    <div key={index} className="bg-white p-3 rounded-sm shadow-sm flex">
                                                        <div className="flex-1 min-w-0 pr-1">
                                                            <div className="font-semibold text-neutral-900 line-clamp-1 leading-relaxed">
                                                                {edu.title}
                                                            </div>
                                                            <div className="text-sm text-neutral-600 mt-1 line-clamp-2 leading-relaxed">
                                                                {edu.description}
                                                            </div>
                                                        </div>
                                                        <div className="w-[72px] aspect-square flex-shrink-0 bg-colors-neutral-150 rounded-sm border shadow-md">
                                                            {edu.certificate ? (
                                                                <Image
                                                                    src={edu.certificate}
                                                                    alt={`Certificate ${index}`}
                                                                    width={64}
                                                                    height={64}
                                                                    className="w-full h-full object-cover rounded-sm"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center bg-colors-neutral-150 rounded-sm">
                                                                    <IconPractice width={48} height={48}/>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Сертификаты - показываем если есть данные */}
                                    {specialist.certificates?.length > 0 && (
                                        <div className={!specialist.education?.length ? 'w-full' : ''}>
                                            <div className="text-base font-semibold text-neutral-900 mb-4 line-clamp-1 leading-relaxed">Сертификаты</div>
                                            <div className="space-y-4">
                                                {specialist.certificates.map((cert, index) => (
                                                    <div key={index} className="bg-white p-3 rounded-sm shadow-sm flex">
                                                        <div className="flex-1 min-w-0 pr-1">
                                                            <div className="font-semibold text-neutral-900 line-clamp-1 leading-relaxed">
                                                                {cert.title}
                                                            </div>
                                                            <div className="text-sm text-neutral-600 mt-1 line-clamp-2 leading-relaxed">
                                                                {cert.description}
                                                            </div>
                                                        </div>
                                                        <div className="w-[72px] aspect-square flex-shrink-0 bg-colors-neutral-150 rounded-sm border shadow-md">
                                                            {cert.certificate ? (
                                                                <Image
                                                                    src={cert.certificate}
                                                                    alt={`Certificate ${index}`}
                                                                    width={64}
                                                                    height={64}
                                                                    className="w-full h-full object-cover rounded-sm"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center bg-colors-neutral-150 rounded-sm">
                                                                    <IconPractice width={48} height={48}/>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}