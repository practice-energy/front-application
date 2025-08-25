"use client"
import React, { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { CalendarDays, LogOutIcon, MessageSquareText, PentagonIcon, SettingsIcon, SlidersVerticalIcon, SparklesIcon } from 'lucide-react'
import { ScrollArea } from "@/src/components/ui/scroll-area"
import { cn } from "@/src/lib/utils"
import { useSidebar } from "@/contexts/sidebar-context"
import { useAuth } from "@/src/hooks/use-auth"
import { motion, AnimatePresence } from "framer-motion"

import { useSidebarData } from "./hooks/use-sidebar-data"
import { useSidebarSearch } from "./hooks/use-sidebar-search"
import { ANIMATION_DURATION, ANIMATION_TIMING } from "./utils/sidebar.utils"
import { useProfileStore } from "@/src/stores/profile-store"
import {ChatsSections} from "@/src/components/main-sidebar/components/chat-adept-sections";
import {Topper} from "@/src/components/main-sidebar/components/topper";
import {ChatsSearchSection} from "@/src/components/main-sidebar/components/chats-search-section";
import {DashboardActivitySections} from "@/src/components/main-sidebar/components/dashboard-activity-sections";
import {mockDashboardStats} from "@/src/services/mock-dash";
import {BigProfileButtons} from "@/src/components/big-profile-buttons";
import {ChatsIcon, PentagramIcon, UserSwitchIcon} from "@phosphor-icons/react";
import {v4 as uuidv4} from "uuid";
import {messageInitMaster} from "@/src/components/become-specialist/messages";
import {useAdeptChats, useBecomeSpecialist, useChatStore, useMasterChats} from "@/src/stores/chat-store";
import {boolean} from "zod";
import {Chat, type Message} from "@/src/types/chats";
import {IconPractice} from "@/src/components/icons/icon-practice";
import { SpecialistShareCard } from "@/src/components/specialist/specialist-share-card"
import { mockSpecialists } from "@/src/services/mock-specialists"
import {Mufi} from "@/src/components/mufi";

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }

    const listener = () => setMatches(media.matches)
    media.addEventListener("change", listener)

    return () => media.removeEventListener("change", listener)
  }, [matches, query])

  return matches
}

