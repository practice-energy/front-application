"use client"

import React from "react"
import {Copy, Check, Link, MapPinIcon, CopyCheck} from 'lucide-react'
import { motion } from "framer-motion"
import { cn } from "@/src/lib/utils"
import { Specialist } from "@/src/types/specialist"
import { PracticePlaceholder } from "@/src/components/practice-placeholder"
import { PentagramIcon, TelegramLogoIcon, WhatsappLogoIcon } from "@phosphor-icons/react"
import { formatCompactNumber } from "@/src/utils/format"
import { IconPractice } from "@/src/components/icons/icon-practice"
import { IconButton } from "@/src/components/icon-button"

interface SpecialistShareCardProps {
  specialist: Specialist
  copied: boolean
  onCopyLink: () => void
  onShare: (platform: string) => void
  isMobile: boolean
}

export function SpecialistShareCard({ specialist, copied, onCopyLink, onShare, isMobile }: SpecialistShareCardProps) {
  const shareOptions = [
    { id: "telegram", name: "Telegram", icon: TelegramLogoIcon, color: "bg-blue-500 hover:bg-blue-600 border-none flex" },
    { id: "whatsapp", name: "WhatsApp", icon: WhatsappLogoIcon, color: "bg-green-500 hover:bg-green-600 border-none flex" },
  ]

  return (
    <div className={cn("bg-white rounded-sm shadow-xl flex flex-col z-[1000]",
      isMobile ? "w-full" :"w-[390px]")}>
      {/* Specialist Preview */}
      <div className="items-center p-1.5 gap-3 bg-white rounded-sm flex flex-row border border-gray-200">
        {specialist.avatar ? (
          <img
            src={specialist.avatar || "/placeholder.svg"}
            alt={specialist.name}
            className="w-[76px] h-[88px] rounded-sm object-cover"
          />
        ) : (
          <PracticePlaceholder width={80} height={90} />
        )}

        <div className="flex-1">
          <div className="font-medium text-gray-900 text-base line-clamp-1">{specialist.name}</div>
          <p className="text-base text-gray-600 line-clamp-2">{specialist.title}</p>
          <div className="flex items-center text-neutral-700/80 text-sm">
            <MapPinIcon className="w-4 h-4 mr-1" />
            <span>{specialist.location}</span>
          </div>
        </div>

        <div className={cn(
          "border border-gray-200 bg-white/80 rounded-sm shadow-md shadow-violet-100 p-1  w-[80px] gap-2",
        )}>
          <div className="flex flex-row w-full bg-white items-center gap-1 text-colors-custom-accent border border-gray-200 h-1/2 p-1.5 rounded-sm shadow-sm">
            <PentagramIcon size={20} />
            <div className="ml-auto text-sm">{formatCompactNumber(specialist.likes)}</div>
          </div>
          <div className="flex flex-row bg-white items-center gap-1 w-full border border-gray-200 h-1/2 p-1.5 mt-1 rounded-sm shadow-sm">
            <IconPractice width={20} height={18} />
            <div className="ml-auto text-sm">{formatCompactNumber(specialist.practices)}</div>
          </div>
        </div>
      </div>

      {/* Share Options */}
      <div className="flex gap-6 items-center justify-end p-6 z-[10000]">
        {shareOptions.map((option) => (
          <motion.div
            key={option.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onShare(option.id)}
            className=" w-12 h-12 "
          >
            <IconButton icon={option.icon} className={option.color} iconClassName="text-white" />
          </motion.div>
        ))}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCopyLink}
          className=" w-12 h-12"
        >
          {copied ? (
            <IconButton icon={CopyCheck} className="bg-colors-custom-accent flex" iconClassName="text-white" />
          ) : (
            <IconButton icon={Link} className="hover:border-gray-200 flex " />
          )}
        </motion.div>
      </div>
    </div>
  )
}
