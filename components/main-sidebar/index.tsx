"use client"
import React, { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  CalendarDays, LogOutIcon, MessageSquareText, PentagonIcon, SettingsIcon, SlidersVerticalIcon,
  SparklesIcon,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/contexts/sidebar-context"
import { useAuth } from "@/hooks/use-auth"

import { useSidebarData } from "./hooks/use-sidebar-data"
import { useSidebarSearch } from "./hooks/use-sidebar-search"
import { ANIMATION_DURATION, ANIMATION_TIMING } from "./utils/sidebar.utils"
import { useProfileStore } from "@/stores/profile-store"
import {ChatsSections} from "@/components/main-sidebar/components/chat-adept-sections";
import {Topper} from "@/components/main-sidebar/components/topper";
import {ChatsSearchSection} from "@/components/main-sidebar/components/chats-search-section";
import {DashboardMasterSections} from "@/components/main-sidebar/components/dashboard-master-sections";
import {mockDashboardStats} from "@/services/mock-dash";
import {BigProfileButtons} from "@/components/big-profile-buttons";
import {ChatsIcon, PentagramIcon, UserSwitchIcon} from "@phosphor-icons/react";
import {v4 as uuidv4} from "uuid";
import {messageInitMaster} from "@/components/become-specialist/messages";
import {useAdeptChats, useBecomeSpecialist, useChatStore, useMasterChats} from "@/stores/chat-store";
import {boolean} from "zod";
import {Chat} from "@/types/chats";
import {IconPractice} from "@/components/icons/icon-practice";

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
      id: "settings-master",
      topText: "Настройки аккаунт",
      variant: "two-lines",
      onClick: () => setShowMasterChats(false),
      show: user?.hat === "master" && showMasterChats,
      icon: SettingsIcon
    },
    {
      id: "security",
      topText: "Безопасность",
      bottomText: "Активно 100%",
      variant: "with-bottom-text",
      onClick: () => setShowMasterChats(false),
      show: true,
      icon: PentagonIcon
    },
    {
      id: "settings-account",
      topText: "Настройки аккаунт",
      variant: "two-lines",
      onClick: () => setShowMasterChats(false),
      show: true,
      icon: SlidersVerticalIcon
    },
    {
      id: "logout",
      topText: "Выйти",
      variant: "logout",
      onClick: () => logout(),
      show: true,
      icon: LogOutIcon
    },
  ].filter(button => button.show)

  return (
    <div
      id="main-sidebar"
      data-state={isCollapsed ? "collapsed" : "expanded"}
      style={{
        transition: `transform ${ANIMATION_DURATION}ms ${ANIMATION_TIMING}`,
        transform: isCollapsed ? "translateX(-100%)" : "translateX(0)",
      }}
      className={cn(
        "fixed left-0 top-0 h-full w-full 1. md:w-[400px] bg-white shadow-sm flex flex-col z-40 border-r backdrop-blur-sm focus:outline-none focus:ring-0",
        isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100",
      )}
    >
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

      {/* Область скролла - общая для всех устройств */}
      <ScrollArea className={cn("flex-1 relative")}>

        {/* Исчезающий градиент сверху */}
        {/*<div*/}
        {/*  className={cn(*/}
        {/*    "sticky top-[-1px] left-0 right-0 h-3 bg-gradient-to-b to-transparent pointer-events-none z-10",*/}
        {/*     "from-white via-white/80 to-transparent",*/}
        {/*  )}*/}
        {/*/>*/}

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
               <DashboardMasterSections
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

        <button className="w-full rounded-sm h-12 bg-none z-50 px-1 border-none mb-4" >
          <div className="items-center flex flex-row py-2 bg-neutral-900 text-white rounded-sm opacity-100 px-4 h-[48px]">
            <div className="text-base font-medium text-start w-full px-1 whitespace-nowrap ">Ранний доступ для мастера </div>
            <div className="flex flex-row items-center justify-end w-full font-semibold text-2xl gap-3">
              {"+10"}
              <IconPractice width={48} height={48} className="text-white"/>
            </div>
          </div>
        </button>
    </div>
  )
}
