"use client"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Search, Plus, MessageSquare, PanelRightOpen, Activity, LucideArchive } from "lucide-react"
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
  const { user } = useAuth()
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

  // Определяем тип контента в зависимости от роли пользователя
  const isSpecialist = user?.isSpecialist || false
  const newChatLabel = isSpecialist ? "Новый клиент" : "Новый чат"

  return (
    <div
      id="main-sidebar"
      data-state={isCollapsed ? "collapsed" : "expanded"}
      style={{
        transition: `transform ${ANIMATION_DURATION}ms ${ANIMATION_TIMING}`,
        transform: isCollapsed ? "translateX(-100%)" : "translateX(0)",
      }}
      className={cn(
        "fixed left-0 top-0 h-full w-full md:w-96 bg-gray-50  border-gray-300 flex flex-col z-50 border-r backdrop-blur-sm",
        isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100",
      )}
    >
      {/* Общий контент для всех устройств */}
      <div className="relative p-3 space-y-3">
        <div className="flex items-center justify-end">
          <button
              onClick={toggleSidebar}
              className="rounded-sm hover:bg-gra-100 dark:hover:bg-gray-700 gap-2 px-3"
          >
            <PanelRightOpen width={24} height={24} />
            <span className="sr-only">Закрыть сайдбар</span>
          </button>
        </div>

        <Button
          onClick={handleNewSearch}
          variant="ghost"
          className="w-full justify-between hover:bg-violet-100 h-10 rounded-sm"
        >
          <div className="flex items-center">
            <MessageSquare className="w-4 h-4 mr-3" />
            <span className="text-sm">{newChatLabel}</span>
          </div>
          <Plus className="w-4 h-4" />
        </Button>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 " />
          <Input
            placeholder={isSpecialist ? "Поиск клиентов" : "Поиск в чатах"}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-sm focus:border-gray-400"
          />
        </div>
      </div>

      {/* Область скролла - общая для всех устройств */}
      <ScrollArea className="flex-1 h-[calc(100%-180px)] relative">
        {/* Исчезающий градиент сверху */}
        <div className="sticky top-0 left-0 right-0 h-3 bg-gradient-to-b from-gray-50 via-gray-50/80 to-transparent pointer-events-none z-10" />

        <div>
          {isSearching ? (
            <div>
              <SectionHeader
                title="Результаты поиска"
                sectionKey="search"
                count={searchResults.length}
                sectionVisibility={sectionVisibility}
                toggleSection={toggleSection}
                isCollapsed={isCollapsed}
                isMobile={isMobile}
              />
              <SectionContent sectionKey="search" sectionVisibility={sectionVisibility}>
                <div className="space-y-3 px-2">
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
                </div>
              </SectionContent>
            </div>
          ) : (
            <>
              {groupedChats.today.length > 0 && (
                <div>
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
                    <div className="space-y-3 px-3">
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
                    </div>
                  </SectionContent>
                </div>
              )}

              {groupedChats.last7Days.length > 0 && (
                <div>
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
                    <div className="space-y-3 px-3">
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
                    </div>
                  </SectionContent>
                </div>
              )}

              {groupedChats.older.length > 0 && (
                <div>
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
                    <div className="space-y-3 px-3">
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
                    </div>
                  </SectionContent>
                </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
