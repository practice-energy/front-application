"use client"

import React, { useCallback, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Copy, Share, Paperclip } from "lucide-react"
import { ArrowPathIcon } from "@heroicons/react/24/outline"
import { InstagramSpecialistCard } from "@/components/instagram-specialist-card"
import { InstagramServiceCard } from "@/components/instagram-service-card"
import { cn } from "@/lib/utils"
import type { AiMessageType, Message, Tag } from "@/types/chats"
import Image from "next/image"
import { getSpecialistById } from "@/services/mock-specialists"
import { IconAlura } from "@/components/icons/icon-alura"
import { ActionButtonsRow } from "@/components/action-button"
import type { Service } from "@/types/service"
import { Checkbox } from "@/components/ui/checkbox"
import { useBecomeSpecialist } from "@/stores/chat-store"
import { getVersionQuestions, createVersionMessage } from "@/components/become-specialist/messages"

interface MessageItemProps {
  specialistId: string
  message: Message
  onSpecialistClick: (id: string) => void
  onServiceClick: (id: string) => void
  onShare: (message: Message) => void
  onRegenerate: (message: Message) => void
  isAI: boolean
  aiMessageType?: AiMessageType
  onTagSelection?: (tags: string[]) => void
  onPolicyAcceptance?: (accepted: boolean) => void
  onPersonalityAnswer?: (questionId: string, answer: string) => void
  onAddMessage?: (message: any) => void
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
    aiMessageType,
    onTagSelection,
    onPolicyAcceptance,
    onPersonalityAnswer,
    onAddMessage,
  }: MessageItemProps) => {
    const router = useRouter()
    const isUser = message.type === "user"
    const isAssistant = message.type === "assistant" || message.type === "become-specialist-drops"
    const isSpecialist = message.type === "specialist"

    const {
      state: becomeSpecialistState,
      setSelectedTags,
      setPolicyAccepted,
      setPersonalityAnswer,
      setVersionAnswer,
      setStep,
      submitPersonalityTest,
    } = useBecomeSpecialist()

    const [expandedTags, setExpandedTags] = useState<string[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Sync local state with store for policy acceptance
    useEffect(() => {
      if (message.aiMessageType === "become-specialist-drops" && onPolicyAcceptance) {
        onPolicyAcceptance(becomeSpecialistState.policyAccepted)
      }
    }, [becomeSpecialistState.policyAccepted, message.aiMessageType, onPolicyAcceptance])

    // Sync local state with store for tag selection
    useEffect(() => {
      if (message.aiMessageType === "become-specialist-drops" && onTagSelection) {
        onTagSelection(becomeSpecialistState.selectedTags)
      }
    }, [becomeSpecialistState.selectedTags, message.aiMessageType, onTagSelection])

    // Check if all personality questions are answered and submit test
    useEffect(() => {
      const personalityQuestions = 4 // Number of personality questions
      const answeredQuestions = Object.keys(becomeSpecialistState.personalityAnswers).length

      if (becomeSpecialistState.step === 2 && answeredQuestions === personalityQuestions && !isSubmitting) {
        handleSubmitPersonalityTest()
      }
    }, [becomeSpecialistState.personalityAnswers, becomeSpecialistState.step, isSubmitting])

    // Check if all version questions are answered and move to step 4
    useEffect(() => {
      if (becomeSpecialistState.step === 3 && becomeSpecialistState.v) {
        const versionQuestions = getVersionQuestions(becomeSpecialistState.v)
        const answeredVersionQuestions = Object.keys(becomeSpecialistState.versionAnswers).length

        if (answeredVersionQuestions === versionQuestions.length) {
          setStep(4)
        }
      }
    }, [becomeSpecialistState.versionAnswers, becomeSpecialistState.step, becomeSpecialistState.v, setStep])

    const handleSubmitPersonalityTest = async () => {
      setIsSubmitting(true)
      try {
        const result = await submitPersonalityTest()
        if (result) {
          setStep(3)

          // Add version-specific questions as messages
          if (onAddMessage) {
            const versionQuestions = getVersionQuestions(result.v)
            versionQuestions.forEach((question, index) => {
              setTimeout(() => {
                onAddMessage(createVersionMessage(question, index))
              }, index * 500) // Stagger message appearance
            })
          }
        }
      } catch (error) {
        console.error("Failed to submit personality test:", error)
      } finally {
        setIsSubmitting(false)
      }
    }

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

    // Handle specialty tags selection (for become-specialist-drops) - Step 1 only
    const handleSpecialtyTagClick = useCallback(
      (tagName: string, hasSubtags: boolean) => {
        // Only allow tag changes on step 1
        if (becomeSpecialistState.step !== 1) return

        if (hasSubtags) {
          // If tag has subtags, add only the main tag to selected tags and expand it
          const newSelectedTags = becomeSpecialistState.selectedTags.includes(tagName)
            ? becomeSpecialistState.selectedTags.filter((t) => t !== tagName)
            : [...becomeSpecialistState.selectedTags, tagName]

          setSelectedTags(newSelectedTags)

          // Toggle expansion
          setExpandedTags((prev) => (prev.includes(tagName) ? prev.filter((t) => t !== tagName) : [...prev, tagName]))
        } else {
          // Regular tag selection (no subtags)
          const newSelectedTags = becomeSpecialistState.selectedTags.includes(tagName)
            ? becomeSpecialistState.selectedTags.filter((t) => t !== tagName)
            : [...becomeSpecialistState.selectedTags, tagName]

          setSelectedTags(newSelectedTags)
        }
      },
      [becomeSpecialistState.selectedTags, becomeSpecialistState.step, setSelectedTags],
    )

    // Handle personality test answers (for profile-test) - Step 2 only
    const handlePersonalityAnswer = useCallback(
      (answer: string) => {
        // Only allow answer changes before step 3
        if (becomeSpecialistState.step >= 3) return

        setPersonalityAnswer(message.content, answer)
        if (onPersonalityAnswer) {
          onPersonalityAnswer(message.content, answer)
        }
      },
      [message, becomeSpecialistState.step, setPersonalityAnswer, onPersonalityAnswer],
    )

    // Handle version-specific test answers - Step 3 only
    const handleVersionAnswer = useCallback(
      (answer: 1 | 2 | 3 | 4 | 5) => {
        // Only allow answer changes on step 3
        if (becomeSpecialistState.step !== 3) return

        setVersionAnswer(message.content, answer)
      },
      [message, becomeSpecialistState.step, setVersionAnswer],
    )

    const handlePolicyChange = useCallback(
      (checked: boolean) => {
        // Only allow policy changes on step 1
        if (becomeSpecialistState.step !== 1) return
        setPolicyAccepted(checked)
      },
      [becomeSpecialistState.step, setPolicyAccepted],
    )

    const specialist = getSpecialistById(specialistId)

    // Render specialty tags (horizontal layout with expansion) - Step 1
    const renderSpecialtyTags = (tags: Tag[], depth = 0) => {
      const isDisabled = becomeSpecialistState.step !== 1

      return (
        <div className={`flex ml-auto ${depth > 0 ? "flex-col gap-2 " : "flex-wrap gap-4"}`}>
          {tags.map((tag, index) => (
            <div key={`${depth}-${index}`} className="flex flex-col ml-auto">
              <button
                onClick={() => handleSpecialtyTagClick(tag.name, !!tag.subtags?.length)}
                disabled={isDisabled}
                className={cn(
                  "items-center justify-center rounded-sm text-sm font-medium transition-colors",
                  "w-[104px] h-[36px] whitespace-nowrap text-neutral-700",
                  isDisabled
                    ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                    : becomeSpecialistState.selectedTags.includes(tag.name)
                      ? "bg-violet-50"
                      : "bg-gray-100 md:hover:bg-violet-50",
                )}
              >
                {tag.name}
              </button>

              {/* Recursive call for subtags (vertical layout) */}
              {tag.subtags && expandedTags.includes(tag.name) && (
                <div className="flex flex-col gap-2 mt-2">{renderSpecialtyTags(tag.subtags, depth + 1)}</div>
              )}
            </div>
          ))}
        </div>
      )
    }

    // Render personality test options (vertical layout) - Step 2
    const renderPersonalityOptions = (tags: Tag[]) => {
      const currentAnswer = message.content ? becomeSpecialistState.personalityAnswers[message.content] : null
      const isDisabled = becomeSpecialistState.step >= 3

      return (
        <div className="flex flex-col gap-3 ml-auto max-w-xs">
          {tags.map((tag, index) => {
            const isSelected = currentAnswer === tag.name
            const isButtonDisabled = isDisabled || (currentAnswer !== null && !isSelected)

            return (
              <button
                key={index}
                onClick={() => handlePersonalityAnswer(tag.name)}
                disabled={isButtonDisabled}
                className={cn(
                  "items-center justify-center rounded-sm text-sm font-medium transition-colors",
                  "w-full h-[36px] px-4 text-neutral-700",
                  isSelected
                    ? "bg-violet-100 "
                    : isButtonDisabled
                      ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                      : "bg-gray-100 md:hover:bg-violet-50",
                )}
              >
                {tag.name}
              </button>
            )
          })}
        </div>
      )
    }

    // Render version-specific test options (1-5 scale) - Step 3
    const renderVersionOptions = () => {
      const currentAnswer = message.content ? becomeSpecialistState.versionAnswers[message.content] : null
      const isDisabled = becomeSpecialistState.step !== 3

      return (
        <div className="flex gap-2 ml-auto">
          {[1, 2, 3, 4, 5].map((value) => {
            const isSelected = currentAnswer === value
            const isButtonDisabled = isDisabled || (currentAnswer !== null && !isSelected)

            return (
              <button
                key={value}
                onClick={() => handleVersionAnswer(value as 1 | 2 | 3 | 4 | 5)}
                disabled={isButtonDisabled}
                className={cn(
                  "items-center justify-center rounded-sm text-sm font-medium transition-colors",
                  "w-[36px] h-[36px] text-neutral-700",
                  isSelected
                    ? "bg-violet-100"
                    : isButtonDisabled
                      ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                      : "bg-gray-100 md:hover:bg-violet-50",
                )}
              >
                {value}
              </button>
            )
          })}
        </div>
      )
    }

    return (
      <div
        id={`message-${message.id}`}
        className={`flex ${isUser ? "justify-end" : "justify-start"} transition-all duration-500`}
      >
        <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-4xl w-full`}>
          <div className="flex mb-1">
            {!isUser && (
              <div className="flex ml-1">
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

            {/* Specialty tags for become-specialist-drops */}
            {message.aiMessageType === "become-specialist-drops" && message.tags && message.tags.length > 0 && (
              <div className="mt-4 ml-auto">{renderSpecialtyTags(message.tags)}</div>
            )}

            {/* Personality test options for profile-test */}
            {message.aiMessageType === "profile-test" && message.tags && message.tags.length > 0 && (
              <div className="mt-4 ml-auto">{renderPersonalityOptions(message.tags)}</div>
            )}

            {/* Version-specific test options */}
            {message.aiMessageType === "version-test" && <div className="mt-4 ml-auto">{renderVersionOptions()}</div>}

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
                <div className="grid grid-cols-1 gap-6">
                  {message.services.map((service: Service) => (
                    <InstagramServiceCard
                      key={service.id}
                      service={service}
                      onClick={() => onServiceClick(service.id)}
                      specialistId={service.specialist.id}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {message.footerContent && (isAssistant || isAI) && !isUser && (
            <div className="mt-3 text-gray-800 dark:text-gray-100">
              <p className="text-sm leading-relaxed mt-1.5">{message.footerContent}</p>
            </div>
          )}

          {isAssistant && !isUser && (
            <div
              className={cn(
                "border-t border-gray-200 dark:border-gray-700 mt-2 w-full",
                aiMessageType === "service" && "border-violet-600",
                aiMessageType === "warning" && "border-pink-500",
                message.aiMessageType === "accept-policy" && "border-violet-600",
                message.aiMessageType === "become-specialist-drops" && "border-violet-600",
                message.aiMessageType === "profile-test" && "border-violet-600",
                message.aiMessageType === "version-test" && "border-violet-600",
              )}
            />
          )}

          {/* Policy acceptance section */}
          {message.aiMessageType === "become-specialist-drops" && (
            <div className="mt-4 flex flex-row gap-3 ml-auto items-end ">
              <div className="font-medium text-sm mb-2">Политика обработки и хранения данных</div>
              <Checkbox
                id="policy-accept"
                checked={becomeSpecialistState.policyAccepted}
                onCheckedChange={handlePolicyChange}
                disabled={becomeSpecialistState.step > 1}
                className={cn(
                  "w-[36px] h-[36px] rounded-sm border-violet-600 text-violet-600 active:text-white active:bg-violet-600 focus:ring-violet-600",
                  becomeSpecialistState.step > 1 && "opacity-50 cursor-not-allowed",
                )}
              />
            </div>
          )}

          {/* Loading indicator for personality test submission */}
          {isSubmitting && becomeSpecialistState.step === 2 && (
            <div className="mt-4 flex items-center gap-2 ml-auto">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-violet-600"></div>
              <span className="text-sm text-gray-600">Обрабатываем результаты теста...</span>
            </div>
          )}

          <div className="flex justify-between pt-2 w-full">
            {message.aiMessageType === "service" && (
              // Service-specific buttons
              <div className="flex flex-col w-full pt-2">
                <ActionButtonsRow onRegenerate={() => {}} onConfirm={() => {}} onBurn={() => {}} />
              </div>
            )}

            {aiMessageType === "info" && (
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