export function MainSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { isCollapsed, toggleSidebar } = useSidebar()
  const { logout, isAuthenticated, updateUser } = useAuth()
  const { user, setUser } = useProfileStore()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const hat = user?.hat
  const [showMasterChats, setShowMasterChats] = useState<boolean>(true)
  const [showShareCard, setShowShareCard] = useState<boolean>(false)
  const [copied, setCopied] = useState(false)
  const { addChat: addMasterChat, chats: masterChats } = useMasterChats()
  const { addChat : addAdeptChat, chats: adeptChats } = useAdeptChats()

  const {
    allChats,
    groupedChats,
    sectionVisibility,
    toggleSection,
    updateLastReadTimestamp,
    hasNewMessages,
    isActiveChat,
  } = useSidebarData(pathname, hat)

  const {
    state: becomeSpecialistState,
    setStep: setBecomeSpecialistStep,
    setChatId: setBecomeSpecialistChatId,
    resetState: resetBecomeSpecialistState,
  } = useBecomeSpecialist()

  const { searchQuery, searchResults, isSearching, handleSearch } = useSidebarSearch(allChats)

  // Используем первого специалиста из мок данных для демонстрации
  const mockSpecialist = mockSpecialists[0]

  const handleChatClick = (chatId: string) => {
    if (isCollapsed && !isMobile) return

    if (!isActiveChat(chatId)) {
      updateLastReadTimestamp(chatId)
    }

    router.push(`/search/${chatId}`)

    if (isMobile) {
      toggleSidebar()
    }
  }

  const handleNewChat = (query: string, title = "Alura", files: File[] = [], isPractice?: boolean) => {
    const newChatId = uuidv4()
    const userMessage: Message = {
      id: uuidv4(),
      type: "user",
      content: query,
      timestamp: Date.now(),
      files: files,
    }

    const newChat: Chat = {
      id: newChatId,
      title: "Alura",
      timestamp: Date.now(),
      messages: [userMessage],
      isAI: true,
      hasNew: false,
      createdAt: Date.now(),
      isMuted: false,
    }

    if (user?.hat === "master") {
      addMasterChat(newChat)
    } else {
      addAdeptChat(newChat)
    }
    router.push(`/search/${newChatId}`)
    toggleSidebar()
  }


  const handleBecomeSpecialist = () => {
    updateUser({
      hat: "master",
      isSpecialist: true,
    })

    const chatId = uuidv4()
    const newChat = {
      id: chatId,
      title: "Стать мастером",
      isAI: true,
      isAIEnabled: true,
      isSpecialChat: "become-specialist" as const,
      timestamp: Date.now(),
      createdAt: Date.now(),
      messages: [
        messageInitMaster,
      ],
    }

    setBecomeSpecialistChatId(chatId)

    addMasterChat(newChat)
    router.push(`/search/${chatId}`)
  }

  const handleEarlyAccessClick = () => {
    setShowShareCard(!showShareCard)
  }

  const handleCopyLink = async () => {
    try {
      const shareUrl = `${window.location.origin}/specialist/${mockSpecialist.id}`
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy link:", error)
    }
  }

  const handleShare = (platform: string) => {
    const shareUrl = `${window.location.origin}/specialist/${mockSpecialist.id}`
    const shareText = `Check out ${mockSpecialist.name}, ${mockSpecialist.title}`
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

  const checkhasUpdates = (chats: Chat[])=>  {
    return chats.filter(chat => chat.hasNew).length
  }

  const buttons = [
    {
      id: "dashboard",
      topText: "Панель Мастер",
      variant: "practice",
      onClick: () => setShowMasterChats(false),
      show: isAuthenticated && user?.hat === "master" && showMasterChats
    },
    {
      id: "calendar-master",
      topText: "Календарь",
      variant: "left",
      bottomText: "Мастер",
      onClick: () => {
        router.push('/calendar')
        toggleSidebar()
      },
      show: isAuthenticated && user?.hat === "master",
      icon: CalendarDays
    },
    {
      id: "calendar-adept",
      topText: "Календарь",
      bottomText: "Инициант",
      variant: "left",
      onClick: () => {
        router.push('/calendar')
        toggleSidebar()
      },
      show: isAuthenticated && user?.hat === "adept",
      icon: CalendarDays
    },
    {
      id: "chats",
      topText: "Чаты",
      variant: "with-updates",
      onClick: () => setShowMasterChats(true),
      show: user?.hat === "master",
      updates: checkhasUpdates(masterChats),
      icon: ChatsIcon
    },
    {
      id: "switch-role",
      topText: user?.hat === "master" ? "Инициант" : "Мастер",
      variant: "with-updates",
      onClick: () => updateUser({ hat: user?.hat === "adept" ? "master" : "adept" }),
      show: isAuthenticated,
      updates: checkhasUpdates(user?.hat ==="master" ? adeptChats : masterChats),
      icon: UserSwitchIcon
    },
    {
      id: "favorites",
      topText: "Избранные",
      variant: "center",
      onClick: () => router.push('/profile?section=saved'),
      show: user?.hat === "adept",
      icon: PentagramIcon
    },
    {
      id: "become-master",
      topText: "Стать Мастером",
      variant: "two-lines",
      onClick: () => {
        toggleSidebar()
        router.push("/become-specialist")
      },
      show: isAuthenticated && user?.hat === "adept" && user?.isSpecialist === false,
      icon: UserSwitchIcon
    },
    {
      id: "settings-account",
      topText: "Настройки аккаунт",
      variant: "two-lines",
      onClick: () => setShowMasterChats(false),
      show: true,
      icon: SlidersVerticalIcon
    },
  ].filter(button => button.show)

  return (
    <div
      id="main-sidebar"
      data-state={isCollapsed ? "collapsed" : "expanded"}
      style={{
        transition: `all ${ANIMATION_DURATION}ms ${ANIMATION_TIMING}`,
        transform: isCollapsed ? "translateX(-100%)" : "translateX(0)",
        opacity: isCollapsed ? 0 : 1,
      }}
      className={cn(
        "fixed left-0 top-0 h-full w-full md:w-[400px] bg-colors-custom-sidebar shadow-sm flex flex-col z-40 border-r backdrop-blur-sm focus:outline-none focus:ring-0",
        isCollapsed && "pointer-events-none",
      )}
    >
      <div className="bg-white">
        <Topper
            toggleSidebar={toggleSidebar}
            searchQuery={searchQuery}
            handleSearch={handleSearch}
            isMobile={isMobile}
        />

        {isMobile && (
            <BigProfileButtons
                buttons={buttons}
                user={user}
            />
        )}
      </div>

      {/* Область скролла - общая для всех устройств */}
      <ScrollArea className={cn("flex-1 relative")}>
        <div>
          {isSearching ? (
              <ChatsSearchSection
                  isSearching={isSearching}
                  searchResults={searchResults}
                  groupedChats={groupedChats}
                  sectionVisibility={sectionVisibility}
                  toggleSection={toggleSection}
                  isCollapsed={isCollapsed}
                  isMobile={isMobile}
                  isActiveChat={isActiveChat}
                  hasNewMessages={hasNewMessages}
                  handleChatClick={handleChatClick}
              />
          ) : (<>
            {hat === "master" &&  isMobile && showMasterChats? (
               <DashboardActivitySections
                   stats={mockDashboardStats}
                   sectionVisibility={sectionVisibility}
                   toggleSection={toggleSection}
                   isCollapsed={isCollapsed}
                   isMobile={isMobile}
                   isActiveChat={isActiveChat}
                   hasNewMessages={hasNewMessages}
                   handleChatClick={handleChatClick}
               />
            ) : (
                <ChatsSections
                  hasChats={allChats.length > 0}
                  groupedChats={groupedChats}
                  sectionVisibility={sectionVisibility}
                  toggleSection={toggleSection}
                  isCollapsed={isCollapsed}
                  isMobile={isMobile}
                  isActiveChat={isActiveChat}
                  hasNewMessages={hasNewMessages}
                  handleChatClick={handleChatClick}
                />
            )
            }
          </>
          )}
        </div>

        <div className="h-12" />
      </ScrollArea>

      {/* Share Card Animation - now with lower z-index */}
      <AnimatePresence>
        {showShareCard && (
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={cn(
                    "absolute transform -translate-x-1/2 z-40", // Changed from z-[49] to z-40
                    isMobile ? "px-1 bottom-28 items-center" : "bottom-14 left-1"
                )}
            >
              <SpecialistShareCard
                  specialist={mockSpecialist}
                  copied={copied}
                  onCopyLink={handleCopyLink}
                  onShare={handleShare}
                  isMobile={isMobile}
              />
            </motion.div>
        )}
      </AnimatePresence>

      {/* Button remains with higher z-index */}
      <button
          className="w-full rounded-sm h-12 bg-none z-50 px-1 border-none mb-2"
          onClick={handleEarlyAccessClick}
      >
        <div className="items-center flex flex-row py-2 bg-neutral-900 text-white rounded-sm opacity-100 px-4 h-[48px]">
          <div className="text-base font-medium text-start w-full px-1 whitespace-nowrap">Ранний доступ для мастера</div>
          <div className="flex flex-row items-center justify-end w-full font-semibold text-2xl gap-3">
            {"+10"}
            <IconPractice width={48} height={48} className="text-white"/>
          </div>
        </div>
      </button>

      <div className="px-1 mb-2 z-[1000] w-full">
        {isMobile && (<Mufi showPractice={true} disableFileApply={true} isMobile={isMobile} onSearch={handleNewChat}/>)}
      </div>

    </div>
  )
}
