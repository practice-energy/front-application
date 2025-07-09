"use client"

import { useState, useMemo } from "react"
import type { Chat } from "../types/sidebar.types"

export function useSidebarSearch(allChats: Chat[]) {
  const [searchQuery, setSearchQuery] = useState("")

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []

    const query = searchQuery.toLowerCase()
    return allChats.filter(
      (chat) => chat.title.toLowerCase().includes(query) || chat.description.toLowerCase().includes(query),
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
