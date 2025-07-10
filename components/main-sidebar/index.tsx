"use client"

import { useState, useEffect } from "react"
import { X, Search, MessageSquarePlus, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/contexts/sidebar-context"
import { useAuth } from "@/hooks/use-auth"
import { useSidebarData } from "./hooks/use-sidebar-data"
import { useSidebarSearch } from "./hooks/use-sidebar-search"
import { SectionHeader } from "./components/section-header"
import { SectionContent } from "./components/section-content"
import { ChatItem } from "./components/chat-item"
import { SearchResultItem } from "./components/search-result-item"
import type { Chat } from "./types/sidebar.types"

export function MainSidebar() {
  const { isCollapsed, toggleSidebar } = useSidebar()
  const { isAuthenticated } = useAuth()
  const [activeChat, setActiveChat] = useState<string | null>(null)

  const { chats, specialists, bookings, isLoading, error, refreshData } = useSidebarData()

  const { searchQuery, setSearchQuery, searchResults, isSearching, clearSearch } = useSidebarSearch({
    chats,
    specialists,
  })

  useEffect(() => {
    if (isAuthenticated) {
      refreshData()
    }
  }, [isAuthenticated, refreshData])

  const handleChatClick = (chatId: string) => {
    if (!isCollapsed) {
      setActiveChat(chatId)
      // Navigate to chat
      console.log("Navigate to chat:", chatId)
    }
  }

  const handleNewChat = () => {
    if (!isCollapsed) {
      console.log("Create new chat")
    }
  }

  const handleSettings = () => {
    if (!isCollapsed) {
      console.log("Open settings")
    }
  }

  const isActiveChat = (chatId: string) => activeChat === chatId

  const hasNewMessages = (chat: Chat) => {
    return chat.unreadCount > 0
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-[330px]",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        {!isCollapsed && <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Чаты</h2>}
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="h-8 w-8 rounded-sm">
          {isCollapsed ? <MessageSquarePlus className="h-4 w-4" /> : <X className="h-4 w-4" />}
          <span className="sr-only">{isCollapsed ? "Развернуть сайдбар" : "Свернуть сайдбар"}</span>
        </Button>
      </div>

      {/* Search */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Поиск чатов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-9"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <ScrollArea className="flex-1 h-[calc(100vh-140px)]">
        <div className="p-2">
          {!isCollapsed && searchQuery ? (
            // Search Results
            <div className="space-y-1">
              {isSearching ? (
                <div className="p-4 text-center text-gray-500">Поиск...</div>
              ) : searchResults.length > 0 ? (
                searchResults.map((result) => (
                  <SearchResultItem
                    key={`${result.type}-${result.id}`}
                    result={result}
                    onClick={() => {
                      if (result.type === "chat") {
                        handleChatClick(result.id)
                      }
                    }}
                  />
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">Ничего не найдено</div>
              )}
            </div>
          ) : (
            // Regular Content
            <div className="space-y-4">
              {/* New Chat Button */}
              {!isCollapsed && (
                <Button
                  onClick={handleNewChat}
                  className="w-full justify-start gap-2 h-10 bg-transparent"
                  variant="outline"
                >
                  <MessageSquarePlus className="h-4 w-4" />
                  Новый чат
                </Button>
              )}

              {/* Recent Chats */}
              <div>
                <SectionHeader title="Недавние" isCollapsed={isCollapsed} />
                <SectionContent isCollapsed={isCollapsed}>
                  {chats
                    .filter((chat) => chat.isRecent)
                    .map((chat) => (
                      <ChatItem
                        key={chat.id}
                        chat={chat}
                        onChatClick={handleChatClick}
                        isActiveChat={isActiveChat}
                        hasNewMessages={hasNewMessages}
                        isCollapsed={isCollapsed}
                        isMobile={false}
                      />
                    ))}
                </SectionContent>
              </div>

              {/* All Chats */}
              <div>
                <SectionHeader title="Все чаты" isCollapsed={isCollapsed} />
                <SectionContent isCollapsed={isCollapsed}>
                  {chats
                    .filter((chat) => !chat.isRecent)
                    .map((chat) => (
                      <ChatItem
                        key={chat.id}
                        chat={chat}
                        onChatClick={handleChatClick}
                        isActiveChat={isActiveChat}
                        hasNewMessages={hasNewMessages}
                        isCollapsed={isCollapsed}
                        isMobile={false}
                      />
                    ))}
                </SectionContent>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <Button variant="ghost" onClick={handleSettings} className="w-full justify-start gap-2 h-10">
            <Settings className="h-4 w-4" />
            Настройки
          </Button>
        </div>
      )}
    </div>
  )
}
