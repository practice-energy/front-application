"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {Copy, Check, MessageCircle, Mail, Link, X, TextIcon as Telegram, MapPinHouseIcon} from 'lucide-react'
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { EnhancedInput } from "@/components/enhanced-input"
import { Specialist } from "@/types/specialist"
import { PracticePlaceholder } from "@/components/practice-placeholder"
import { MapPinIcon as MapPinHouse } from 'lucide-react'
import {SpecialistStatsCard} from "@/components/specialist/specilist-stats";
import {PentagramIcon, TelegramLogoIcon, WhatsappLogoIcon} from "@phosphor-icons/react";
import {formatCompactNumber, formatNumber} from "@/utils/format";
import {IconPractice} from "@/components/icons/icon-practice";
import {IconButton} from "@/components/icon-button";

interface ShareSpecialistModalProps {
  isOpen: boolean
  onClose: () => void
  specialist: Specialist
}

export function ShareSpecialistModal({ isOpen, onClose, specialist }: ShareSpecialistModalProps) {
  const [copied, setCopied] = useState(false)
  const [customText, setCustomText] = useState("")

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      // Добавляем класс к body при открытии модального окна
      document.body.classList.add('modal-open')
    } else {
      document.body.style.overflow = ''
      // Удаляем класс при закрытии
      document.body.classList.remove('modal-open')
    }
    return () => {
      document.body.style.overflow = ''
      document.body.classList.remove('modal-open')
    }
  }, [isOpen])

  const shareUrl = `${window.location.origin}/specialist/${specialist.id}`
  const defaultText = `Check out ${specialist.name}, ${specialist.title}`
  const shareText = customText || defaultText

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy link:", error)
    }
  }

  const handleShare = (platform: string) => {
    const encodedText = encodeURIComponent(shareText)
    const encodedUrl = encodeURIComponent(shareUrl)

    const shareUrls = {
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    }

    if (shareUrls[platform as keyof typeof shareUrls]) {
      window.open(shareUrls[platform], "_blank", "width=600,height=400")
    }
  }

  const shareOptions = [
    { id: "telegram", name: "Telegram", icon: TelegramLogoIcon, color: "bg-blue-500 hover:bg-blue-600 border-none" },
    { id: "whatsapp", name: "WhatsApp", icon: WhatsappLogoIcon, color: "bg-green-500 hover:bg-green-600 border-none" },
  ]

  if (!isOpen) return null

  return (
      <>
        {/* Затемнение для fixed элементов */}
        <div
            className="fixed inset-0 bg-black/10 backdrop-blur-sm"
            onClick={onClose}
        />

        {/* Модальное окно */}
        <div
            className="fixed inset-0 flex items-center justify-center p-4 modal-content pointer-events-none"
            style={{
              transform: 'translateZ(0)',
              isolation: 'isolate',
              zIndex: 1001
            }}
        >
          <div
              className="relative bg-white rounded-sm shadow-xl border w-[394px] pointer-events-auto modal-content z-[1002]"
              onClick={(e) => e.stopPropagation()}
              style={{
                transform: 'translateZ(0)',
                isolation: 'isolate',
                zIndex: 1002
              }}
          >
            {/* Modal content */}
            <div>
              {/* Specialist Preview */}
              <div className="items-start gap-3  blur-none rounded-sm flex flex-row border border-gray-200">
                {specialist.avatar ? (
                    <img
                        src={specialist.avatar || "/placeholder.svg"}
                        alt={specialist.name}
                        className="w-[74px] h-[84px] rounded-sm object-cover"
                    />
                ) : (
                    <PracticePlaceholder width={74} height={84} />
                )}

                <div>
                  <div className="font-medium text-gray-900  text-sm line-clamp-1">{specialist.name}</div>
                  <p className="text-sm text-gray-600 line-clamp-2">{specialist.title}</p>
                  <div className="flex items-center text-neutral-900/80 text-sm ">
                    <MapPinHouseIcon className="w-4 h-4 mr-1" />
                    <span>{specialist.location}</span>
                  </div>
                </div>

                <div className={cn(
                    "border border-gray-200 bg-white/80 rounded-sm shadow-md shadow-violet-100  p-0.5 w-[80px] mr-1 mt-0.5 gap-2",
                )}>
                  <div className="flex flex-row w-full bg-white items-center gap-1 text-violet-600 border border-gray-200 h-1/2 p-1 rounded-sm shadow-sm">
                    <PentagramIcon />
                    <div className="ml-auto">{formatCompactNumber(specialist.likes)}</div>
                  </div>
                  <div className="flex flex-row bg-white items-center gap-1 w-full border border-gray-200  h-1/2 p-1 mt-1 rounded-sm shadow-sm">
                    <IconPractice />
                    <div className="ml-auto">{formatCompactNumber(specialist.practices)}</div>
                  </div>
                </div>
              </div>

              {/* Share Options */}
              <div className="flex gap-6 items-end justify-end p-6">
                {shareOptions.map((option) => (
                    <motion.div
                        key={option.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleShare(option.id)}
                    >
                      <IconButton icon={option.icon} className={option.color} iconClassName="text-white"/>
                    </motion.div>
                ))}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCopyLink}
                >
                  {copied ? (
                      <IconButton icon={Check} className="hover:border-gray-200"/>
                  ) : (
                      <IconButton icon={Link} className="hover:border-gray-200"/>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        <div
            className="fixed inset-0 bg-black/10 backdrop-blur-sm z-[500]"
            onClick={onClose}
        />
      </>
  )
}