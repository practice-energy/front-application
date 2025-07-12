"use client"

import { useState } from "react"
import type { ChatItem } from "@/types/chats"

export function useSidebarSearch(allChats: ChatItem[]) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<ChatItem[]>([])
  const [isSearching, setIsSearching] = useState(false)

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

  return {
    searchQuery,
    searchResults,
    isSearching,
    handleSearch,
  }
}
