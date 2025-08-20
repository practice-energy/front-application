"use client"

import React, { useCallback, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {Copy, Share, Paperclip, Edit} from "lucide-react"
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
import { getVersionQuestions } from "@/components/become-specialist/messages"
import {MobileBookingSection} from "@/components/service/mobile-booking-section";
import {BookingSection} from "@/components/service/booking-section";
import {useIsMobile} from "@/hooks/use-mobile";
import {mockBookingSlots} from "@/services/booking-slot-data";
import {CalendarWidget} from "@/components/adept-calendar/calendar-widget";

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
  onVersionAnswer: (questionId: string, answer: number) => void
  isMobile: boolean
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
    onVersionAnswer,
    isMobile,
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
      setStep,
      submitPersonalityTest,
      submitVersionAnswers,
    } = useBecomeSpecialist()

    const [expandedTags, setExpandedTags] = useState<string[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())

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

    // Check if all version questions are answered and submit version answers
    useEffect(() => {
      if (becomeSpecialistState.step === 3 && becomeSpecialistState.v) {
        const versionQuestions = getVersionQuestions(becomeSpecialistState.v)
        const answeredVersionQuestions = Object.keys(becomeSpecialistState.versionAnswers).length

        if (answeredVersionQuestions === versionQuestions.length && !isSubmitting) {
          handleSubmitVersionAnswers()
        }
      }
    }, [becomeSpecialistState.versionAnswers, becomeSpecialistState.step, becomeSpecialistState.v, isSubmitting])

    const handleSubmitPersonalityTest = async () => {
      setIsSubmitting(true)
      try {
        await submitPersonalityTest()
        setStep(3)
      } catch (error) {
        console.error("Failed to submit personality test:", error)
      } finally {
        setIsSubmitting(false)
      }
    }

    const handleSubmitVersionAnswers = async () => {
      setIsSubmitting(true)
      try {
        const result = await submitVersionAnswers()
        if (result?.success) {
          console.log("Version answers submitted successfully:", result)
          // Step 4 is automatically set in the store
        }
      } catch (error) {
        console.error("Failed to submit version answers:", error)
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
        if (becomeSpecialistState.step != 2) return

        setPersonalityAnswer(message.testQuestion, answer)
        if (onPersonalityAnswer) {
          onPersonalityAnswer(message.testQuestion, answer)
        }
      },
      [message, becomeSpecialistState.step, setPersonalityAnswer, onPersonalityAnswer],
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
                  "items-center justify-center rounded-sm text-base font-medium transition-colors",
                  "w-[104px] h-[36px] whitespace-nowrap text-neutral-700",
                  becomeSpecialistState.selectedTags.includes(tag.name)
                    ? "bg-violet-50"
                    : isDisabled
                      ? "bg-gray-50 text-gray-400 cursor-not-allowed"
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

    const renderPersonalityOptions = (tags: Tag[]) => {
      const currentAnswer = message.testQuestion ? becomeSpecialistState.personalityAnswers[message.testQuestion] : null

      // Блокируем кнопки, если:
      // 1. Пользователь уже ответил на этот вопрос, ИЛИ
      // 2. Активный шаг (step) изменился (появилось новое сообщение)
      const isButtonDisabled =
        becomeSpecialistState.step !== 2 || (currentAnswer !== null && currentAnswer !== undefined)

      return (
        <div className={cn(
            "flex gap-3 ml-auto",
            isMobile ? "flex-col max-w-xs": "flex-row"
        )}>
          {tags.map((tag, index) => {
            const isSelected = currentAnswer === tag.name

            return (
              <button
                key={index}
                onClick={() => handlePersonalityAnswer(tag.name)}
                disabled={isButtonDisabled}
                className={cn(
                  "items-center justify-center rounded-sm text-base font-medium transition-colors",
                  "w-full py-2 px-4 text-neutral-700",
                  isSelected
                    ? "bg-violet-100"
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
      const currentAnswer = message.testQuestion ? becomeSpecialistState.versionAnswers[message.testQuestion] : null
      const isDisabled = becomeSpecialistState.step !== 3 || (currentAnswer !== null && currentAnswer !== undefined)

      return (
        <div className="w-min flex gap-6 ml-auto">
          {[1, 2, 3, 4, 5].map((value) => {
            const isSelected = currentAnswer === value

            return (
              <button
                key={value}
                onClick={() => {
                  onVersionAnswer(message.testQuestion, value)
                }}
                disabled={isDisabled}
                className={cn(
                  "items-center justify-center rounded-sm text-base font-medium transition-colors",
                  "w-[36px] py-2 text-neutral-700",
                  isSelected
                    ? "bg-violet-100"
                    : isDisabled
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
        <div className={cn(
            "flex w-full",
            !isMobile && (isUser  ? "pl-12" : "pr-12"),
        )}>
          <div className={`flex flex-col ${isUser ? "items-end " : "items-start"} w-full ${!isMobile && "max-w-full"}
          `}>
            <div className="flex">
              {!isUser && (
                  <div className={cn(
                      "flex flex-row justify-center",
                      !isUser && !isAssistant && "mb-1",
                  )}>
                    <button
                        className="transition-colors border-none hover:bg-transparent active:bg-none relative rounded-sm self-end"
                        onClick={handleViewSpecialistProfile}
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
                    <div className="flex flex-col ml-3 h-[40px] justify-between text-neutral-700">
                      <div>{isAssistant ? "Alura" : specialist?.name}</div>
                      <div className="text-base text-neutral-500 font-semibold">
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
                            isAssistant ? "border-none shadow-none bg-none mt-1" : "bg-white py-[7px] px-1.5",
                            `rounded-sm ${
                                isUser
                                    ? "bg-colors-custom-userMessage gap-3 py-[7px] px-1.5 "
                                    : "text-neutral-700  rounded-Date gap-3 "
                            }`,
                        )}
                        style={{ wordBreak: "break-word" }}
                    >
                      <div className="text-base leading-relaxed">{message.content}</div>
                    </div>
                  </div>
              )}

              {/* Specialty tags for become-specialist-drops */}
              {message.aiMessageType === "become-specialist-drops" && message.tags && message.tags.length > 0 && (
                  <div className="mt-6 ml-auto">{renderSpecialtyTags(message.tags)}</div>
              )}

              {/* Personality test options for profile-test */}
              {message.aiMessageType === "profile-test" && message.tags && message.tags.length > 0 && (
                  <div>
                    <div
                        className={cn(
                            "rounded-sm flex flex-col",
                            "text-gray-700 font-semibold rounded-Date shadow-violet-50 gap-3 border-none shadow-none px-0 ",
                        )}
                        style={{ wordBreak: "break-word" }}
                    >
                      <p className="text-base leading-relaxed font-semibold">{"1 - " + (message.questionIndex! + 1)}</p>
                      <p className="text-base leading-relaxed font-semibold">{message.testQuestion}</p>
                    </div>
                    <div className="mt-6 ml-auto">{renderPersonalityOptions(message.tags)}</div>
                  </div>
              )}

              {/* Version-specific test options */}
              {message.aiMessageType === "version-test" && (
                  <div>
                    <div
                        className={cn(
                            "rounded-sm  flex flex-col",
                            "text-gray-700 font-semibold rounded-Date shadow-violet-50 gap-3 border-none shadow-none px-0 ",
                        )}
                        style={{ wordBreak: "break-word" }}
                    >
                      <p className="text-base leading-relaxed font-semibold">{(message.questionIndex! + 5) + " - 14"}</p>
                      <p className="text-base leading-relaxed font-semibold">{message.testQuestion}</p>
                    </div>
                    <div className="mt-6 ml-auto">{renderVersionOptions()}</div>
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
                                "inline-flex items-center gap-2 p-2 bg-gray-100 hover:bg-gray-200  transition-colors rounded-sm",
                                isUser ? "justify-end" : "justify-start",
                            )}
                        >
                          <Paperclip className="w-4 h-4 text-gray-600 dark:text-gray-300 flex-shrink-0" />
                          <span className="text-base text-gray-800 dark:text-gray-200 truncate max-w-xs">{file.name}</span>
                        </a>
                    ))}
                  </div>
              )}

              {message.specialists && message.specialists.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 max-w-4xl">
                    {message.specialists.map((specialist) => (
                        <InstagramSpecialistCard
                            key={specialist.id}
                            specialist={specialist}
                            onClick={() => onSpecialistClick(specialist.id)}
                            showActionButtons={true}
                        />
                    ))}
                  </div>
              )}

              {message.services && message.services.length > 0 && (
                  <div className="mt-3 flex justify-end justify-items-end my-6">
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

            {message.bookingTextTitle && (<div className="text-base text-neutral-900 font-semibold">{message.bookingTextTitle}</div>)}

            {message.bookingFrame && (
                isMobile ? (
                    <>
                      <div className="w-full">
                        <CalendarWidget selectedDate={selectedDate} onDateSelect={setSelectedDate} isCollapsible={true} />
                      </div>
                      <MobileBookingSection selectedDate={selectedDate} bookingSlots={mockBookingSlots} />
                      <div/>
                    </>
                ) : (
                    <div className=" relative flex flex-row  pb-3 w-full">
                      <div className="w-80 flex-shrink-0">
                        <CalendarWidget selectedDate={selectedDate} onDateSelect={setSelectedDate} />
                      </div>
                      <BookingSection selectedDate={selectedDate} bookingSlots={mockBookingSlots} />
                      <div/>
                    </div>
                )
            )}

            {message.footerContent && (isAssistant || isAI) && !isUser && (
                <div className={cn("text-neutral-700 mb-2")}>
                  <p className="text-base leading-relaxed">{message.footerContent}</p>
                </div>
            )}

            {isAssistant && !isUser && (
                <div
                    className={cn(
                        "border-t border border-width-[1px] border-gray-200 w-full ",
                        message.aiMessageType === "service" && "border-colors-custom-accent",
                        message.aiMessageType === "warning" && "border-pink-500",
                        message.aiMessageType === "accept-policy" && "border-colors-custom-accent",
                        message.aiMessageType === "become-specialist-drops" && "border-neutral-500",
                        message.aiMessageType === "profile-test" && "border-0",
                        message.aiMessageType === "version-test" && "border-0",
                    )}
                />
            )}

            {/* Policy acceptance section */}
            {message.aiMessageType === "become-specialist-drops" && (
                <div className="mt-4 flex flex-row gap-3 ml-auto items-end ">
                  <div className="font-medium text-base mb-2">Политика обработки и хранения данных</div>
                  <Checkbox
                      id="policy-accept"
                      checked={becomeSpecialistState.policyAccepted}
                      onCheckedChange={handlePolicyChange}
                      disabled={becomeSpecialistState.step > 1}
                      className={cn(
                          "w-[36px] h-[36px] rounded-sm border-colors-custom-accent text-colors-custom-accent active:text-white active:bg-colors-custom-accent focus:ring-colors-custom-accent",
                          becomeSpecialistState.step > 1 && "opacity-50 cursor-not-allowed",
                      )}
                  />
                </div>
            )}

            <div className="flex justify-between w-full">
              {message.aiMessageType === "service" ? (
                  // Service-specific buttons
                  <div className="flex flex-col w-full mt-2">
                    {
                      // TODO
                    }
                    <ActionButtonsRow onRegenerate={() => {}} onConfirm={() => {}} onBurn={() => {}} />
                  </div>
              ) : isUser && (<button className="ml-auto mt-2 w-3 h-3 mb-1 mr-2">
                <Edit size={12} className="text-neutral-700 "/>
              </button>)
              }
            </div>

            {!isUser && (<div className="h-9"></div>)}

          </div>
        </div>
      </div>
    )
  },
)

MessageItem.displayName = "MessageItem"
