"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { Button } from "@/components/ui/button"
import {
  Menu,
  User,
  HelpCircle,
  LogOut,
  Calendar,
  Heart,
  Shield,
  CreditCard,
  X,
  DollarSign,
  Clock,
  TrendingUp,
  PanelRightClose,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useTranslations } from "@/hooks/use-translations"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AuthModal } from "@/components/auth-modal"
import { SwatchIcon } from "@heroicons/react/24/outline"
import { NotificationSystem } from "@/components/notification-system"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useSidebar } from "@/contexts/sidebar-context"

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const { isAuthenticated, user, logout } = useAuth()
  const { language, changeLanguage } = useTranslations()
  const router = useRouter()
  const { isCollapsed, toggleSidebar } = useSidebar()

  const [isLanguageSwitching, setIsLanguageSwitching] = useState(false)
  const [showBurgerMenu, setShowBurgerMenu] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [role, setRole] = useState<"user" | "specialist">(user?.isSpecialist ? "specialist" : "user")

  const burgerMenuRef = useRef<HTMLDivElement>(null)
  const profileMenuRef = useRef<HTMLDivElement>(null)

  const shouldShowSidebar = useMemo(() => {
    return isAuthenticated
  }, [isAuthenticated])

  const isSpecialist = useMemo(() => {
    return user?.isSpecialist || false
  }, [user?.isSpecialist])

  useEffect(() => {
    setRole(user?.isSpecialist ? "specialist" : "user")
  }, [user?.isSpecialist])

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
  }, [])

  const handleLanguageToggle = async () => {
    setIsLanguageSwitching(true)
    try {
      await changeLanguage(language === "en" ? "ru" : "en")
    } catch (error) {
      console.error("Failed to change language:", error)
    } finally {
      setIsLanguageSwitching(false)
    }
  }

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false)
  }

  const openAuthModal = (mode: "login" | "signup" = "login") => {
    setAuthMode(mode)
    setIsAuthModalOpen(true)
    setShowBurgerMenu(false)
    setIsMobileMenuOpen(false)
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
      <header className="sticky top-0 z-50 w-full border-b bg-background backdrop-blur-lg dark:border-gray-800">
        <nav className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Logo */}
              <button onClick={handleLogoClick} className="flex items-center space-x-2">
                <div className="h-8 w-8 flex items-center justify-center">
                  <Image
                    src="/practice-logo.svg"
                    alt="Practice Logo"
                    width={32}
                    height={32}
                    className="w-8 h-8 text-black dark:text-white"
                    priority
                  />
                </div>
              </button>

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
            </div>

            {/* Desktop Right side */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated && user?.specialistProfile === null && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBecomeSpecialist}
                  className="h-8 px-3 text-sm font-medium text-black dark:text-white transition-colors rounded-sm"
                >
                  Стать специалистом
                </Button>
              )}

              {/*Role toggle button*/}
              {isAuthenticated && user?.specialistProfile !== null && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRoleToggle}
                  className="h-8 px-3 text-sm font-medium text-black dark:text-white transition-colors rounded-sm"
                >
                  {role === "specialist" ? "К режиму пользователя" : "К режиму мастера"}
                </Button>
              )}

              {isAuthenticated && <NotificationSystem />}

              {isAuthenticated && (
                <div className="relative" ref={profileMenuRef}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleProfileMenu}
                    className={cn(
                      "h-8 w-8 p-0 rounded-sm transition-all duration-200",
                      showProfileMenu
                        ? "border-2 border-violet-600"
                        : "border-2 border-transparent hover:bg-violet-50 dark:hover:bg-violet-900/20",
                    )}
                    aria-label="Profile menu"
                  >
                    <div
                      className={cn(
                        "h-full w-full rounded-sm flex items-center justify-center",
                        "bg-violet-100 dark:bg-violet-900",
                        showProfileMenu && "bg-violet-200 dark:bg-violet-800",
                      )}
                    >
                      <User className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                    </div>
                  </Button>

                  {showProfileMenu && (
                    <div className="absolute right-0 top-full mt-2 w-60 bg-white dark:bg-gray-800 rounded-sm shadow-md border border-gray-200 dark:border-gray-700 py-0 z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                          {user?.name || "User"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                      </div>

                      <div className="py-2">
                        <Link
                          href="/profile?section=overview"
                          className="flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <User className="mr-3 h-4 w-4" />
                          Profile Overview
                        </Link>

                        <Link
                          href="/profile?section=calendar"
                          className="flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <Calendar className="mr-3 h-4 w-4" />
                          Calendar
                        </Link>

                        <Link
                          href="/profile?section=saved"
                          className="flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <Heart className="mr-3 h-4 w-4" />
                          Saved
                        </Link>

                        <Link
                          href="/profile?section=security"
                          className="flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <Shield className="mr-3 h-4 w-4" />
                          Security
                        </Link>

                        <Link
                          href="/profile?section=balance"
                          className="flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <CreditCard className="mr-3 h-4 w-4" />
                          Balance
                        </Link>

                        <Link
                          href="/profile?section=preferences"
                          className="flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <SwatchIcon className="mr-3 h-4 w-4" />
                          Preferences
                        </Link>
                      </div>

                      <div className="border-t border-gray-100 dark:border-gray-700 py-2">
                        <Link
                          href="/help"
                          className="flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <HelpCircle className="mr-3 h-4 w-4" />
                          Help / FAQ
                        </Link>
                      </div>

                      <div className="border-t border-gray-100 dark:border-gray-700 py-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <LogOut className="mr-3 h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {isAuthenticated && isSpecialist && (
                <div className="relative" ref={burgerMenuRef}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleBurgerMenu}
                    className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-sm"
                    aria-label="Specialist menu"
                  >
                    <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  </Button>

                  {showBurgerMenu && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-sm shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wide">Dashboard</p>
                      </div>

                      <div className="py-1">
                        <Link
                          href="/specialist-dashboard?section=services"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setShowBurgerMenu(false)}
                        >
                          <User className="mr-3 h-4 w-4" />
                          My Services
                        </Link>

                        <Link
                          href="/specialist-dashboard?section=bookings"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setShowBurgerMenu(false)}
                        >
                          <Calendar className="mr-3 h-4 w-4" />
                          Bookings
                        </Link>

                        <Link
                          href="/specialist-dashboard?section=earnings"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setShowBurgerMenu(false)}
                        >
                          <DollarSign className="mr-3 h-4 w-4" />
                          Earnings
                        </Link>

                        <Link
                          href="/specialist-dashboard?section=availability"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setShowBurgerMenu(false)}
                        >
                          <Clock className="mr-3 h-4 w-4" />
                          Availability
                        </Link>

                        <Link
                          href="/specialist-dashboard?section=performance"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setShowBurgerMenu(false)}
                        >
                          <TrendingUp className="mr-3 h-4 w-4" />
                          Performance
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}

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
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileMenu}
                className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-sm"
                aria-label="Mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                ) : (
                  <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t dark:border-gray-800 py-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
              {isAuthenticated ? (
                <>
                  <Button
                    variant="ghost"
                    onClick={handleRoleToggle}
                    className="w-full justify-start px-3 py-2 h-auto text-left rounded-sm"
                  >
                    {role === "specialist" ? "К режиму пользователя" : "К режиму мастера"}
                  </Button>

                  <div>
                    <Link
                      href="/profile?section=overview"
                      className="flex items-center px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-sm"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <User className="mr-3 h-4 w-4" />
                      Profile Overview
                    </Link>

                    <Link
                      href="/profile?section=calendar"
                      className="flex items-center px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-sm"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <Calendar className="mr-3 h-4 w-4" />
                      Calendar
                    </Link>

                    <Link
                      href="/profile?section=saved"
                      className="flex items-center px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-sm"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <Heart className="mr-3 h-4 w-4" />
                      Saved
                    </Link>

                    <Link
                      href="/profile?section=security"
                      className="flex items-center px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-sm"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <Shield className="mr-3 h-4 w-4" />
                      Security
                    </Link>

                    <Link
                      href="/profile?section=balance"
                      className="flex items-center px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-sm"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <CreditCard className="mr-3 h-4 w-4" />
                      Balance
                    </Link>

                    <Link
                      href="/profile?section=preferences"
                      className="flex items-center px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-sm"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <SwatchIcon className="mr-3 h-4 w-4" />
                      Preferences
                    </Link>
                  </div>

                  {isSpecialist && (
                    <>
                      <div className="border-t border-gray-100 dark:border-gray-700 my-2"></div>
                      <div className="px-3 py-1">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          Specialist Dashboard
                        </p>
                      </div>

                      <Link
                        href="/specialist-dashboard?section=services"
                        className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-sm transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <User className="mr-3 h-4 w-4" />
                        My Services
                      </Link>

                      <Link
                        href="/specialist-dashboard?section=bookings"
                        className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-sm transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Calendar className="mr-3 h-4 w-4" />
                        Bookings
                      </Link>

                      <Link
                        href="/specialist-dashboard?section=earnings"
                        className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-sm transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <DollarSign className="mr-3 h-4 w-4" />
                        Earnings
                      </Link>

                      <Link
                        href="/specialist-dashboard?section=availability"
                        className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-sm transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Clock className="mr-3 h-4 w-4" />
                        Availability
                      </Link>

                      <Link
                        href="/specialist-dashboard?section=performance"
                        className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-sm transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <TrendingUp className="mr-3 h-4 w-4" />
                        Performance
                      </Link>
                    </>
                  )}

                  <div className="border-t border-gray-100 dark:border-gray-700 my-2"></div>

                  <Link
                    href="/help"
                    className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-sm transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <HelpCircle className="mr-3 h-4 w-4" />
                    Help / FAQ
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-sm transition-colors text-left"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => openAuthModal("login")}
                  className="flex items-center w-full px-3 py-2 text-sm bg-violet-600 hover:bg-violet-700 text-white rounded-sm transition-colors text-left justify-center"
                >
                  <User className="mr-3 h-4 w-4" />
                  Log in / Register
                </button>
              )}
            </div>
          )}
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
