"use client"

import { useState, useMemo } from "react"

interface Chat {
  id: string
  title: string
  description: string
  avatar?: string
  isAI: boolean
  isAIEnabled: boolean
  status?: string
  lastMessage?: {
    timestamp: Date
    content: string
  }
  lastReadTimestamp?: Date
}

export function useSidebarSearch(allChats: Chat[]) {
  const [searchQuery, setSearchQuery] = useState("")

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []

    return allChats.filter(
      (chat) =>
        chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [allChats, searchQuery])

  const isSearching = searchQuery.trim().length > 0

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  return {
    searchQuery,
    searchResults,
    isSearching,
    handleSearch,
  }
}
