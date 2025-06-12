"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Search, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"

// Animation constants for synchronization
export const ANIMATION_DURATION = 300 // ms
export const ANIMATION_TIMING = "cubic-bezier(0.4, 0, 0.2, 1)" // ease-in-out equivalent
export const ANIMATION_PROPERTIES = "all"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  specialists?: any[]
}

interface Chat {
  id: string
  title: string
  timestamp: string
  isOnline?: boolean
  period: "today" | "week" | "month"
  messages: Message[]
  searchQueries: string[]
}

// Mock chat data with complete message history
const initialMockChats: Chat[] = [
  {
    id: "1",
    title: "BTopon 3aKOH TepmonHaMuKn",
    timestamp: "2 мин",
    isOnline: true,
    period: "today",
    messages: [
      {
        id: "1-1",
        type: "user",
        content: "Помогите с термодинамикой",
        timestamp: new Date(Date.now() - 120000),
      },
      {
        id: "1-2",
        type: "assistant",
        content: "Конечно! Я нашел специалистов по физике и термодинамике.",
        timestamp: new Date(Date.now() - 110000),
        specialists: [
          {
            id: 1,
            name: "Dr. Sarah Williams",
            title: "Physics Expert",
            rating: 4.95,
            location: "Los Angeles, CA",
            reviews: 203,
            image: "/placeholder.svg?height=200&width=200",
            specialties: ["Physics", "Thermodynamics"],
            isNew: false,
          },
        ],
      },
    ],
    searchQueries: ["термодинамика"],
  },
  {
    id: "2",
    title: "puST na xeHckou ayuTopin",
    timestamp: "1 ч",
    period: "week",
    messages: [
      {
        id: "2-1",
        type: "user",
        content: "Нужна помощь с женской аудиторией",
        timestamp: new Date(Date.now() - 3600000),
      },
      {
        id: "2-2",
        type: "assistant",
        content: "Вот специалисты по работе с женской аудиторией и маркетингу.",
        timestamp: new Date(Date.now() - 3590000),
        specialists: [],
      },
    ],
    searchQueries: ["женская аудитория", "маркетинг"],
  },
  {
    id: "3",
    title: "TunbI ahHbIX na npourig",
    timestamp: "3 ч",
    period: "week",
    messages: [
      {
        id: "3-1",
        type: "user",
        content: "Анализ данных для проекта",
        timestamp: new Date(Date.now() - 10800000),
      },
      {
        id: "3-2",
        type: "assistant",
        content: "Найдены эксперты по анализу данных и машинному обучению.",
        timestamp: new Date(Date.now() - 10790000),
        specialists: [],
      },
    ],
    searchQueries: ["анализ данных"],
  },
]

interface MainSidebarProps {
  isCollapsed?: boolean
  onToggle?: () => void
}

