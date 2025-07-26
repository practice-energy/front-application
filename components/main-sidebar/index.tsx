"use client"
import React, { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  CalendarDays, MessageSquareText,
  SparklesIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/contexts/sidebar-context"
import { useAuth } from "@/hooks/use-auth"

import { useSidebarData } from "./hooks/use-sidebar-data"
import { useSidebarSearch } from "./hooks/use-sidebar-search"
import { ANIMATION_DURATION, ANIMATION_TIMING } from "./utils/sidebar.utils"
import { useProfileStore } from "@/stores/profile-store"
import {ChatsAdeptSections} from "@/components/main-sidebar/components/chat-adept-sections";
import {Topper} from "@/components/main-sidebar/components/topper";
import {ChatsSearchSection} from "@/components/main-sidebar/components/chats-search-section";
import {DashboardMasterSections} from "@/components/main-sidebar/components/dashboard-master-sections";
import {mockDashboardStats} from "@/services/mock-dash";
import {useHeaderState} from "@/components/header/hooks/use-header-state";
import {BigProfileButtons} from "@/components/big-profile-buttons";
import {PentagramIcon, UserSwitchIcon} from "@phosphor-icons/react";

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
  const { logout, isAuthenticated } = useAuth()
  const { user, setUser } = useProfileStore()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const hat = user?.hat

  const {
    allChats,
    groupedChats,
    sectionVisibility,
    toggleSection,
    updateLastReadTimestamp,
    hasNewMessages,
    isActiveChat,
  } = useSidebarData(pathname, hat)

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

  // Определяем тип контента в зависимости от роли пользователя
  const isSpecialist = user?.isSpecialist || false

  const getSpecialistButtonText = () => {
    if (!isSpecialist) return "Стать мастером"
    return hat === "adept" ? "Мастер" : "Инициант"
  }

  return (
    <div
      id="main-sidebar"
      data-state={isCollapsed ? "collapsed" : "expanded"}
      style={{
        transition: `transform ${ANIMATION_DURATION}ms ${ANIMATION_TIMING}`,
        transform: isCollapsed ? "translateX(-100%)" : "translateX(0)",
      }}
      className={cn(
        "fixed left-0 top-0 h-full w-full 1. md:w-[400px] bg-white shadow-sm flex flex-col z-50 border-r backdrop-blur-sm focus:outline-none focus:ring-0",
        isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100",
      )}
    >
      <Topper
          toggleSidebar={toggleSidebar}
          searchQuery={searchQuery}
          handleSearch={handleSearch}
          isMobile={isMobile}
      />

      <BigProfileButtons
          user={user}
          actions={{
            onCalendar: () => console.log('Calendar clicked'),
            onChats: () => console.log('Chats clicked'),
            onSwitchRole: () => console.log('Switch role clicked'),
            onFavorites: () => console.log('Favorites clicked'),
            onBecomeMaster: () => console.log('Become master clicked'),
            onInitiatePractice: () => console.log('Initiate practice clicked'),
          }}
          icons={{
            calendar: CalendarDays,
            chat: MessageSquareText,
            switch: UserSwitchIcon,
            pentagram: PentagramIcon,
          }}
          show={{
            calendar: true,
            chat: true,
            switchRole: isAuthenticated,
            favorites: user?.hat === "adept",
            initiatePractice: !isAuthenticated,
            becomeMaster: user?.isSpecialist !== true && isAuthenticated,
          }}
      />

      {/* Область скролла - общая для всех устройств */}
      <ScrollArea className={cn("flex-1 relative")}>
        {/* Исчезающий градиент сверху */}
        <div
          className={cn(
            "sticky top-[-1px] left-0 right-0 h-3 bg-gradient-to-b to-transparent pointer-events-none z-10",
             "from-white via-white/80 to-transparent",
          )}
        />

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
            {hat === "master" &&  isMobile ? (
               <DashboardMasterSections
                   activities={mockDashboardStats.upcomingActivities.activities}
                   sectionVisibility={sectionVisibility}
                   toggleSection={toggleSection}
                   isCollapsed={isCollapsed}
                   isMobile={isMobile}
                   isActiveChat={isActiveChat}
                   hasNewMessages={hasNewMessages}
                   handleChatClick={handleChatClick}
               />
            ) : (
                <ChatsAdeptSections
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

        {/* Исчезающий градиент снизу */}
        <div
            className={cn(
                "sticky bottom-0 left-0 right-0 h-3 bg-gradient-to-t to-transparent pointer-events-none z-10",
                "from-white via-white/80 to-transparent",
            )}
        />
      </ScrollArea>

      <div className="p-3">
        <Button variant="outline" className="w-full hover:bg-violet-100 rounded-sm px-6 h-12 bg-transparent">
          <div className="items-center flex flex-row gap-3">
            <SparklesIcon />
            <p className="text-base font-medium text-center w-full">Позолоти ручку</p>
          </div>
        </Button>
      </div>

      <div className="h-6" />
    </div>
  )
}
