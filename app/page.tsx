"use client"
import { useRouter } from "next/navigation"
import { SearchBar } from "@/components/search-bar/index"
import Image from "next/image"
import { v4 as uuidv4 } from "uuid"
import type { Chat, Message } from "@/types/chats"
import { mockChatData } from "@/services/mock-data"

export default function HomePage() {
  const router = useRouter()

  const handleSearch = (query: string, title = "Аллюра", files: File[] = [], isPractice?: boolean) => {
    const searchId = uuidv4()

    const userMessage: Message = {
      id: uuidv4(),
      type: "user",
      content: query,
      timestamp: Date.now(),
      files: files,
    }

    const newChat: Chat = {
      id: searchId,
      title: "Аллюра",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      messages: [userMessage],
      searchQueries: [query],
      isAi: false,
      hasNew: true,
      createdAt: Date.now(),
    }

    window.dispatchEvent(
        new CustomEvent("addNewChatToSidebar", {
          detail: {
            chat: {
              ...newChat,
              description: query,
              isPractice: isPractice,
            },
          },
        }),
    )

    router.push(`/search/${searchId}`)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 flex flex-col">
      <main className="flex-grow relative flex flex-col justify-end pb-80">
        {/* Общий контейнер для логотипа и поиска */}
        <div className="relative px-4 sm:px-6 lg:px-8">
          {/* Увеличенный логотип с отступом снизу */}
          <div className="max-w-4xl mx-auto text-center">
            <Image
              src="/practice-logo.svg"
              alt="Practice Logo"
              width={180} // Увеличено с 120 до 180
              height={180} // Увеличено с 120 до 180
              className="mx-auto"
              priority
            />
          </div>

          {/* Контейнер для поиска - теперь ниже логотипа */}
          <div className="max-w-4xl mx-auto mb-24">
            <SearchBar onSearch={handleSearch} showHeading={true} chatTitle="Аллюра" />
          </div>
        </div>
      </main>
    </div>
  )
}