export function MainSidebar({ isCollapsed: initialIsCollapsed = true, onToggle }: MainSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [chats, setChats] = useState<Chat[]>(initialMockChats)
  const [balance] = useState(66666)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Chat[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(initialIsCollapsed)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [chatToDelete, setChatToDelete] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Listen for new chat events
  useEffect(() => {
    const handleNewChat = (event: CustomEvent) => {
      const { chatId, title, query } = event.detail
      addNewChat(chatId, title, query)
    }

    window.addEventListener("newChatCreated", handleNewChat as EventListener)

    return () => {
      window.removeEventListener("newChatCreated", handleNewChat as EventListener)
    }
  }, [])

  // Listen for chat title updates
  useEffect(() => {
    const handleChatTitleUpdate = (event: CustomEvent) => {
      const { chatId, title } = event.detail
      setChats((prev) => prev.map((chat) => (chat.id === chatId ? { ...chat, title } : chat)))
    }

    window.addEventListener("chatTitleUpdated", handleChatTitleUpdate as EventListener)

    return () => {
      window.removeEventListener("chatTitleUpdated", handleChatTitleUpdate as EventListener)
    }
  }, [])

  // Listen for message updates
  useEffect(() => {
    const handleMessageUpdate = (event: CustomEvent) => {
      const { chatId, messages } = event.detail
      setChats((prev) => prev.map((chat) => (chat.id === chatId ? { ...chat, messages: [...messages] } : chat)))
    }

    window.addEventListener("chatMessagesUpdated", handleMessageUpdate as EventListener)

    return () => {
      window.removeEventListener("chatMessagesUpdated", handleMessageUpdate as EventListener)
    }
  }, [])

  // Listen for header toggle events
  useEffect(() => {
    const handleHeaderToggle = (event: CustomEvent) => {
      const newCollapsedState = event.detail.isCollapsed
      toggleSidebar(newCollapsedState)
    }

    window.addEventListener("headerSidebarToggle", handleHeaderToggle as EventListener)

    return () => {
      window.removeEventListener("headerSidebarToggle", handleHeaderToggle as EventListener)
    }
  }, [])

  // Update body margin when sidebar state changes
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.style.marginLeft = isCollapsed ? "0" : "320px"
      document.body.style.transition = `margin-left ${ANIMATION_DURATION}ms ${ANIMATION_TIMING}`
    }
    return () => {
      if (typeof document !== "undefined") {
        document.body.style.marginLeft = "0"
      }
    }
  }, [isCollapsed])

  // Clean up animation timeout on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current)
      }
    }
  }, [])

  const addNewChat = (chatId: string, title: string, query?: string) => {
    const newChat: Chat = {
      id: chatId,
      title: title || "Новый поиск",
      timestamp: "сейчас",
      isOnline: false,
      period: "today",
      messages: [], // Start with empty messages
      searchQueries: query ? [query] : [],
    }

    setChats((prev) => [newChat, ...prev])
  }

  const toggleSidebar = (forcedState?: boolean) => {
    const newCollapsedState = forcedState !== undefined ? forcedState : !isCollapsed

    // Set animating state
    setIsAnimating(true)

    // Update collapsed state
    setIsCollapsed(newCollapsedState)

    // Save to localStorage
    localStorage.setItem("sidebarCollapsed", JSON.stringify(newCollapsedState))

    // Emit custom event with animation details for other components to sync with
    window.dispatchEvent(
      new CustomEvent("sidebarToggle", {
        detail: {
          isCollapsed: newCollapsedState,
          isAnimating: true,
          animationDuration: ANIMATION_DURATION,
          animationTiming: ANIMATION_TIMING,
        },
      }),
    )

    // Clear any existing animation timeout
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current)
    }

    // Set timeout to match animation duration
    animationTimeoutRef.current = setTimeout(() => {
      setIsAnimating(false)

      // Emit animation complete event
      window.dispatchEvent(
        new CustomEvent("sidebarAnimationComplete", {
          detail: {
            isCollapsed: newCollapsedState,
            isAnimating: false,
          },
        }),
      )
    }, ANIMATION_DURATION)

    if (onToggle) {
      onToggle()
    }
  }

  // Search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim() === "") {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    const results = chats.filter(
      (chat) =>
        chat.title.toLowerCase().includes(query.toLowerCase()) ||
        chat.searchQueries.some((q) => q.toLowerCase().includes(query.toLowerCase())) ||
        chat.messages.some((message) => message.content.toLowerCase().includes(query.toLowerCase())),
    )
    setSearchResults(results)
  }

  const handleChatClick = (chatId: string) => {
    if (isCollapsed) return // Disable clicks when collapsed

    // Find the chat and emit its message history
    const chat = chats.find((c) => c.id === chatId)
    if (chat) {
      // Emit event to load chat history
      window.dispatchEvent(
        new CustomEvent("loadChatHistory", {
          detail: { chatId, messages: chat.messages, title: chat.title },
        }),
      )
    }

    router.push(`/search/${chatId}`)
  }

  const handleNewSearch = () => {
    // Generate new search ID and navigate to new empty search page
    const newSearchId = Date.now().toString()

    // Add the new chat to sidebar immediately
    addNewChat(newSearchId, "Новый поиск")

    // Navigate to the new search page
    router.push(`/search/${newSearchId}`)
  }

  const handleUpgradePlan = () => {
    router.push("/balance/coming-soon")
  }

  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setChatToDelete(chatId)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteChat = () => {
    if (chatToDelete) {
      setChats((prev) => prev.filter((chat) => chat.id !== chatToDelete))
      setDeleteDialogOpen(false)
      setChatToDelete(null)
    }
  }

  const isActiveChat = (chatId: string) => {
    return pathname === `/search/${chatId}`
  }

  // Group chats by time period
  const todayChats = chats.filter((chat) => chat.period === "today")
  const weekChats = chats.filter((chat) => chat.period === "week")
  const monthChats = chats.filter((chat) => chat.period === "month")

  const ChatItem = ({ chat }: { chat: Chat }) => (
    <div
      className={cn(
        "group relative px-3 py-2 transition-colors rounded-md",
        isCollapsed
          ? "cursor-default"
          : cn("cursor-pointer", isActiveChat(chat.id) ? "bg-gray-200" : "hover:bg-gray-100"),
      )}
      onClick={() => handleChatClick(chat.id)}
    >
      <div className="flex items-center gap-2">
        {chat.isOnline && <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />}
        <span
          className={cn(
            "text-sm text-gray-700 truncate flex-1",
            !isCollapsed ? "block" : "hidden",
            isCollapsed && "pointer-events-none",
          )}
        >
          {chat.title}
        </span>
      </div>
    </div>
  )

  const SearchResultItem = ({ chat, query }: { chat: Chat; query: string }) => {
    const matchingMessage = chat.messages.find((message) => message.content.toLowerCase().includes(query.toLowerCase()))

    return (
      <div
        className={cn(
          "group relative px-3 py-2 cursor-pointer transition-colors rounded-md",
          isActiveChat(chat.id) ? "bg-gray-200" : "hover:bg-gray-100",
        )}
        onClick={() => handleChatClick(chat.id)}
      >
        <div className="flex items-center gap-2 mb-1">
          {chat.isOnline && <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />}
          <span className="text-sm font-medium text-gray-800 truncate flex-1">{chat.title}</span>
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 hover:bg-red-100"
            onClick={(e) => handleDeleteChat(chat.id, e)}
          >
            <Trash2 className="h-3 w-3 text-red-500" />
          </Button>
        </div>
        {matchingMessage && (
          <p className="text-xs text-gray-600 truncate ml-4">
            {matchingMessage.content.length > 50
              ? `${matchingMessage.content.substring(0, 50)}...`
              : matchingMessage.content}
          </p>
        )}
      </div>
    )
  }

  const SectionTitle = ({ title }: { title: string }) => (
    <div
      className={cn(
        "px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider",
        !isCollapsed ? "block" : "hidden",
      )}
    >
      {title}
    </div>
  )

  return (
    <>
      <div
        id="main-sidebar"
        data-sidebar
        data-state={isCollapsed ? "collapsed" : "expanded"}
        data-animating={isAnimating ? "true" : "false"}
        style={{
          transition: `${ANIMATION_PROPERTIES} ${ANIMATION_DURATION}ms ${ANIMATION_TIMING}`,
        }}
        className={cn(
          "fixed left-0 top-0 h-full bg-gray-50 border-r border-gray-300 flex flex-col z-40",
          isCollapsed ? "w-0 opacity-0 pointer-events-none" : "w-80 opacity-100",
        )}
      >
        {/* Header Actions */}
        <div className="p-4 space-y-2 border-b border-gray-200">
          <Button
            onClick={handleNewSearch}
            variant="ghost"
            className="w-full justify-start gap-3 text-gray-700 hover:bg-gray-200 h-10"
          >
            <Plus className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm">Новый поиск</span>
          </Button>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Поиск в моих чатах"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 bg-white border-gray-300 focus:border-gray-400 focus:ring-gray-400"
            />
          </div>
        </div>

        {/* Chat List or Search Results */}
        <ScrollArea className="flex-1">
          <div className="py-2">
            {isSearching ? (
              // Search Results
              <div>
                <SectionTitle title={`Результаты поиска (${searchResults.length})`} />
                <div className="space-y-1">
                  {searchResults.length > 0 ? (
                    searchResults.map((chat) => <SearchResultItem key={chat.id} chat={chat} query={searchQuery} />)
                  ) : (
                    <div className="px-3 py-4 text-center text-gray-500 text-sm">Ничего не найдено</div>
                  )}
                </div>
              </div>
            ) : (
              // Regular Chat List
              <>
                {/* Today Section */}
                {todayChats.length > 0 && (
                  <div className="mb-4">
                    <SectionTitle title="Сегодня" />
                    <div className="space-y-1">
                      {todayChats.map((chat) => (
                        <ChatItem key={chat.id} chat={chat} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Past 7 Days Section */}
                {weekChats.length > 0 && (
                  <div className="mb-4">
                    <SectionTitle title="Прошлые 7 дней" />
                    <div className="space-y-1">
                      {weekChats.map((chat) => (
                        <ChatItem key={chat.id} chat={chat} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Past 30 Days Section */}
                {monthChats.length > 0 && (
                  <div className="mb-4">
                    <SectionTitle title="Прошлые 30 дней" />
                    <div className="space-y-1">
                      {monthChats.map((chat) => (
                        <ChatItem key={chat.id} chat={chat} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </ScrollArea>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-200 space-y-3">
          {/* Senti Balance */}
          <div className="text-left">
            <span className="text-lg font-semibold text-purple-600">{balance.toLocaleString()} Senti</span>
          </div>

          {/* Separator Line */}
          <div className="border-t border-gray-300"></div>

          {/* Upgrade Plan Button */}
          <Button
            onClick={handleUpgradePlan}
            variant="ghost"
            className="w-full transition-all duration-200 hover:bg-gray-100 justify-start p-0 h-auto"
          >
            <div className="flex items-start gap-3 w-full text-left">
              <div className="w-8 h-8 rounded-full border-2 border-gray-400 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-gray-600 text-lg font-light">+</span>
              </div>
              <div className="flex-1">
                <div className="text-gray-900 font-medium text-base mb-1">Улучшить план</div>
                <div className="text-gray-500 text-sm">Больше доступа к силам Alura</div>
              </div>
            </div>
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить поиск?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Поиск и все связанные с ним сообщения будут удалены навсегда.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteChat} className="bg-red-600 hover:bg-red-700">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
