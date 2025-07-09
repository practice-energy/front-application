"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Search, Plus, MessageSquare, ChevronDown, PanelRightOpen, GalleryHorizontalEnd } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/contexts/sidebar-context"
import Image from "next/image"
import { mockSidebarChats, groupChatsByTime, formatTimestamp } from "@/services/mock-data"
import { v4 as uuidv4 } from "uuid"
import type { Chat, ChatItem } from "@/types/chats"

// Animation constants
export const ANIMATION_DURATION = 200
export const ANIMATION_TIMING = "cubic-bezier(0.25, 0.46, 0.45, 0.94)"

interface LastReadTimestamps {
  [chatId: string]: string
}

const getLastReadTimestamps = (): LastReadTimestamps => {
  if (typeof window === "undefined") return {}
  try {
    const data = localStorage.getItem("lastReadTimestamps")
    return data ? JSON.parse(data) : {}
  } catch {
    return {}
  }
}

const saveLastReadTimestamps = (timestamps: LastReadTimestamps) => {
  if (typeof window === "undefined") return
  localStorage.setItem("lastReadTimestamps", JSON.stringify(timestamps))
}

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
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [chats, setChats] = useState<ChatItem[]>(mockSidebarChats)
  const [newChats, setNewChats] = useState<Chat[]>([]) // New chats from search pages
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<ChatItem[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [lastReadTimestamps, setLastReadTimestamps] = useState<LastReadTimestamps>(getLastReadTimestamps())

  // Section visibility state - each section maintains its own state
  const [sectionVisibility, setSectionVisibility] = useState({
    today: true,
    last7Days: true,
    last30Days: true,
    older: true,
    search: true,
  })

  // Listen for new chats being added from search pages
  useEffect(() => {
    const handleAddNewChat = (event: CustomEvent) => {
      const { chat } = event.detail
      setNewChats((prev) => {
        // Check if chat already exists
        const exists = prev.some((c) => c.id === chat.id)
        if (exists) return prev

        // Add new chat to the beginning of the list
        return [chat, ...prev]
      })
    }

    window.addEventListener("addNewChatToSidebar", handleAddNewChat as EventListener)

    return () => {
      window.removeEventListener("addNewChatToSidebar", handleAddNewChat as EventListener)
    }
  }, [])

  // Convert new chats to ChatItem format for display
  const convertedNewChats: ChatItem[] = newChats.map((chat) => ({
    id: chat.id,
    title: chat.title,
    description: chat.messages.length > 0 ? chat.messages[0].content : "Новый чат",
    avatar: chat.isAi ? "/allura-logo.png" : "/placeholder-user.png",
    status: "waiting" as const,
    timestamp: chat.createdAt,
    updatedAt: chat.createdAt,
    isAIEnabled: chat.isAi,
    isAI: chat.isAi,
    isNew: true,
  }))

  // Combine old and new chats
  const allChats = [...convertedNewChats, ...chats]

  // Group chats by time period based on updatedAt
  const groupedChats = groupChatsByTime(allChats)

  const toggleSection = useCallback((section: string) => {
    setSectionVisibility((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }, [])

  const updateLastReadTimestamp = (chatId: string) => {
    const timestamps = { ...lastReadTimestamps, [chatId]: new Date().toISOString() }
    setLastReadTimestamps(timestamps)
    saveLastReadTimestamps(timestamps)
  }

  const hasNewMessages = (chat: ChatItem): boolean => {
    const lastRead = lastReadTimestamps[chat.id]
    if (!lastRead) return true
    return chat.timestamp > new Date(lastRead).getTime()
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    const results = allChats.filter(
      (chat) =>
        chat.title.toLowerCase().includes(query.toLowerCase()) ||
        chat.description.toLowerCase().includes(query.toLowerCase()),
    )
    setSearchResults(results)
  }

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

  const isActiveChat = (chatId: string) => pathname === `/search/${chatId}`

  const handleNewSearch = () => {
    const newSearchId = uuidv4()
    router.push(`/search/${newSearchId}`)

    if (isMobile) {
      toggleSidebar()
    }
  }

  const StatusBadge = ({ status }: { status: ChatItem["status"] }) => {
    const statusConfig = {
      waiting: { text: "Ожидает", color: "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400" },
      confirmed: {
        text: "Подтверждено",
        color: "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
      },
      completed: { text: "Исполнено", color: "bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400" },
    }

    if (status) {
      const config = statusConfig[status]

      return <span className={cn("px-2 py-0.5 text-xs font-medium rounded-sm", config.color)}>{config.text}</span>
    }

    return null
  }

  const ChatItem = ({ chat }: { chat: ChatItem }) => {
    const isActive = isActiveChat(chat.id)
    const hasUnread = hasNewMessages(chat)

    return (
      <div
        className={cn(
          "relative px-3 py-3 rounded-sm transition-colors cursor-pointer",
          isCollapsed && !isMobile ? "cursor-default" : "cursor-pointer",
          isCollapsed && !isMobile
            ? ""
            : isActive
              ? "bg-violet-50 dark:bg-violet-900/20 shadow-sm"
              : "hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:shadow-sm",
        )}
        onClick={() => handleChatClick(chat.id)}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            {chat.isAI ? (
              <Image
                src="/allura-logo.svg"
                alt={chat.title}
                width={32}
                height={32}
                className="w-8 h-8 rounded-sm object-cover transition-transform duration-200 hover:scale-105"
              />
            ) : (
              <Image
                src={chat.avatar || "/placeholder.png"}
                alt={chat.title}
                width={32}
                height={32}
                className="w-8 h-8 rounded-sm object-cover transition-transform duration-200 hover:scale-105"
              />
            )}
          </div>

          <div className={cn("flex-1 min-w-0", isCollapsed && !isMobile ? "hidden" : "block")}>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{chat.title}</h3>
              <div className="flex flex-col items-end gap-1">
                {chat.isAIEnabled && (
                  <Image src="/allura-logo.svg" alt="Allura Logo" width={14} height={14} className="inline-block" />
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-600 dark:text-gray-400 truncate mb-2">{chat.description}</p>
              {hasUnread && (
                <div className="w-2 h-2 bg-violet-500 dark:bg-violet-600 rounded-sm flex-shrink-0 animate-pulse" />
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {chat.status !== undefined && <StatusBadge status={chat.status} />}
              </div>
              {/*<div className="flex items-center gap-3">*/}
              {/*  <span className="text-xs text-gray-500 dark:text-gray-500">{formatTimestamp(chat.timestamp)}</span>*/}
              {/*</div>*/}
            </div>
          </div>
        </div>
      </div>
    )
  }
  const SearchResultItem = ({ chat, query }: { chat: ChatItem; query: string }) => {
    return (
      <div
        className={cn(
          "px-3 py-3 cursor-pointer rounded-sm transition-colors",
          isActiveChat(chat.id)
            ? "bg-violet-50 dark:bg-violet-900/20"
            : "hover:bg-violet-50 dark:hover:bg-violet-900/20",
        )}
        onClick={() => handleChatClick(chat.id)}
      >
        <div className="flex items-start gap-3">
          <Image
            src={chat.avatar || "/placeholder.png"}
            alt={chat.title}
            width={32}
            height={32}
            className="w-8 h-8 rounded-sm object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{chat.title}</h3>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 truncate mb-2">{chat.description}</p>
            <div className="flex items-center justify-between">
              <StatusBadge status={chat.status} />
              <span className="text-xs text-gray-500">{formatTimestamp(chat.timestamp)}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const SectionHeader = ({
    title,
    sectionKey,
    count,
  }: {
    title: string
    sectionKey: string
    count: number
  }) => {
    const isVisible = sectionVisibility[sectionKey]

    if (count === 0) return null

    return (
      <button
        className={cn(
          "flex items-center gap-1 w-full px-3 py-3 group transition-all duration-100 ease-in-out",
          "hover:bg-gray-100 dark:hover:bg-gray-800 rounded-sm",
          isCollapsed && !isMobile ? "hidden" : "flex",
        )}
        onClick={(e) => {
          e.stopPropagation()
          toggleSection(sectionKey)
        }}
      >
        <GalleryHorizontalEnd className="h-4 w-4 ml-3 mb-0.5 gap-1 " />
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {title} ({count})
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-gray-400 dark:text-gray-500 transition-all duration-300 ease-in-out transform",
            "group-hover:text-gray-600 dark:group-hover:text-gray-300",
            isVisible ? "rotate-180" : "rotate-0",
          )}
        />
      </button>
    )
  }

  const SectionContent = ({
    children,
    sectionKey,
  }: {
    children: React.ReactNode
    sectionKey: string
  }) => {
    const isVisible = sectionVisibility[sectionKey]
    const contentRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      if (!contentRef.current) return

      const element = contentRef.current
      const height = element.scrollHeight

      if (isVisible) {
        element.style.height = "0px"
        element.style.opacity = "0"
        element.offsetHeight // Force reflow
        element.style.transition = `height ${ANIMATION_DURATION}ms ${ANIMATION_TIMING}, opacity ${ANIMATION_DURATION}ms ${ANIMATION_TIMING}`
        element.style.height = `${height}px`
        element.style.opacity = "1"

        const timeoutId = setTimeout(() => {
          element.style.height = "auto"
        }, ANIMATION_DURATION)

        return () => clearTimeout(timeoutId)
      } else {
        element.style.height = `${height}px`
        element.style.opacity = "1"
        element.offsetHeight // Force reflow
        element.style.transition = `height ${ANIMATION_DURATION}ms ${ANIMATION_TIMING}, opacity ${ANIMATION_DURATION}ms ${ANIMATION_TIMING}`
        element.style.height = "0px"
        element.style.opacity = "0"
      }
    }, [isVisible])

    return (
      <div
        ref={contentRef}
        className="overflow-hidden"
        style={{
          height: isVisible ? "auto" : "0px",
          opacity: isVisible ? 1 : 0,
        }}
      >
        <div className="pb-2">{children}</div>
      </div>
    )
  }

  return (
    <div
      id="main-sidebar"
      data-state={isCollapsed ? "collapsed" : "expanded"}
      style={{
        transition: `all ${ANIMATION_DURATION}ms ${ANIMATION_TIMING}`,
      }}
      className={cn(
        "fixed left-0 top-0 h-full bg-gray-50 dark:bg-gray-900 border-r border-gray-300 dark:border-gray-700 flex flex-col z-50",
        "backdrop-blur-sm",
        isCollapsed ? "w-0 opacity-0 pointer-events-none" : "opacity-100",
        !isCollapsed && (isMobile ? "w-full" : "w-80"),
      )}
    >
      <div className={cn("p-4 space-y-3 border-b border-gray-200 dark:border-gray-700")}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Чаты</h2>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className={cn(
              "h-8 w-8 transition-all duration-300 ease-in-out rounded-sm",
              "hover:bg-gray-200 dark:hover:bg-gray-700",
              "transform hover:scale-105 active:scale-95",
              isCollapsed ? "opacity-0 pointer-events-none scale-95" : "opacity-100 scale-100",
            )}
          >
            <PanelRightOpen className="h-4 w-4" />
            <span className="sr-only">Закрыть сайдбар</span>
          </Button>
        </div>

        <Button
          onClick={handleNewSearch}
          variant="ghost"
          className="w-full justify-between text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 h-10 rounded-sm transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="flex items-center">
            <MessageSquare className="w-4 h-4 mr-3" />
            <span className="text-sm">Новый чат</span>
          </div>
          <Plus className="w-4 h-4" />
        </Button>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 transition-colors duration-200" />
          <Input
            placeholder="Поиск в чатах"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-sm transition-all duration-200 ease-in-out focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 relative">
        <div className="py-2">
          {isSearching ? (
            <div>
              <SectionHeader title="Результаты поиска" sectionKey="search" count={searchResults.length} />
              <SectionContent sectionKey="search">
                <div className="space-y-1 px-2">
                  {searchResults.length > 0 ? (
                    searchResults.map((chat) => <SearchResultItem key={chat.id} chat={chat} query={searchQuery} />)
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
                <div className="mb-2">
                  <SectionHeader title="Сегодня" sectionKey="today" count={groupedChats.today.length} />
                  <SectionContent sectionKey="today">
                    <div className="space-y-1 px-2">
                      {groupedChats.today.map((chat) => (
                        <ChatItem key={chat.id} chat={chat} />
                      ))}
                    </div>
                  </SectionContent>
                </div>
              )}

              {groupedChats.last7Days.length > 0 && (
                <div className="mb-2">
                  <SectionHeader
                    title="Последние 7 дней"
                    sectionKey="last7Days"
                    count={groupedChats.last7Days.length}
                  />
                  <SectionContent sectionKey="last7Days">
                    <div className="space-y-1 px-2">
                      {groupedChats.last7Days.map((chat) => (
                        <ChatItem key={chat.id} chat={chat} />
                      ))}
                    </div>
                  </SectionContent>
                </div>
              )}

              {groupedChats.last30Days.length > 0 && (
                <div className="mb-2">
                  <SectionHeader
                    title="Последние 30 дней"
                    sectionKey="last30Days"
                    count={groupedChats.last30Days.length}
                  />
                  <SectionContent sectionKey="last30Days">
                    <div className="space-y-1 px-2">
                      {groupedChats.last30Days.map((chat) => (
                        <ChatItem key={chat.id} chat={chat} />
                      ))}
                    </div>
                  </SectionContent>
                </div>
              )}

              {groupedChats.older.length > 0 && (
                <div className="mb-2">
                  <SectionHeader title="Старые" sectionKey="older" count={groupedChats.older.length} />
                  <SectionContent sectionKey="older">
                    <div className="space-y-1 px-2">
                      {groupedChats.older.map((chat) => (
                        <ChatItem key={chat.id} chat={chat} />
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

// Re-export the main sidebar component for backward compatibility from "./main-sidebar"
