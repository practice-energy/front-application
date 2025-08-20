"use client"
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation"
import { Mufi } from "@/components/mufi"
import type { Chat, Message } from "@/types/chats"
import {useAdeptChats, useBecomeSpecialist, useMasterChats} from "@/stores/chat-store"
import { IconPractice } from "@/components/icons/icon-practice";
import { MainMobileHeader } from "@/components/header/components/main-mobile-header";
import { useProfileStore } from "@/stores/profile-store";
import { useSidebar } from "@/contexts/sidebar-context";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { AuthButtons } from "@/components/auth-buttons";
import { initiationMessageValid, initiationMessageInvalid } from "@/components/become-specialist/messages";
import {v4 as uuidv4} from "uuid";

export default function HomePage() {
  const router = useRouter()
  const { addChat, chats: adeptChats } = useAdeptChats()
  const { user } = useProfileStore()
  const { toggleSidebar, isCollapsed } = useSidebar()
  const { isAuthenticated, login } = useAuth()
  const isMobile = useIsMobile()
  const {state: becomeSpecialistState }= useBecomeSpecialist()

  const [showAuth, setShowAuth] = useState(true);
  const [showMufi, setShowMufi] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [validEmailEntered, setValidEmailEntered] = useState(false);

  if (user?.hat === "master") {
    if (becomeSpecialistState.chatId !== null) {
      router.push("/search/" + becomeSpecialistState.chatId)
    }

    if (!isMobile) {
      router.push("/dashboard")
    }
  }

  const handleAuthClick = () => {
    setTransitioning(true);
    setShowAuth(false);
    setTimeout(() => {
      setShowMufi(true);
      setTransitioning(false);
    }, 300);
  };

  const validateEmail = (email: string): boolean => {
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (!email || typeof email !== 'string') return false;
    if (email.length > 254) return false;

    const parts = email.split('@');
    if (parts.length !== 2) return false;

    const domain = parts[1];
    if (!domain.includes('.')) return false;
    if (domain.length > 63) return false;

    return re.test(email);
  };

  const handlePushOnPage = (input: string) => {
    const isValid = validateEmail(input);
    if (isValid) {
      setValidEmailEntered(true);
      // Вызываем login через 1 секунду после валидации email
      setTimeout(() => {
        login();
      }, 1000);
    }
    return isValid ? initiationMessageValid : initiationMessageInvalid;
  };

  useEffect(() => {
    // Если email был валидирован и пользователь аутентифицирован, скрываем Mufi
    if (validEmailEntered && isAuthenticated) {
      setShowMufi(false);
    }
  }, [validEmailEntered, isAuthenticated]);

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
    }

    addChat(newChat)
    router.push(`/search/${newChatId}`)
  }

  if (isAuthenticated) {
    if (user?.hat === "master") {
      router.push("/dashboard")
    }

    if (adeptChats.length === 0) {
      router.push(`/search/${uuidv4()}`)
    }

    router.push(`/search/${adeptChats[0]?.id}`)
  }

  return (
      <div className="transition-all duration-300 min-h-screen flex flex-col">
        {isCollapsed && isMobile && isAuthenticated && (
            <MainMobileHeader
                user={user}
                toggleSidebar={toggleSidebar}
                toggleProfileMenu={() => { router.push("/profile") }}
                isAuthenticated={isAuthenticated}
            />
        )}

        <main className="flex-1 flex flex-col items-center justify-center">
          {(isAuthenticated || transitioning) && (
              <div className={`flex items-center justify-center transition-opacity duration-600 ${showMufi ? 'opacity-100' : 'opacity-0'}`}>
                <IconPractice
                    width={180}
                    height={180}
                    className="mx-auto"
                />
              </div>
          )}

          {!isAuthenticated && !validEmailEntered && (
              <div className={`w-full max-w-md px-4 transition-opacity duration-600 ${showAuth ? 'opacity-100' : 'opacity-0'}`}>
                <AuthButtons
                    login={handleAuthClick}
                    isMobile={isMobile}
                />
              </div>
          )}

          <div className={cn(
              isMobile ? "fixed bottom-2 px-1 w-full" : "absolute items-center w-[800px] left-[calc(50%-400px)]",
              `transition-opacity duration-300 ${showMufi ? 'opacity-100' : 'opacity-0'}`
          )}>
            {showMufi && (
                <Mufi
                    onSearch={handleSearch}
                    placeholder={isAuthenticated ? "Alura" : "Введите email"}
                    showPractice={true}
                    isOnPage={!isAuthenticated}
                    disableFileApply={true}
                    onPushOnPage={handlePushOnPage}
                    isMobile={isMobile}
                />
            )}
          </div>
        </main>
      </div>
  )
}
