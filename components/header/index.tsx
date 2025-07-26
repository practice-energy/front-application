"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import {X, PanelRightClose, CalendarDays, CheckSquare, MessageSquareText, PentagonIcon} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter, usePathname } from "next/navigation"
import { AuthModal } from "@/components/modals/auth-modal"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/contexts/sidebar-context"

import { useHeaderState } from "./hooks/use-header-state"
import { Logo } from "./components/logo"
import { NavigationButtons } from "./components/navigation-buttons"
import { ProfileMenu } from "./components/profile-menu"
import { MobileMenu } from "./components/mobile-menu"
import { NotificationSystem } from "@/components/notification-system"
import {PentagramIcon, UserSwitchIcon} from "@phosphor-icons/react";
import {IconButton} from "@/components/icon-button";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const { isAuthenticated, user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const { isCollapsed, toggleSidebar } = useSidebar()

  const {
    showProfileMenu,
    setShowProfileMenu,
    profileMenuRef,
    hat,
    setHat,
  } = useHeaderState()

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

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false)
  }

  const openAuthModal = (mode: "login" | "signup" = "login") => {
    setAuthMode(mode)
    setIsAuthModalOpen(true)
    setIsMobileMenuOpen(false)
  }

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
    router.push("/become-specialist")
  }

  const handleRoleToggle = () => {
    if (hat === "adept") {
      setHat("master")
      router.push("/")
    } else {
      setHat("adept")
      router.push("/dashboard")
    }
    setShowProfileMenu(false)
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
        {pathname !== "/" && (
            <Logo onClick={handleLogoClick} />
        )}
      </div>

      {/* Правая секция */}
      <div className="items-center justify-end space-x-3 py-4 pr-3 flex animate-none z-50 fixed"
           style={{
             position: "fixed",
             right: "10px",
             top: "0px",
             zIndex: 60,
           }}
      >
        <div className="flex items-center gap-[24px]">
          {isAuthenticated && !user?.isSpecialist && (
              <Button
                  onClick={handleBecomeSpecialist}
              >Стать мастером
              </Button>
          )}

          {isAuthenticated && hat === "adept" && (
              <IconButton
                  icon={CalendarDays}
                  onClick={handleCalendarClick}
                  disabled={false}
                  className={cn(
                      pathname === "/calendar" && " bg-violet-600",
                  )}
                  iconClassName={cn(
                      pathname === "/calendar" && " text-white",
                  )}
              />
          )}

          <NavigationButtons isAuthenticated={isAuthenticated} hat={hat} router={router} />

          {/* User likes icon */}
          <IconButton
              icon={PentagramIcon}
              onClick={()=> {}}
              disabled={true}
          />

          {/* User switch icon */}
          <IconButton
              icon={UserSwitchIcon}
              onClick={handleRoleToggle}
              disabled={false}
          />

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
          {isAuthenticated && <NotificationSystem />}
        </div>
      </div>

      <header
        className={cn(
          "top-0 z-50 h-24 bg-background bg-opacity-70 backdrop-blur-lg opacity-80 fixed",
            isCollapsed ? "w-full": "w-[calc(100%-400px)]"
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
              left: "340px",
              zIndex: 60,
            }}
          >
            <PanelRightClose width={24} height={24} />
          </button>
        )}

        {!isAuthenticated && <Button onClick={() => openAuthModal("login")}>Инициировать практис</Button>}
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        initialMode={authMode}
        mode={"login"}
      />
    </>
  )
}
