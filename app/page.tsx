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
      <div className="bg-white transition-all duration-300 min-h-screen flex flex-col">
        {isCollapsed && isMobile && isAuthenticated &&(
            <MainMobileHeader
                user={user}
                toggleSidebar={toggleSidebar}
                toggleProfileMenu={() => {router.push("/profile")}}
                isAuthenticated={isAuthenticated}
            />

        )}

        <main className="flex-1 flex flex-col items-center justify-center">
          {!isAuthenticated ? (
              <div className="w-full max-w-md px-4">
                <AuthButtons
                    login={login}
                    isMobile={isMobile}
                />
              </div>
          ) : (
              <>
                <div className={cn(
                    "flex items-center justify-center",
                    isMobile ? "h-screen" : "h-auto"
                )}>
                  <IconPractice
                      width={180}
                      height={180}
                      className="mx-auto"
                  />
                </div>

                {/* Mufi - абсолютно позиционирован, но в потоке контента */}
                <div className={cn(
                    isMobile ? "fixed bottom-0 w-full" : "absolute bottom-0 w-[800px] left-[calc(50%-400px)]"
                )}>
                  <Mufi onSearch={handleSearch} chatTitle="Alura" showPractice={true}/>
                </div>
              </>
          )}
        </main>
      </div>
  )
}