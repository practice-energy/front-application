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
import {cn} from "@/lib/utils";

interface SpecialistProfileProps {
  specialist: Specialist
}

export default function DesktopSpecialistProfile({ specialist }: SpecialistProfileProps) {
  const router = useRouter()
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const { isLiked, toggleLike } = useLikes()

  const [isExpanded, setIsExpanded] = useState(false)
  const [shouldShowToggle, setShouldShowToggle] = useState(false)
  const [contentHeight, setContentHeight] = useState(0)
  const expRef = useRef<HTMLDivElement>(null)

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

  return (
    <main className="min-h-screen  relative">
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
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-t-sm shadow-md relative min-h-[350px] ">
          {/* Черная шапка (фон) */}
          <div className="h-[104px] bg-neutral-800 w-full rounded-t-sm " />

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
                <div className="text-xl font-bold text-neutral-900 leading-relaxed">{specialist.name}</div>
                <div className="text-sm text-neutral-700 opacity-80 line-clamp-2 leading-relaxed mt-6">
                  {specialist.description}
                </div>
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
                  <div className="ml-auto">{formatNumber(specialist.likes)}</div>
                </div>

                {/* Блок практик */}
                <div className="flex flex-row items-center gap-1 w-full border h-1/2 p-2 rounded-sm mt-3">
                  <IconPractice width={20} height={18} />
                  <div className="ml-auto">{formatNumber(specialist.practices)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-b-sm shadow-md relative">
          {/* Блок под шапкой с двумя колонками */}
          <AboutSkillsSection description={specialist.description} skills={specialist.skills} />
        </div>
        <div className="bg-colors-neutral-150 relative rounded-b-sm shadow-md ">
          <div className="relative px-6 pt-6 pb-4">
            {/* Секция "Практис" с карточками услуг */}
            {specialist.services?.length > 0 && (
              <>
                <div className="text-base font-semibold text-neutral-900 mb-4 line-clamp-1 leading-relaxed">
                  Практис
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full">
                  {specialist.services?.map((service, index) => (
                    <InstagramServiceCard key={index} service={service} />
                  ))}
                </div>
              </>
            )}

            <div className="relative">
              {/* Секция "Опыт" */}
              <div className="overflow-hidden transition-all duration-500 ease-in-out flex"
                   style={{
                     height: isExpanded
                         ? `${contentHeight}px`
                         : shouldShowToggle
                             ? `130px`
                             : 'auto'
                   }}
                   ref={expRef}
              >
                <div className="mt-4">
                  <Skills title="Опыт" items={specialist.experience.map((exp) => exp.description)} />
                </div>
              </div>

              {/* Fade overlay when collapsed */}
              {shouldShowToggle && !isExpanded && (
                  <div className="absolute inset-x-0 bottom-[20px] h-14 bg-gradient-from-neutral-150 to-transparent pointer-events-none" />
              )}

              {shouldShowToggle && (
                  <button
                      onClick={handleToggle}
                      className="text-violet-600 hover:text-violet-700 h-auto ml-1 mt-3 transition-colors duration-300 flex items-center gap-1 group"
                  >
                    {isExpanded ? "Свернуть" : "Раскрыть больше"}
                    <ChevronDown width={24} height={24} className={cn(
                        "transition-transform duration-300",
                        isExpanded ? "rotate-180" : ""
                    )} />
                  </button>
              )}
            </div>

            {/* Секция "Образование и сертификаты" */}
            <div className="mt-6">
              {/* Определяем, какие секции нужно показывать */}
              {specialist.education?.length > 0 || specialist.certificates?.length > 0 ? (
                <div
                  className={`grid ${!specialist.education?.length || !specialist.certificates?.length ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"} gap-6`}
                >
                  {/* Образование - показываем если есть данные */}
                  {specialist.education?.length > 0 && (
                    <div className={!specialist.certificates?.length ? "w-full" : ""}>
                      <Certificates title="Образование" items={specialist.education} />
                    </div>
                  )}

                  {/* Сертификаты - показываем если есть данные */}
                  {specialist.certificates?.length > 0 && (
                    <div className={!specialist.education?.length ? "w-full" : ""}>
                      <Certificates title="Сертификаты" items={specialist.certificates} />
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
