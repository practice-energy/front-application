"use client"

import React from "react"
import {Copy, Check, Link, MapPinIcon, MapPinHouseIcon, CopyCheck, Share} from 'lucide-react'
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Specialist } from "@/types/specialist"
import { PracticePlaceholder } from "@/components/practice-placeholder"
import { PentagramIcon, TelegramLogoIcon, WhatsappLogoIcon } from "@phosphor-icons/react"
import { formatCompactNumber } from "@/utils/format"
import { IconPractice } from "@/components/icons/icon-practice"
import { IconButton } from "@/components/icon-button"
import Image from "next/image";

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
      <div
          className="bg-white relative p-1 border w-[300px] shadow-custom hover:shadow-active overflow-hidden rounded-sm"
          style={{ height: 'calc(300px * 1.25 + 158px)' }}
      >
          <div className="h-9 w-full py-1.5 px-2 bg-white justify-between flex flex-row items-center">
              <IconPractice width={27} height={24}/>
              <div className="text-[24px] flex flex-row">
                  <div className="text-neutral-700">{specialist.rate5 || 0}/</div>
                  <div className="text-violet-600">5</div>
              </div>
          </div>
          <div className="bg-colors-custom-specialistCardBg bg-practice-pattern h-full flex flex-col">
              {/* Specialist Preview */}
              <div className="items-start gap-3 mt-3 bg-white rounded-sm border border-gray-200 p-1.5 flex-shrink-0 flex flex-col h-[92px]">
                  <div className="flex flex-row gap-3">
                      {specialist.avatar ? (
                          <img
                              src={specialist.avatar || "/placeholder.svg"}
                              alt={specialist.name}
                              className="w-[64px] h-[78px] rounded-sm object-cover"
                          />
                      ) : (
                          <PracticePlaceholder width={64} height={78} className="h-full object-cover overflow-hidden"/>
                      )}

                      <div className="flex-1 text-sm">
                          <div className="font-medium text-neutral-700 line-clamp-2 h-[38px] items-center">{specialist.name}</div>
                          <p className="text-neutral-700 line-clamp-2">{specialist.title}</p>
                      </div>
                  </div>
              </div>

              {specialist.education.length > 0 ? (
                  <div className="flex flex-row p-1 bg-white rounded-sm shadow-custom mt-1 py-1.5 px-2">
                      <div className="flex-1 min-w-0 pr-3">
                          <div className="font-medium text-neutral-700 line-clamp-1 leading-relaxed">{specialist.education[0].title}</div>
                          <div className="text-sm text-neutral-700 mt-1 line-clamp-2 leading-relaxed">{specialist.education[0].description}</div>
                      </div>
                      <div className="aspect-square flex-shrink-0 bg-colors-neutral-150 rounded-sm border shadow-custom">
                          {specialist.education[0].certificate ? (
                              <Image
                                  src={specialist.education[0].certificate || "/placeholder.svg"}
                                  alt={`Certificate ${specialist.education[0].title}`}
                                  width={64}
                                  height={64}
                                  className="w-full h-full object-cover rounded-sm"
                              />
                          ) : (
                              <div className="w-full h-full flex items-center justify-center bg-colors-neutral-150 rounded-sm">
                                  <PracticePlaceholder width={64} height={64} />
                              </div>
                          )}
                      </div>
                  </div>
              ) : specialist.certificates.length > 0 && (
                  <div className="flex flex-row bg-white rounded-sm shadow-custom mt-1 py-1.5 px-2">
                      <div className="flex-1 min-w-0 pr-3">
                          <div className="font-medium text-neutral-700 line-clamp-1 leading-relaxed">{specialist.certificates[0].title}</div>
                          <div className="text-sm text-neutral-700 mt-1 line-clamp-2 leading-relaxed">{specialist.certificates[0].description}</div>
                      </div>
                      <div className="aspect-square flex-shrink-0 bg-colors-neutral-150 rounded-sm border shadow-custom">
                          {specialist.certificates[0].certificate ? (
                              <Image
                                  src={specialist.certificates[0].certificate || "/placeholder.svg"}
                                  alt={`Certificate ${specialist.certificates[0].title}`}
                                  width={64}
                                  height={64}
                                  className="w-full h-full object-cover rounded-sm"
                              />
                          ) : (
                              <div className="w-full h-full flex items-center justify-center bg-colors-neutral-150 rounded-sm">
                                  <PracticePlaceholder width={64} height={64} />
                              </div>
                          )}
                      </div>
                  </div>
              )}

          </div>

          <div className="w-full absolute bottom-0 py-1.5 px-1 bg-white justify-between flex flex-row object-cover flex-1">
              <div className="flex flex-row justify-between flex-1 ">
                  <div className="flex flex-col gap-2.5">
                      <Share size={24} className="text-neutral-700 pl-1"/>
                      {/* Spacer to push share options to center */}
                      <div className=" flex items-center justify-center px-1">
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

                  <div className="flex flex-col gap-2 px-2 font-bold">
                      {/* Блок лайков */}
                      <div className="flex items-center gap-1 px-1 bg-colors-custom-specialistCardStatItemBgFlip flex-1 w-full rounded-sm text-violet-600 justify-between shadow-custom-xs">
                          <PentagramIcon size={24} />
                          <p>{specialist.likes}</p>
                      </div>

                      {/* Блок практик */}
                      <div className="flex items-center pl-[5px] pr-1 bg-colors-custom-specialistCardStatItemBgFlip flex-1 w-full rounded-sm gap-1 justify-between shadow-custom-xs">
                          <IconPractice
                              width={22}
                              height={20}
                          />
                          {specialist.practices}
                      </div>
                  </div>

              </div>
          </div>
      </div>
    )
}
