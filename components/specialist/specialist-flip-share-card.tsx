"use client"

import React from "react"
import { Copy, Check, Link, MapPinIcon } from 'lucide-react'
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Specialist } from "@/types/specialist"
import { PracticePlaceholder } from "@/components/practice-placeholder"
import { PentagramIcon, TelegramLogoIcon, WhatsappLogoIcon } from "@phosphor-icons/react"
import { formatCompactNumber } from "@/utils/format"
import { IconPractice } from "@/components/icons/icon-practice"
import { IconButton } from "@/components/icon-button"

interface SpecialistFlipShareCardProps {
  specialist: Specialist
  copied: boolean
  onCopyLink: () => void
  onShare: (platform: string) => void
}

export function SpecialistFlipShareCard({ specialist, copied, onCopyLink, onShare }: SpecialistFlipShareCardProps) {
  const shareOptions = [
    { id: "telegram", name: "Telegram", icon: TelegramLogoIcon, color: "bg-blue-500 hover:bg-blue-600 border-none" },
    { id: "whatsapp", name: "WhatsApp", icon: WhatsappLogoIcon, color: "bg-green-500 hover:bg-green-600 border-none" },
  ]

  return (
    <div className="bg-practice-pattern rounded-sm shadow-xl border w-[300px] flex flex-col justify-between" style={{ height: 'calc(300px * 1.25 + 158px)' }}>
      {/* Specialist Preview */}
      <div className="items-start gap-3 bg-white rounded-sm flex flex-row border border-gray-200 p-3 flex-shrink-0">
        {specialist.avatar ? (
          <img
            src={specialist.avatar || "/placeholder.svg"}
            alt={specialist.name}
            className="w-[60px] h-[68px] rounded-sm object-cover"
          />
        ) : (
          <PracticePlaceholder width={60} height={68} />
        )}

        <div className="flex-1">
          <div className="font-medium text-gray-900 text-sm line-clamp-1">{specialist.name}</div>
          <p className="text-sm text-gray-600 line-clamp-2">{specialist.title}</p>
          <div className="flex items-center text-neutral-900/80 text-sm">
            <MapPinIcon className="w-4 h-4 mr-1" />
            <span>{specialist.location}</span>
          </div>
        </div>

        <div className={cn(
          "border border-gray-200 bg-white/80 rounded-sm shadow-md shadow-violet-100 p-0.5 w-[65px] gap-2",
        )}>
          <div className="flex flex-row w-full bg-white items-center gap-1 text-violet-600 border border-gray-200 h-1/2 p-1 rounded-sm shadow-sm">
            <PentagramIcon size={14} />
            <div className="ml-auto text-xs">{formatCompactNumber(specialist.likes)}</div>
          </div>
          <div className="flex flex-row bg-white items-center gap-1 w-full border border-gray-200 h-1/2 p-1 mt-1 rounded-sm shadow-sm">
            <IconPractice width={14} height={14} />
            <div className="ml-auto text-xs">{formatCompactNumber(specialist.practices)}</div>
          </div>
        </div>
      </div>

      {/* Spacer to push share options to center */}
      <div className="flex-1 flex items-center justify-center">
        {/* Share Options */}
        <div className="flex gap-4 items-center justify-center">
          {shareOptions.map((option) => (
            <motion.div
              key={option.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onShare(option.id)}
            >
              <IconButton icon={option.icon} className={option.color} iconClassName="text-white" />
            </motion.div>
          ))}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCopyLink}
          >
            {copied ? (
              <IconButton icon={Check} className="hover:border-gray-200" />
            ) : (
              <IconButton icon={Link} className="hover:border-gray-200" />
            )}
          </motion.div>
        </div>
      </div>

      {/* Bottom spacer to match original card height */}
      <div className="flex-shrink-0 h-[30px]"></div>
    </div>
  )
}
