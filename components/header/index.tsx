"use client"

import { useState, useEffect, useMemo } from "react"
import {
  PanelRightClose, PanelRightOpen,
  SlidersVerticalIcon,
} from 'lucide-react'
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
import {useAdeptChats, useBecomeSpecialist, useMasterChats} from "@/stores/chat-store"
import { v4 as uuidv4 } from "uuid"
import {messageInitMaster} from "@/components/become-specialist/messages";
import RomanStep from "@/components/roman-step";
import {useIsMobile} from "@/hooks/use-mobile";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isAuthenticated, logout, updateUser } = useAuth()
  const { user, setUser } = useProfileStore()
  const router = useRouter()
  const pathname = usePathname()
  const { isCollapsed, toggleSidebar } = useSidebar()
  const hat = user?.hat
  const { addChat } = useMasterChats()
  const { chats } = user?.hat === "master" ? useMasterChats() : useAdeptChats()
  const {
    state: becomeSpecialistState,
    setStep: setBecomeSpecialistStep,
    setChatId: setBecomeSpecialistChatId,
    resetState: resetBecomeSpecialistState,
  } = useBecomeSpecialist()
  const isMobile = useIsMobile()

  if (isMobile) {
    return null
  }

  const { showProfileMenu, setShowProfileMenu, profileMenuRef } = useHeaderState()

  const isSpecialist = useMemo(() => {
    return user?.isSpecialist || false
  }, [user?.isSpecialist])

  const handleChatsClick = () => {
    router.push(`/search/${chats.length > 0 ? chats[0].id : uuidv4()}`)
  }

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
    updateUser({
      hat: "master",
      isSpecialist: true,
    })

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
        messageInitMaster,
      ],
    }

    setBecomeSpecialistChatId(chatId)

    addChat(newChat)
    router.push(`/search/${chatId}`)
  }

  const handleRoleToggle = () => {
    const newHat = hat === "adept" ? "master" : "adept"
    updateUser({
      hat: newHat,
    })

    if (newHat === "master") {
      if (becomeSpecialistState.chatId !== null) {
        router.push("/search/" + becomeSpecialistState.chatId)
      }

      if (!isMobile) {
        router.push("/dashboard")
      }
    } else {
      router.push("/")
    }
  }

  const handleLogoClick = () => {
    if (hat === "master" && !isMobile) {
      if (becomeSpecialistState.chatId !== null) {
        router.push("/search/" + becomeSpecialistState.chatId)
      }

      router.push("/dashboard")
    }

    router.push("/")
  }

  const handleOpenSidebar = () => {
    if (isCollapsed) {
      toggleSidebar()
    }
  }

  const isBecomeSpecialist = pathname === `/search/${becomeSpecialistState.chatId}`

  return (
    <header className="fixed top-0 h-[66px] w-full z-30 bg-white/70">
      {/* Кнопка сайдбара - фиксированная позиция */}
      <div
          className="items-center ml-[360px] gap-3 flex flex-row h-full justify-start "
          style={{
            zIndex: 60
          }}
      >
        <IconButton
            onClick={handleOpenSidebar}
            className={cn(
                "rounded-sm hover:bg-none border border-gray-200  w-[30px] h-[30px] items-center justify-center  transition-all duration-300 ease-in-out",
                // !isCollapsed && "opacity-0 pointer-events-none"
                )}
            icon={PanelRightClose}
        />

        <div
            className="fixed left-0 shadow-sm items-center border bg-white rounded-sm gap-2 flex flex-row px-1 py-0"
            style={{
              zIndex: 60,
              left: 416,
              position: "fixed",
            }}
        >
          <Logo onClick={handleLogoClick} />
          <div className="flex items-center font-semibold text-base text-neutral-900">
            {user?.practice || 999}
          </div>
        </div>
      </div>

      {/* Правая секция */}
      <div
        className="items-center justify-end flex animate-none z-50"
        style={{
          position: "fixed",
          right: "30px",
          top: "0px",
          zIndex: 60,
        }}
      >
        <div className="flex items-center gap-[24px]">
          {/*{isAuthenticated && !user?.isSpecialist && (*/}
          {/*  <button*/}
          {/*    className="bg-colors-custom-accent border-0 shadow-md text-white gap-2 px-4 rounded-sm flex flex-row items-center justify-center py-1"*/}
          {/*    onClick={handleBecomeSpecialist}*/}
          {/*  >*/}
          {/*    <div className="font-medium"> Стать мастером</div>*/}
          {/*    <UserSwitchIcon size={36} />*/}
          {/*  </button>*/}
          {/*)}*/}

          {isBecomeSpecialist ? (
              <>
              {/* Content without opacity */}
              <div className="relative z-10 flex flex-row items-center px-3 py-4 gap-3">
                {becomeSpecialistState.step === 1 && (
                    <RomanStep step={1}/>
                )}
                {(becomeSpecialistState.step === 2 || becomeSpecialistState.step === 3) && (
                    <RomanStep step={2}/>
                )}
                {becomeSpecialistState.step === 4 && (
                    <RomanStep step={3}/>
                )}
                <div className="text-base font-semibold pr-3">Инициация Мастера</div>
                <PentagramIcon
                    size={36} className="text-white bg-colors-custom-accent rounded-sm p-1"
                />
              </div>
              </>
              ) : (
              <NavigationButtons
                  isAuthenticated={isAuthenticated}
                  isBecomeSpecialist={isBecomeSpecialist}
                  hat={hat}
                  router={router}
                  onChatsClick={handleChatsClick}
              />
          )}

          {isAuthenticated && !isBecomeSpecialist
              && user?.hat === "master"
              && (
                  <div className={cn(
                      "hidden md:flex items-center justify-center",
                      "aspect-square rounded-sm shadow-sm h-10 p-1 border border-neutral-100",
                  )}>
                    <div
                        className="w-full h-full flex items-center justify-center text-colors-custom-accent gap-3"
                    >
                      <PentagramIcon size={30} className={cn(
                          "h-[30px] w-[30px] ",
                      )} />
                      <div className="font-semibold text-base">{user?.specialistProfile?.likes || 0}</div>
                    </div>
                  </div>
          )}

          {isAuthenticated && (
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
          )}

          {/* User switch icon */}
          {!isBecomeSpecialist &&(
              <IconButton
                  icon={UserSwitchIcon}
                  onClick={handleRoleToggle}
                  disabled={false}
                  iconClassName={user?.hat === "adept" ? "text-colors-custom-accent" : ""}
              />
          )}

          {!isBecomeSpecialist && (<IconButton icon={SlidersVerticalIcon} onClick={() => {}} disabled={false} />)}
        </div>
      </div>
    </header>
  )
}
