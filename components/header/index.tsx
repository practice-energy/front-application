"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { X, PanelRightClose, CalendarDays } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useTranslations } from "@/hooks/use-translations"
import { useRouter } from "next/navigation"
import { AuthModal } from "@/components/auth-modal"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/contexts/sidebar-context"

import { useHeaderState } from "./hooks/use-header-state"
import { Logo } from "./components/logo"
import { NavigationButtons } from "./components/navigation-buttons"
import { ProfileMenu } from "./components/profile-menu"
import { BurgerMenu } from "./components/burger-menu"
import { MobileMenu } from "./components/mobile-menu"
import { UserSwitch } from "@/components/icons/icon-user-switch"

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const { isAuthenticated, user, logout } = useAuth()
  const { language, changeLanguage } = useTranslations()
  const router = useRouter()
  const { isCollapsed, toggleSidebar } = useSidebar()

  const {
    isLanguageSwitching,
    setIsLanguageSwitching,
    showBurgerMenu,
    setShowBurgerMenu,
    showProfileMenu,
    setShowProfileMenu,
    role,
    setRole,
    burgerMenuRef,
    profileMenuRef,
  } = useHeaderState(user)

  const shouldShowSidebar = useMemo(() => {
    return isAuthenticated
  }, [isAuthenticated])

  const isSpecialist = useMemo(() => {
    return user?.isSpecialist || false
  }, [user?.isSpecialist])

  useEffect(() => {
    setRole(user?.isSpecialist ? "specialist" : "user")
  }, [user?.isSpecialist, setRole])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (burgerMenuRef.current && !burgerMenuRef.current.contains(event.target as Node)) {
        setShowBurgerMenu(false)
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [burgerMenuRef, profileMenuRef, setShowBurgerMenu, setShowProfileMenu])

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false)
  }

  const openAuthModal = (mode: "login" | "signup" = "login") => {
    setAuthMode(mode)
    setIsAuthModalOpen(true)
    setShowBurgerMenu(false)
    setIsMobileMenuOpen(false)
  }

  const handleCalendarClick = () => {
    router.push("/profile?section=calendar")
  }

  const handleLogout = () => {
    logout()
    setShowBurgerMenu(false)
    setShowProfileMenu(false)
    setIsMobileMenuOpen(false)
    router.push("/")
  }

  const toggleBurgerMenu = () => {
    setShowBurgerMenu(!showBurgerMenu)
    setShowProfileMenu(false)
  }

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu)
    setShowBurgerMenu(false)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    setShowBurgerMenu(false)
    setShowProfileMenu(false)
  }

  const handleBecomeSpecialist = () => {
    router.push("/become-specialist")
  }

  const handleRoleToggle = () => {
    if (role === "specialist") {
      setRole("user")
      router.push("/")
    } else {
      setRole("specialist")
      router.push("/specialist-dashboard")
    }
    setShowProfileMenu(false)
  }

  const handleLogoClick = () => {
    if (role === "specialist") {
      router.push("/specialist-dashboard")
    } else {
      router.push("/")
    }
  }

  const handleOpenSidebar = () => {
    if (isCollapsed) {
      toggleSidebar()
    }
  }

  return (
    <>
      <header className="sticky top-0 z-50 h-21 w-full border-b bg-background backdrop-blur-lg dark:border-gray-800">
        <nav className="container mx-auto px-4">
          <div className="flex h-21 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Logo onClick={handleLogoClick} />

              {/* Кнопка panel-right-close - исчезает при развернутом сайдбаре */}
              {shouldShowSidebar && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleOpenSidebar}
                  className={cn(
                    "h-8 w-8 transition-all duration-300 ease-in-out rounded-sm",
                    !isCollapsed ? "opacity-0 pointer-events-none scale-95" : "opacity-100 scale-100",
                  )}
                >
                  <PanelRightClose className="h-4 w-4" />
                  <span className="sr-only">Открыть сайдбар</span>
                </Button>
              )}

              <NavigationButtons isAuthenticated={isAuthenticated} role={role} router={router} />
            </div>

            {/* Desktop Right side */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated && user?.specialistProfile === null && (
                <Button
                  onClick={handleBecomeSpecialist}
                  className="bg-white dark:bg-gray-800
    hover:bg-violet-50 dark:hover:bg-violet-700
    active:bg-violet-600 dark:active:bg-violet-600
    active:hover:bg-violet-700 dark:hover:active:bg-violet-600
    text-gray-900 dark:text-white
    active:text-white dark:active:text-white
    active:border-violet-600 dark:active:border-violet-600
    px-3 py-2 h-9 font-medium
    transition-colors duration-200
    flex items-center gap-1
    group border"
                >
                  Стать мастером
                </Button>
              )}

              {/* Role toggle button moved here */}
              {isAuthenticated && user?.specialistProfile !== null && (
                <Button
                  onClick={handleRoleToggle}
                  type="button"
                  size="sm"
                  className="
    bg-white dark:bg-gray-800
    hover:bg-violet-50 dark:hover:bg-violet-700
    active:bg-violet-600 dark:active:bg-violet-600
    active:hover:bg-violet-700 dark:hover:active:bg-violet-600
    text-gray-900 dark:text-white
    active:text-white dark:active:text-white
    active:border-violet-600 dark:active:border-violet-600
    px-3 py-2 h-9 font-medium
    transition-colors duration-200
    flex items-center gap-1
    group border"
                >
                  <UserSwitch className="h-21 w-21" />
                  {role === "specialist" ? "Инициант" : "Мастер"}
                </Button>
              )}

              {/* Calendar button for users */}
              {role === "user" && (
                <div className="hidden md:flex items-center space-x-2 ml-4">
                  <Button
                    onClick={handleCalendarClick}
                    className="bg-white dark:bg-gray-800 hover:bg-violet-50 dark:hover:bg-violet-700 active:bg-violet-600 dark:active:bg-violet-600 active:hover:bg-violet-700 dark:hover:active:bg-violet-600 text-gray-900 dark:text-white active:text-white dark:active:text-white active:border-violet-600 dark:active:border-violet-600 px-3 py-2 h-9 font-medium transition-colors duration-200 flex items-center gap-1 border border-gray-200 dark:border-gray-700"
                  >
                    <CalendarDays className="h-4 w-4" />
                    <span className="sr-only">Календарь</span>
                  </Button>
                </div>
              )}

              <ProfileMenu
                isAuthenticated={isAuthenticated}
                user={user}
                showProfileMenu={showProfileMenu}
                toggleProfileMenu={toggleProfileMenu}
                setShowProfileMenu={setShowProfileMenu}
                profileMenuRef={profileMenuRef}
                handleLogout={handleLogout}
              />

              <BurgerMenu
                isAuthenticated={isAuthenticated}
                showBurgerMenu={showBurgerMenu}
                toggleBurgerMenu={toggleBurgerMenu}
                setShowBurgerMenu={setShowBurgerMenu}
                burgerMenuRef={burgerMenuRef}
              />

              {/*{isAuthenticated && <NotificationSystem />}*/}

              {!isAuthenticated && (
                <Button
                  onClick={() => openAuthModal("login")}
                  className="h-8 px-4 text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white transition-colors rounded-sm"
                >
                  Log in / Register
                </Button>
              )}
            </div>

            {/* Mobile hamburger menu button */}
            <div className="md:hidden">
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <ProfileMenu
                  isAuthenticated={isAuthenticated}
                  user={user}
                  showProfileMenu={showProfileMenu}
                  toggleProfileMenu={toggleProfileMenu}
                  setShowProfileMenu={setShowProfileMenu}
                  profileMenuRef={profileMenuRef}
                  handleLogout={handleLogout}
                  isMobile={true}
                />
              )}
            </div>
          </div>

          <MobileMenu
            isMobileMenuOpen={isMobileMenuOpen}
            isAuthenticated={isAuthenticated}
            user={user}
            role={role}
            isSpecialist={isSpecialist}
            handleRoleToggle={handleRoleToggle}
            setShowProfileMenu={setShowProfileMenu}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            handleLogout={handleLogout}
            openAuthModal={openAuthModal}
          />
        </nav>
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
