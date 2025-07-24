"use client"
import React, { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  Search, PanelRightOpen, Activity, LucideArchive, SparklesIcon, CalendarDays, Repeat2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/contexts/sidebar-context"
import { useAuth } from "@/hooks/use-auth"
import { v4 as uuidv4 } from "uuid"

import { useSidebarData } from "./hooks/use-sidebar-data"
import { useSidebarSearch } from "./hooks/use-sidebar-search"
import { SectionHeader } from "./components/section-header"
import { SectionContent } from "./components/section-content"
import { ChatItem } from "./components/chat-item"
import { ANIMATION_DURATION, ANIMATION_TIMING } from "./utils/sidebar.utils"
import { useProfileStore } from "@/stores/profile-store"
import {Pentagram} from "@/components/icons/icon-pentagram";
import {UserSwitch} from "@/components/icons/icon-user-switch";

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
  const { logout } = useAuth()
  const { user, setUser } = useProfileStore()
  const isMobile = useMediaQuery("(max-width: 768px)")

  const {
    allChats,
    groupedChats,
    sectionVisibility,
    toggleSection,
    updateLastReadTimestamp,
    hasNewMessages,
    isActiveChat,
  } = useSidebarData(pathname)

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

  const handleNewSearch = () => {
    const newSearchId = uuidv4()
    router.push(`/search/${newSearchId}`)

    if (isMobile) {
      toggleSidebar()
    }
  }

  const setHat = () => {
    if (user === null) {
      logout()
    }

    if (user?.hat === "adept") {
      setUser({ ...user, hat: "master" })
    } else {
      setUser({ ...user, hat: "adept" })
    }
  }

  const handleCalendarClick = () => {
    router.push("/calendar")
    if (isMobile) {
      toggleSidebar()
    }
  }

  const handleSavedClick = () => {
    router.push("/profile?section=saved")
    if (isMobile) {
      toggleSidebar()
    }
  }

  const handleSpecialistClick = () => {
    if (!user?.isSpecialist) {
      router.push("/become-specialist")
    } else {
      setHat()
    }
    if (isMobile) {
      toggleSidebar()
    }
  }

  // Определяем тип контента в зависимости от роли пользователя
  const isSpecialist = user?.isSpecialist || false
  const hat = user?.hat || "adept"

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
      {isMobile ? (
        <>
          <div className="relative py-3 space-y-3 mt-3 gap-3">
            <div className="flex flex-row items-center w-full px-3 pl-6 gap-4.5">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 " />
                <Input
                  placeholder={"Поиск в чатах"}
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-sm focus:border-gray-400"
                />
              </div>
              <button onClick={toggleSidebar} className="rounded-sm pl-3">
                <PanelRightOpen width={24} height={24} />
                <span className="sr-only">Закрыть сайдбар</span>
              </button>
            </div>
            <div className="flex flex-row items-center justify-center w-full gap-6 pl-6 pr-3">
              <button
                  onClick={handleCalendarClick}
                  className="relative flex flex-col items-center justify-start w-24 h-24 p-2 border border-gray-200 hover:bg-violet-50 rounded-sm transition-colors"
              >
                <div className="absolute top-1/4 transform -translate-y-1/4">
                  <CalendarDays className="w-12 h-12 text-gray-700" />
                </div>
                <span className="absolute bottom-2 left-2 text-xs font-bold w-[calc(100%-1rem)] text-left">Календарь</span>
              </button>

              <button
                  onClick={handleSavedClick}
                  className="relative flex flex-col items-center justify-start w-24 h-24 p-2 border border-gray-200 hover:bg-violet-50 rounded-sm transition-colors"
              >
                <div className="absolute top-1/4 transform -translate-y-1/4">
                  <Pentagram className="w-12 h-12 mt-1 text-gray-700" />
                </div>
                <span className="absolute bottom-2 left-2 text-xs font-bold w-[calc(100%-1rem)] text-left">Избранное</span>
              </button>

              <button
                  onClick={handleSpecialistClick}
                  className="relative flex flex-col items-center justify-start w-24 h-24 p-2 border border-gray-200 hover:bg-violet-50 rounded-sm transition-colors"
              >
                <div className="absolute top-1/4 transform -translate-y-1/4">
                  <UserSwitch className="w-9 h-9  text-gray-700" />
                </div>
                <span className="absolute bottom-2 left-2 text-xs font-bold w-[calc(100%-1rem)] leading-tight">
                  {getSpecialistButtonText()}
                </span>
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="relative p-3 space-y-3 mt-6">
            <div className="flex items-center justify-end">
              <button onClick={toggleSidebar} className="rounded-sm hover:bg-gra-100 dark:hover:bg-gray-700 gap-2">
                <PanelRightOpen width={24} height={24} />
                <span className="sr-only">Закрыть сайдбар</span>
              </button>
            </div>

            <div className="flex flex-row gap-3 mt-6">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 " />
                <Input
                    placeholder="Поиск в чатах"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-sm focus:border-gray-400"
                />
              </div>
            </div>
          </div>
        </>
      )}

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
            <div className="px-1.5">
              <SectionHeader
                title="Результаты поиска"
                sectionKey="search"
                count={searchResults.length}
                sectionVisibility={sectionVisibility}
                toggleSection={toggleSection}
                isCollapsed={isCollapsed}
                isMobile={isMobile}
                icon={Search}
                iconStyle=""
              />
              <SectionContent sectionKey="search" sectionVisibility={sectionVisibility}>
                {searchResults.length > 0 ? (
                    searchResults.map((chat) => (
                        <ChatItem
                            key={chat.id}
                            chat={chat}
                            onChatClick={handleChatClick}
                            isActiveChat={isActiveChat}
                            hasNewMessages={hasNewMessages}
                            isCollapsed={isCollapsed}
                            isMobile={isMobile}
                        />
                    ))
                ) : (
                    <div className="px-3 py-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                      <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      Ничего не найдено
                    </div>
                )}
              </SectionContent>
            </div>
          ) : (
            <>
              {groupedChats.today.length > 0 && (
                  <div className="px-1.5">
                  <SectionHeader
                    title="Активные сегодня"
                    sectionKey="today"
                    count={groupedChats.today.length}
                    sectionVisibility={sectionVisibility}
                    toggleSection={toggleSection}
                    isCollapsed={isCollapsed}
                    isMobile={isMobile}
                    icon={Activity}
                    iconStyle={"text-violet-600"}
                  />
                  <SectionContent sectionKey="today" sectionVisibility={sectionVisibility}>
                    {groupedChats.today.map((chat) => (
                        <ChatItem
                            key={chat.id}
                            chat={chat}
                            onChatClick={handleChatClick}
                            isActiveChat={isActiveChat}
                            hasNewMessages={hasNewMessages}
                            isCollapsed={isCollapsed}
                            isMobile={isMobile}
                        />
                    ))}
                  </SectionContent>
                </div>
              )}

              {groupedChats.last7Days.length > 0 && (
                  <div className="px-1.5">
                  <SectionHeader
                    title="Прошлые 7 дней"
                    sectionKey="last7Days"
                    count={groupedChats.last7Days.length}
                    sectionVisibility={sectionVisibility}
                    toggleSection={toggleSection}
                    isCollapsed={isCollapsed}
                    isMobile={isMobile}
                  />
                  <SectionContent sectionKey="last7Days" sectionVisibility={sectionVisibility}>
                    {groupedChats.last7Days.map((chat) => (
                        <ChatItem
                            key={chat.id}
                            chat={chat}
                            onChatClick={handleChatClick}
                            isActiveChat={isActiveChat}
                            hasNewMessages={hasNewMessages}
                            isCollapsed={isCollapsed}
                            isMobile={isMobile}
                        />
                    ))}
                  </SectionContent>
                </div>
              )}

              {groupedChats.older.length > 0 && (
                  <div className="px-1.5">
                  <SectionHeader
                    title="Архив опыта"
                    sectionKey="older"
                    count={groupedChats.older.length}
                    sectionVisibility={sectionVisibility}
                    toggleSection={toggleSection}
                    isCollapsed={isCollapsed}
                    isMobile={isMobile}
                    icon={LucideArchive}
                  />
                  <SectionContent sectionKey="older" sectionVisibility={sectionVisibility}>
                    {groupedChats.older.map((chat) => (
                        <ChatItem
                            key={chat.id}
                            chat={chat}
                            onChatClick={handleChatClick}
                            isActiveChat={isActiveChat}
                            hasNewMessages={hasNewMessages}
                            isCollapsed={isCollapsed}
                            isMobile={isMobile}
                        />
                    ))}
                  </SectionContent>
                </div>
              )}
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
