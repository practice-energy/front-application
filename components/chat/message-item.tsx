"use client"

import React, { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Copy, Share, Paperclip } from "lucide-react"
import { ArrowPathIcon } from "@heroicons/react/24/outline"
import { InstagramSpecialistCard } from "@/components/instagram-specialist-card"
import { InstagramServiceCard } from "@/components/instagram-service-card"
import { cn } from "@/lib/utils"
import type { Message } from "@/types/chats"
import Image from "next/image"
import { getSpecialistById } from "@/services/mock-specialists"
import { IconAlura } from "@/components/icons/icon-alura"
import { ActionButtonsRow } from "@/components/action-button"
import type { Service } from "@/types/service"
import { Checkbox } from "@/components/ui/checkbox"

interface MessageItemProps {
  specialistId: string
  message: Message
  onSpecialistClick: (id: string) => void
  onServiceClick: (id: string) => void
  onShare: (message: Message) => void
  onRegenerate: (message: Message) => void
  isAI: boolean
  footerContent?: string
  aiMessageType?: "info" | "warning" | "service"
}

export const MessageItem = React.memo(
  ({
    specialistId,
    message,
    onSpecialistClick,
    onServiceClick,
    onShare,
    onRegenerate,
    isAI,
    footerContent,
    aiMessageType,
  }: MessageItemProps) => {
    const router = useRouter()
    const isUser = message.type === "user"
    const isAssistant = message.type === "assistant"
    const isSpecialist = message.type === "specialist"
    const [policyAccepted, setPolicyAccepted] = useState(false)

    const handleCopyMessage = useCallback(() => {
      const textToCopy = message.content || "Message with cards"
      navigator.clipboard.writeText(textToCopy).then(() => {
        console.log("Message copied to clipboard")
      })
    }, [message.content])

    const handleViewSpecialistProfile = useCallback(() => {
      if (isAssistant) {
        return
      }
      onSpecialistClick(specialistId)
    }, [isAssistant, router, specialistId, onSpecialistClick])

    const specialist = getSpecialistById(specialistId)

    return (
      <div
        id={`message-${message.id}`}
        className={`flex ${isUser ? "justify-end" : "justify-start"} transition-all duration-500`}
      >
        <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-4xl w-full`}>
          <div className="flex mb-1">
            {!isUser && (
              <div className="flex ml-1">
                {" "}
                {/* И здесь тоже убираем items-end */}
                <button
                  className="transition-colors border-none hover:bg-transparent active:bg-none relative rounded-sm self-end"
                  onClick={handleViewSpecialistProfile}
                  aria-label={isAssistant ? "" : `View ${message.type} profile`}
                  title={isAssistant ? "Alura" : "View profile"}
                >
                  {isAssistant ? (
                    <IconAlura width={36} height={36} className="rounded-sm active:bg-none" />
                  ) : (
                    <Image
                      src={isSpecialist && specialist ? specialist.avatar : "/placeholder.jpg"}
                      className={cn("rounded-sm hover:bg-violet-50")}
                      alt={""}
                      width={36}
                      height={36}
                    />
                  )}
                </button>
                <div className="flex flex-col ml-3 justify-end">
                  {" "}
                  {/* Добавляем justify-end */}
                  <div className="text-black font-sans">{isAssistant ? "Alura" : specialist?.name}</div>
                  <div className="text-accent text-gray-500">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 w-full">
            {message.content && (
              <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    `rounded-sm py-3 ${
                      isUser
                        ? "bg-violet-50 shadow-md px-3 py-3 gap-3 "
                        : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-Date shadow-md shadow-violet-50 px-3 gap-3"
                    }`,
                    isAssistant && "border-none shadow-none px-0 ",
                  )}
                  style={{ wordBreak: "break-word" }}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
              </div>
            )}

            {message.files && message.files.length > 0 && (
              <div
                className={cn(
                  "space-y-1 mt-2",
                  isUser ? "flex flex-col items-end" : "inline-flex flex-col items-start",
                )}
              >
                {message.files.map((file, index) => (
                  <a
                    key={index}
                    href={URL.createObjectURL(file)}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={file.name}
                    className={cn(
                      "inline-flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors rounded-sm",
                      isUser ? "justify-end" : "justify-start",
                    )}
                  >
                    <Paperclip className="w-4 h-4 text-gray-600 dark:text-gray-300 flex-shrink-0" />
                    <span className="text-sm text-gray-800 dark:text-gray-200 truncate max-w-xs">{file.name}</span>
                  </a>
                ))}
              </div>
            )}

            {message.specialists && message.specialists.length > 0 && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {message.specialists.slice(0, 2).map((specialist) => (
                    <InstagramSpecialistCard
                      key={specialist.id}
                      specialist={specialist}
                      onClick={() => onSpecialistClick(specialist.id)}
                      showActionButtons={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {message.services && message.services.length > 0 && (
              <div className="mt-3 space-y-3 flex justify-end justify-items-end">
                {" "}
                {/* Основной контейнер с выравниванием вправо */}
                <div className="grid grid-cols-1 gap-6">
                  {" "}
                  {/* Сетка карточек */}
                  {message.services.map((service: Service) => (
                    <InstagramServiceCard
                      key={service.id}
                      service={service}
                      onClick={() => onServiceClick(service.id)}
                      showActionButtons={false}
                      specialistId={service.specialist.id}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {footerContent && isAssistant && !isUser && (
            <div className="mt-3 text-gray-800 dark:text-gray-100">
              <p className="text-sm leading-relaxed mt-1.5">{footerContent}</p>
            </div>
          )}

          {isAssistant && !isUser && (
            <div
              className={cn(
                "border-t border-gray-200 dark:border-gray-700 mt-2 w-full",
                aiMessageType === "service" && "border-violet-600",
                aiMessageType === "warning" && "border-pink-500",
                message.aiMessageType === "accept-policy" && "border-violet-600",
              )}
            />
          )}

          {/* Policy acceptance section */}
          {message.aiMessageType === "accept-policy" && (
            <div className="mt-4 w-full">
              <div className="bg-gray-50 p-4 rounded-sm border">
                <h4 className="font-medium text-sm mb-2">Политика обработки данных</h4>
                <p className="text-xs text-gray-600 mb-3">
                  Для становления мастером необходимо согласие на обработку персональных данных в соответствии с нашей
                  политикой конфиденциальности.
                </p>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="policy-accept"
                    checked={policyAccepted}
                    onCheckedChange={(checked) => setPolicyAccepted(checked as boolean)}
                  />
                  <label htmlFor="policy-accept" className="text-xs text-gray-700 cursor-pointer">
                    Я принимаю политику обработки данных
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-2 w-full">
            {aiMessageType === "service" ? (
              // Service-specific buttons
              <div className="flex flex-col w-full pt-2">
                <ActionButtonsRow onRegenerate={() => {}} onConfirm={() => {}} onBurn={() => {}} />
              </div>
            ) : (
              // Regular action buttons
              <div className={cn("flex gap-2 text-xs opacity-60 ml-auto", isUser ? "justify-end" : "justify-start")}>
                {isAI && isAssistant && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onRegenerate(message)}
                    className="rounded-sm hover:bg-violet-50  dark:hover:bg-gray-700 transition-colors duration-200 min-h-[32px] min-w-[32px] flex items-center justify-center"
                  >
                    <ArrowPathIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onShare(message)}
                  className="p-1.5 rounded-sm hover:bg-violet-50  dark:hover:bg-gray-700 transition-colors duration-200 min-h-[32px] min-w-[32px] flex items-center justify-center"
                  title="Share message"
                >
                  <Share className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopyMessage}
                  className="rounded-sm hover:bg-violet-50 dark:hover:bg-gray-700 transition-colors duration-200 min-h-[32px] min-w-[32px] flex items-center justify-center"
                  title="Copy message"
                >
                  <Copy className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  },
)

MessageItem.displayName = "MessageItem"
