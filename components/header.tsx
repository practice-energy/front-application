"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Globe, Menu, User, HelpCircle, LogOut, Calendar, Heart } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useTranslations } from "@/hooks/use-translations"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { AuthModal } from "@/components/auth-modal"
import { SidebarToggleButton } from "@/components/sidebar-toggle-button"

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const { isAuthenticated, user, logout } = useAuth()
  const { language, changeLanguage } = useTranslations()
  const router = useRouter()
  const pathname = usePathname()

  const [isLanguageSwitching, setIsLanguageSwitching] = useState(false)

  // New state for burger and profile menus
  const [showBurgerMenu, setShowBurgerMenu] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  // Refs for click outside detection
  const burgerMenuRef = useRef<HTMLDivElement>(null)
  const profileMenuRef = useRef<HTMLDivElement>(null)

  // Check if current page should have sidebar
  const shouldShowSidebar =
    pathname === "/" ||
    pathname === "/profile" ||
    pathname === "/help" ||
    pathname.startsWith("/messages/") ||
    pathname.startsWith("/review/") ||
    pathname.startsWith("/search/")

  // Close dropdowns when clicking outside
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
    setShowBurgerMenu(false) // Close burger menu when opening auth modal
  }

  const handleLogout = () => {
    logout()
    setShowBurgerMenu(false)
    setShowProfileMenu(false)
    router.push("/")
  }

  const toggleBurgerMenu = () => {
    setShowBurgerMenu(!showBurgerMenu)
    setShowProfileMenu(false) // Close profile menu when opening burger menu
  }

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu)
    setShowBurgerMenu(false) // Close burger menu when opening profile menu
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Logo - always links to main page */}
              <Link href="/" className="flex items-center space-x-2">
                <div className="h-8 w-8 flex items-center justify-center">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 276 279"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-violet-600"
                  >
                    <line x1="10.6066" y1="11.3934" x2="265.165" y2="265.952" stroke="currentColor" strokeWidth="30" />
                    <line x1="265.165" y1="13.6066" x2="10.6066" y2="268.165" stroke="currentColor" strokeWidth="30" />
                    <path d="M48 225.024L48 55" stroke="currentColor" strokeWidth="30" />
                    <path d="M230 225.024L230 55" stroke="currentColor" strokeWidth="30" />
                  </svg>
                </div>
              </Link>

              {/* Enhanced Sidebar Toggle Button - only show on pages with sidebar */}
              {shouldShowSidebar && isAuthenticated && <SidebarToggleButton sidebarId="main-sidebar" />}
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Become a Specialist / Specialist Dashboard Button - only show when authenticated */}
              {isAuthenticated && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(user?.isSpecialist ? "/specialist-dashboard" : "/become-specialist")}
                  className="h-8 px-3 text-sm font-medium text-violet-600 hover:text-violet-700 hover:bg-violet-50 transition-colors"
                >
                  {user?.isSpecialist ? "Dashboard" : "Become a Specialist"}
                </Button>
              )}

              {/* Language Switch Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLanguageToggle}
                disabled={isLanguageSwitching}
                className="h-8 px-2 flex items-center space-x-1 min-w-[60px] touch-manipulation"
                title={`Switch to ${language === "en" ? "Russian" : "English"}`}
              >
                <Globe className="h-4 w-4" />
                <span className="text-sm font-medium uppercase">{isLanguageSwitching ? "..." : language}</span>
              </Button>

              {/* Profile Button - only show when authenticated */}
              {isAuthenticated && (
                <div className="relative" ref={profileMenuRef}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleProfileMenu}
                    className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Profile menu"
                  >
                    <div className="h-6 w-6 rounded-full bg-violet-100 flex items-center justify-center">
                      <User className="h-4 w-4 text-violet-600" />
                    </div>
                  </Button>

                  {/* Profile Dropdown Menu */}
                  {showProfileMenu && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user?.name || "User"}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>

                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <User className="mr-3 h-4 w-4" />
                        My Profile
                      </Link>

                      <Link
                        href="/profile?section=calendar"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <Calendar className="mr-3 h-4 w-4" />
                        Meetings & Schedule
                      </Link>

                      <Link
                        href="/profile?section=saved"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <Heart className="mr-3 h-4 w-4" />
                        Saved
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Burger Menu Button */}
              <div className="relative" ref={burgerMenuRef}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleBurgerMenu}
                  className="h-8 w-8 p-0 hover:bg-gray-100 transition-colors"
                  aria-label="Menu"
                >
                  <Menu className="h-5 w-5 text-gray-700" />
                </Button>

                {/* Burger Dropdown Menu */}
                {showBurgerMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <Link
                      href="/help"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowBurgerMenu(false)}
                    >
                      <HelpCircle className="mr-3 h-4 w-4" />
                      Help / FAQ
                    </Link>

                    <div className="border-t border-gray-100 my-1"></div>

                    {!isAuthenticated ? (
                      <button
                        onClick={() => openAuthModal("login")}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                      >
                        <User className="mr-3 h-4 w-4" />
                        Login / Register
                      </button>
                    ) : (
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                      >
                        <LogOut className="mr-3 h-4 w-4" />
                        Logout
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile menu (existing functionality preserved) */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t py-4">
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input type="search" placeholder="Search destinations..." className="pl-10 pr-4 py-2 w-full" />
                </div>
                {/* Language Switch for Mobile */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLanguageToggle}
                  disabled={isLanguageSwitching}
                  className="w-full justify-start px-3 py-2 h-auto touch-manipulation"
                >
                  <Globe className="mr-2 h-4 w-4" />
                  <span>Language: {isLanguageSwitching ? "..." : language.toUpperCase()}</span>
                </Button>
              </div>
            </div>
          )}
        </nav>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        initialMode={authMode}
      />
    </>
  )
}
