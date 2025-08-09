"use client"

import React from "react"
import {Copy, Check, Link, MapPinIcon, MapPinHouseIcon, CopyCheck} from 'lucide-react'
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
    { id: "telegram", name: "Telegram", icon: TelegramLogoIcon, color: "flex border border-neutral-100  hover:border  hover:border-gray-200" },
    { id: "whatsapp", name: "WhatsApp", icon: WhatsappLogoIcon, color: "flex border border-neutral-100  hover:border hover:border-gray-200" },
  ]

  return (
    <div className="bg-practice-pattern rounded-sm shadow-xl border w-[300px] flex flex-col justify-between px-1" style={{ height: 'calc(300px * 1.25 + 158px)' }}>
      {/* Specialist Preview */}
      <div className="items-start gap-3 mt-3 bg-white rounded-sm border border-gray-200 p-1.5 flex-shrink-0 flex flex-col">
          <div className="flex flex-row gap-3">
              {specialist.avatar ? (
                  <img
                      src={specialist.avatar || "/placeholder.svg"}
                      alt={specialist.name}
                      className="w-[60px] h-[68px] rounded-sm object-cover"
                  />
              ) : (
                  <PracticePlaceholder width={52} height={60} />
              )}

              <div className="flex-1 gap-1.5">
                  <div className="font-medium text-neutral-900 text-sm line-clamp-1">{specialist.name}</div>
                  <p className="text-xs text-neutral-700/80 line-clamp-2 mt-1.5">{specialist.title}</p>
              </div>
          </div>

          <div className="flex items-center text-neutral-700/80 text-sm">
              <MapPinHouseIcon className="w-4 h-4 mr-1" />
              <span>{specialist.location}</span>
          </div>
      </div>

        <div className="items-start gap-3 mb-3 bg-white rounded-sm border  p-2 flex-shrink-0 flex flex-row ">
            {/* Spacer to push share options to center */}
            <div className="flex-1 flex items-center justify-center">
                <div className="flex-col flex gap-2.5">
                    <div className="flex flex-row items-center gap-3 w-[64px] h-[28px] px-1 shadow-sm border border-neutral-100 rounded-sm">
                        <PentagramIcon size={20} className="w-5 h-5 mr-1 text-violet-600" />
                        <div className="text-violet-600 font-semibold text-xs">{formatCompactNumber(specialist.likes)}</div>
                    </div>
                    <div className="flex flex-row items-center gap-3 shadow-sm border border-neutral-100 rounded-sm">
                        <div className="flex flex-row items-center gap-3 w-[64px] h-[28px] px-1">
                            <IconPractice className="w-5 h-5 mr-1 text-neutral-900" width={18} height={20} />
                            <div className="text-neutral-900 font-semibold text-xs">{formatCompactNumber(specialist.likes)}</div>
                        </div>
                    </div>
                </div>

                {/* Share Options */}
                <div className="flex gap-4 items-center justify-center ml-auto">
                    {shareOptions.map((option) => (
                        <motion.div
                            key={option.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onShare(option.id)}
                        >
                            <IconButton icon={option.icon} className={option.color} iconClassName="text-neutral-900" />
                        </motion.div>
                    ))}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onCopyLink}
                    >
                        {copied ? (
                            <IconButton icon={CopyCheck} className="bg-violet-600" iconClassName="text-white flex"/>
                        ) : (
                            <IconButton icon={Link} className="hover:border-gray-200 flex" />
                        )}
                    </motion.div>
                </div>
            </div>
        </div>

    </div>
  )
}
