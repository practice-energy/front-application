"use client"
import { useRouter } from "next/navigation"
import { Mufi } from "@/components/mufi"
import Image from "next/image"
import { v4 as uuidv4 } from "uuid"
import type { Chat, Message } from "@/types/chats"
import { useAdeptChats } from "@/stores/chat-store"
import {IconPractice} from "@/components/icons/icon-practice";
import {MainMobileHeader} from "@/components/header/components/main-mobile-header";
import {useProfileStore} from "@/stores/profile-store";
import {useSidebar} from "@/contexts/sidebar-context";
import {useAuth} from "@/hooks/use-auth";
import {useIsMobile} from "@/hooks/use-mobile";
import {Button} from "@/components/ui/button";
import {PentagramIcon, UserSwitchIcon} from "@phosphor-icons/react";
import {IconPractice1} from "@/components/icons/practice-1-logo";
import {IconAlura} from "@/components/icons/icon-alura";
import {cn} from "@/lib/utils";
import {AuthButtons} from "@/components/auth-buttons";

export default function HomePage() {
  const router = useRouter()
  const { addChat, clearChats } = useAdeptChats()
  const { user } = useProfileStore()
  const {toggleSidebar, isCollapsed} = useSidebar()
  const {isAuthenticated, login} = useAuth()
  const isMobile = useIsMobile()

  if (user?.hat === "master") {
    router.push("/dashboard")
  }

  const handleSearch = (query: string, title = "Alura", files: File[] = [], isPractice?: boolean) => {
    const newChatId = uuidv4()
    const userMessage: Message = {
      id: uuidv4(),
      type: "user",
      content: query,
      timestamp: Date.now(),
      files: files,
    }

    const newChat: Chat = {
      id: newChatId,
      title: "Alura",
      timestamp: Date.now(),
      messages: [userMessage],
      isAI: true,
      hasNew: false,
      createdAt: Date.now(),
      isMuted: false,
      footerContent: "",
    }

    // Add chat to store
    addChat(newChat)

    // Navigate to the chat page
    router.push(`/search/${newChatId}`)
  }

  return (
    <div className="bg-white dark:bg-gray-900 transition-all duration-300">
      {isCollapsed && isMobile && isAuthenticated &&(
          <MainMobileHeader
              user={user}
              toggleSidebar={toggleSidebar}
              toggleProfileMenu={() => {router.push("/profile")}}
              isAuthenticated={isAuthenticated}
          />
      )}

      {!isAuthenticated && (<AuthButtons
          login={login}
          isMobile={isMobile}
      />)}

      {/* Скроллящийся контент с логотипом */}
      <div className={cn(
          isMobile ? "justify-center": "absolute top-1/3 left-1/2 text-center"
      )}>
        <IconPractice
            width={180}
            height={180}
            className={cn("mx-auto my-auto", isMobile && "h-screen")}
        />
      </div>

      {/* Mufi - абсолютно позиционирован, но в потоке контента */}
      <div className={cn(
          "absolute bottom-0 z-10",
          isMobile ? "w-full" : "w-[800px] left-[calc(50%-360px)]"
      )}>
        <Mufi onSearch={handleSearch} showHeading={true} chatTitle="Alura" showPractice={true}/>
      </div>
    </div>
  )
}
