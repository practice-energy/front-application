import { useState, useEffect, useCallback } from "react";
import type { Chat, Message } from "@/types/chats";

export function useSidebarSearch(allChats: Chat[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Chat[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Основная функция поиска
  const performSearch = useCallback((query: string, chats: Chat[]) => {
    if (!query.trim()) {
      return [];
    }

    const lowerQuery = query.toLowerCase();

    return chats.filter(chat => {
      // Проверяем заголовок
      if (chat.title.toLowerCase().includes(lowerQuery)) {
        return true;
      }

      // Проверяем описание (если есть)
      if (chat.description && chat.description.toLowerCase().includes(lowerQuery)) {
        return true;
      }

      // Проверяем сообщения
      return chat.messages.some(message =>
          message.content.toLowerCase().includes(lowerQuery)
      );
    });
  }, []);

  // Эффект для выполнения поиска с debounce
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    const timer = setTimeout(() => {
      const results = performSearch(searchQuery, allChats);
      setSearchResults(results);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, allChats, performSearch]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return {
    searchQuery,
    searchResults,
    isSearching,
    handleSearch,
  };
}