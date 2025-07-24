"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { X, PanelRightClose, CalendarDays } from "lucide-react"
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

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const { isAuthenticated, user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const { isCollapsed, toggleSidebar } = useSidebar()

  const {
    showBurgerMenu,
    setShowBurgerMenu,
    showProfileMenu,
    setShowProfileMenu,
    role,
    setRole,
    burgerMenuRef,
    profileMenuRef,
    hat,
    setHat,
  } = useHeaderState(user)

  const shouldShowSidebar = useMemo(() => {
    return isAuthenticated
  }, [isAuthenticated])

  const isSpecialist = useMemo(() => {
    return user?.isSpecialist || false
  }, [user?.isSpecialist])

  const isHomePage = pathname === "/"

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
    router.push("/calendar")
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
    if (hat === "adept") {
      setHat("master")
      router.push("/")
    } else {
      setHat("adept")
      router.push("/specialist-dashboard")
    }
    setShowProfileMenu(false)
  }

  const handleLogoClick = () => {
    if (hat === "master") {
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

  const isSticky = pathname === "/" || pathname?.startsWith("/search/")

  return (
    <>
      <header
        className={cn(
          "top-0 z-50 h-24 w-full border-b bg-background bg-opacity-70 backdrop-blur-lg opacity-80",
          isSticky && "sticky",
        )}
      >
        <nav className="h-full w-full">
          <div className="flex h-full items-center">
            {/* Кнопка сайдбара - фиксированная позиция */}
            {shouldShowSidebar && (
              <button
                onClick={handleOpenSidebar}
                className={cn("h-full px-3 flex items-center", !isCollapsed && "opacity-0 pointer-events-none")}
                style={{
                  position: "fixed",
                  left: "364px",
                  zIndex: 60,
                }}
              >
                <PanelRightClose width={24} height={24} />
              </button>
            )}

            {/* Логотип - фиксированная позиция */}
            {pathname !== "/" && (
              <div
                style={{
                  position: "fixed",
                  left: "420px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 60,
                }}
              >
                <Logo onClick={handleLogoClick} />
              </div>
            )}

            {/* Правая секция - абсолютное позиционирование */}
            <div className="hidden md:flex items-center space-x-3 absolute right-3 top-1/2 transform -translate-y-1/2">
              {isAuthenticated && !user?.isSpecialist && (
                <Button onClick={handleBecomeSpecialist}>Стать мастером</Button>
              )}

              <NavigationButtons isAuthenticated={isAuthenticated} hat={hat} router={router} />

              <div className="flex items-center gap-6">
                {isAuthenticated && hat === "adept" && (
                  <div
                    className={cn(
                      "flex items-center aspect-square rounded-sm shadow-sm h-10 w-10 p-1",
                      pathname === "/calendar" && "text-white bg-violet-600",
                    )}
                  >
                    <button onClick={handleCalendarClick}>
                      <CalendarDays className="h-8 w-8 bold" />
                    </button>
                  </div>
                )}

                <ProfileMenu
                  isAuthenticated={isAuthenticated}
                  user={user}
                  showProfileMenu={showProfileMenu}
                  toggleProfileMenu={toggleProfileMenu}
                  setShowProfileMenu={setShowProfileMenu}
                  handleLogout={handleLogout}
                  role={role}
                  handleRoleToggle={handleRoleToggle}
                  isSpecialist={isSpecialist}
                />
                {isAuthenticated && <NotificationSystem />}
              </div>
            </div>

            {/* Мобильная версия */}
            <div className="md:hidden absolute right-3 top-1/2 transform -translate-y-1/2">
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <ProfileMenu
                  isAuthenticated={isAuthenticated}
                  user={user}
                  showProfileMenu={showProfileMenu}
                  toggleProfileMenu={toggleProfileMenu}
                  setShowProfileMenu={setShowProfileMenu}
                  handleLogout={handleLogout}
                  isMobile={true}
                  role={role}
                  handleRoleToggle={handleRoleToggle}
                />
              )}
            </div>

            {!isAuthenticated && (
              <div className="hidden md:flex absolute right-3 top-1/2 transform -translate-y-1/2">
                <Button onClick={() => openAuthModal("login")}>Инициировать практис</Button>
              </div>
            )}
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
