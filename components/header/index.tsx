"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { PanelRightClose, CalendarDays } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/contexts/sidebar-context"

import { useHeaderState } from "./hooks/use-header-state"
import { Logo } from "./components/logo"
import { NavigationButtons } from "./components/navigation-buttons"
import { ProfileMenu } from "./components/profile-menu"
import { PentagramIcon, UserSwitchIcon } from "@phosphor-icons/react"
import { IconButton } from "@/components/icon-button"
import { useProfileStore } from "@/stores/profile-store"
import { EasyNotifications } from "@/components/easy-notifications"
import { useAdeptChats } from "@/stores/chat-store"
import { v4 as uuidv4 } from "uuid"

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isAuthenticated, logout, updateUser, login } = useAuth()
  const { user } = useProfileStore()
  const router = useRouter()
  const pathname = usePathname()
  const { isCollapsed, toggleSidebar } = useSidebar()
  const hat = user?.hat
  const { addChat } = useAdeptChats()

  const { showProfileMenu, setShowProfileMenu, profileMenuRef } = useHeaderState()

  const shouldShowSidebar = useMemo(() => {
    return isAuthenticated
  }, [isAuthenticated])

  const isSpecialist = useMemo(() => {
    return user?.isSpecialist || false
  }, [user?.isSpecialist])

  const isHomePage = pathname === "/"

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [profileMenuRef, setShowProfileMenu])

  const handleCalendarClick = () => {
    router.push("/calendar")
  }

  const handleLogout = () => {
    logout()
    setShowProfileMenu(false)
    setIsMobileMenuOpen(false)
    router.push("/")
  }

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu)
  }

  const handleBecomeSpecialist = () => {
    const chatId = uuidv4()
    const newChat = {
      id: chatId,
      title: "Стать мастером",
      isAI: true,
      isAIEnabled: true,
      isSpecialChat: "become-specialist" as const,
      timestamp: Date.now(),
      createdAt: Date.now(),
      messages: [
        {
          id: uuidv4(),
          type: "assistant" as const,
          content:
            "Добро пожаловать в процесс становления мастером! Для продолжения необходимо принять политику обработки данных.",
          timestamp: Date.now(),
          aiMessageType: "accept-policy" as const,
        },
      ],
    }

    addChat(newChat)
    router.push(`/chat/${chatId}`)
  }

  const handleRoleToggle = () => {
    const newHat = hat === "adept" ? "master" : "adept"
    updateUser({
      hat: newHat,
    })

    if (newHat === "master") {
      router.push("/dashboard")
    } else {
      router.push("/")
    }
  }

  const handleLogoClick = () => {
    if (hat === "master") {
      router.push("/dashboard")
    } else {
      router.push("/")
    }
  }

  const handleOpenSidebar = () => {
    if (isCollapsed) {
      toggleSidebar()
    }
  }

  console.log(user)

  return (
    <>
      <div>
        {/* Логотип - фиксированная позиция */}
        {!isHomePage && <Logo onClick={handleLogoClick} />}
      </div>

      {/* Правая секция */}
      <div
        className="items-center justify-end space-x-3 py-4 pr-3 flex animate-none z-50 fixed"
        style={{
          position: "fixed",
          right: "10px",
          top: "0px",
          zIndex: 60,
        }}
      >
        <div className="flex items-center gap-[24px]">
          {isAuthenticated && !user?.isSpecialist && <Button onClick={handleBecomeSpecialist}>Стать мастером</Button>}

          {isAuthenticated && hat === "adept" && (
            <IconButton
              icon={CalendarDays}
              onClick={handleCalendarClick}
              disabled={false}
              className={cn(pathname === "/calendar" && "  bg-violet-600 border-0 shadow-md")}
              iconClassName={cn(pathname === "/calendar" && " text-white")}
            />
          )}

          <NavigationButtons isAuthenticated={isAuthenticated} hat={hat} router={router} />

          {isAuthenticated && (
            <>
              {/* User likes icon */}
              <IconButton icon={PentagramIcon} onClick={() => {}} disabled={true} />

              {/* User switch icon */}
              <IconButton icon={UserSwitchIcon} onClick={handleRoleToggle} disabled={false} />

              <ProfileMenu
                isAuthenticated={isAuthenticated}
                user={user}
                showProfileMenu={showProfileMenu}
                toggleProfileMenu={toggleProfileMenu}
                setShowProfileMenu={setShowProfileMenu}
                handleLogout={handleLogout}
                handleRoleToggle={handleRoleToggle}
                isSpecialist={isSpecialist}
              />

              <EasyNotifications hat={user?.hat || "adept"} />
            </>
          )}

          {!isAuthenticated && (
            <button
              onClick={() => {
                login()
              }}
            >
              <div className="flex flex-row gap-2 items-center border border-gray-200 px-3 rounded-sm p-2 bg-white shadow-sm shadow-violet-50 ml-auto">
                <div className="font-medium">Инициировать практис</div>
                <PentagramIcon size={36} />
              </div>
            </button>
          )}
        </div>
      </div>

      <header
        className={cn(
          "top-0 z-50 h-24 bg-background bg-opacity-70 backdrop-blur-lg opacity-80 fixed items-end",
          isCollapsed ? "w-full" : "w-[calc(100%-400px)]",
        )}
      >
        {/* Кнопка сайдбара - фиксированная позиция */}
        {shouldShowSidebar && (
          <button
            onClick={handleOpenSidebar}
            className={cn("h-full px-3 flex items-center", !isCollapsed && "opacity-0 pointer-events-none")}
            style={{
              position: "fixed",
              top: "0",
              left: isHomePage ? "30px" : "340px",
              zIndex: 60,
            }}
          >
            <PanelRightClose width={24} height={24} />
          </button>
        )}
      </header>
    </>
  )
}
