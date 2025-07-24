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
import { BurgerMenu } from "./components/burger-menu"
import { MobileMenu } from "./components/mobile-menu"
import {NotificationSystem} from "@/components/notification-system";

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

  const isSticky = pathname === "/" || pathname?.startsWith('/search/')

  return (
      <>
        <header className={cn(
            "top-0 z-50 h-24 w-full border-b bg-background bg-opacity-70 backdrop-blur-lg opacity-80",
            isSticky && "sticky"
        )}>
          <nav className="container px-3">
            <div className="flex h-24 items-center">
              <div className={cn(
                  "flex items-start",
                  shouldShowSidebar ? "gap-x-12 ml-40" : ""
              )}>
                {/* Кнопка panel-right-close - исчезает при развернутом сайдбаре */}
                {shouldShowSidebar && (
                    <button
                        onClick={handleOpenSidebar}
                        className={cn(
                            "rounded-sm hover:bg-gray-100 dark:hover:bg-gray-700 px-3",
                            "transition-all duration-300 ease-in-out rounded-sm gap-0 p-0 hover:bg-transparent",
                            !isCollapsed ? "opacity-0 pointer-events-none scale-95" : "opacity-100 scale-100",
                            "h-20 m-0",
                        )}
                        style={{
                          marginLeft: !isCollapsed || pathname === "/" ? 0 : 200 // Применяем отступ только когда сайдбар открыт
                        }}
                    >
                      <div className="h-18 w-18 items-center justify-center flex">
                        <PanelRightClose width={24} height={24} />
                      </div>
                    </button>
                )}

                {pathname !== "/" && (<Logo
                    onClick={handleLogoClick}
                />)}
              </div>

              {/* Desktop Right side */}
              <div className="hidden md:flex items-center space-x-3 opacity-100 items-end">
                {/* Кнопка "Стать мастером" показывается только если user.isSpecialist = false */}
                {isAuthenticated && !user?.isSpecialist && (
                    <Button onClick={handleBecomeSpecialist}>Стать мастером</Button>
                )}

                <NavigationButtons isAuthenticated={isAuthenticated} hat={hat} router={router} />

                <div className="flex items-center gap-6 opacity-100">
                  {/* Calendar button for users */}
                  {isAuthenticated && hat === "adept" && (
                      <div className={cn(
                          "hidden md:flex items-center space-x-3 aspect-square rounded-sm shadow-sm h-10 w-10 p-1",
                          pathname === "/calendar" && "text-white bg-violet-600"

                      )}>
                        <button onClick={handleCalendarClick}>
                          <CalendarDays className="h-8 w-8 bold" />
                          <span className="sr-only">Календарь</span>
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
                  {isAuthenticated && (<NotificationSystem/>)}
                </div>
              </div>

              {!isAuthenticated && <Button onClick={() => openAuthModal("login")}>Инициировать практис</Button>}

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
                        handleLogout={handleLogout}
                        isMobile={true}
                        role={role}
                        handleRoleToggle={handleRoleToggle}
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
