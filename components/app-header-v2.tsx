"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Globe, Menu, User, HelpCircle } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useTranslations } from "@/hooks/use-translations"
import { AuthModal } from "@/components/auth-modal"
import { SidebarToggleV2 } from "@/components/sidebar-toggle-v2"
import { ProfileDropdownV2 } from "@/components/profile-dropdown-v2"
import { cn } from "@/lib/utils"
import type { HeaderProps } from "@/types/header"

export function AppHeaderV2({ legacyRoutes = false, authState, userAvatar }: HeaderProps) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const [showBurgerMenu, setShowBurgerMenu] = useState(false)
  const [isLanguageSwitching, setIsLanguageSwitching] = useState(false)

  const { isAuthenticated, logout } = useAuth()
  const { language, changeLanguage } = useTranslations()
  const pathname = usePathname()

  const burgerMenuRef = useRef<HTMLDivElement>(null)

  // Determine if sidebar should be shown based on current route
  const showSidebar =
    !pathname.startsWith("/specialist/") &&
    !pathname.startsWith("/service/") &&
    ["/search", "/"].some((route) => pathname === route || pathname.startsWith(route + "/")) &&
    !pathname.startsWith("/profile") &&
    !pathname.startsWith("/help") &&
    !pathname.startsWith("/saved")

  // Close burger menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (burgerMenuRef.current && !burgerMenuRef.current.contains(event.target as Node)) {
        setShowBurgerMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
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
  }

  const handleLogout = () => {
    logout()
    setShowBurgerMenu(false)
  }

  const toggleBurgerMenu = () => {
    setShowBurgerMenu(!showBurgerMenu)
  }

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "sticky top-0 z-50 w-full",
          "border-b bg-background/95 backdrop-blur",
          "supports-[backdrop-filter]:bg-background/60",
        )}
      >
        <nav className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Left Side */}
            <div className="flex items-center space-x-3">
              {/* Logo */}
              <Link
                href="/"
                className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 rounded-md"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="h-8 w-8 flex items-center justify-center"
                >
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
                </motion.div>
              </Link>

              {/* Sidebar Toggle - only show on pages with sidebar */}
              <AnimatePresence>
                {showSidebar && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SidebarToggleV2 />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-2">
              {/* Language Switch Button */}
              <motion.button
                onClick={handleLanguageToggle}
                disabled={isLanguageSwitching}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                className={cn(
                  "flex items-center space-x-1 px-3 py-2",
                  "min-h-[44px] min-w-[60px]", // Ensure minimum touch target
                  "rounded-lg transition-colors duration-200",
                  "hover:bg-gray-100 focus:bg-gray-100",
                  "focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "touch-manipulation cursor-pointer",
                )}
                title={`Switch to ${language === "en" ? "Russian" : "English"}`}
                aria-label={`Switch to ${language === "en" ? "Russian" : "English"}`}
              >
                <Globe className="h-4 w-4" />
                <span className="text-sm font-medium uppercase">{isLanguageSwitching ? "..." : language}</span>
              </motion.button>

              {/* Profile Button - only show when authenticated */}
              <AnimatePresence>
                {(authState === "authenticated" || isAuthenticated) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ProfileDropdownV2 legacyRoutes={legacyRoutes} onLogout={handleLogout} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Burger Menu Button */}
              <div className="relative" ref={burgerMenuRef}>
                <motion.button
                  onClick={toggleBurgerMenu}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  className={cn(
                    "flex items-center justify-center",
                    "h-10 w-10 min-h-[44px] min-w-[44px]", // Ensure 44x44px minimum
                    "rounded-lg transition-colors duration-200",
                    "hover:bg-gray-100 focus:bg-gray-100",
                    "focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2",
                    "touch-manipulation cursor-pointer",
                  )}
                  aria-expanded={showBurgerMenu}
                  aria-haspopup="menu"
                  aria-label="Menu"
                >
                  <Menu className="h-5 w-5 text-gray-700" />
                </motion.button>

                {/* Burger Dropdown Menu */}
                <AnimatePresence>
                  {showBurgerMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className={cn(
                        "absolute right-0 top-full mt-2 w-48",
                        "bg-white rounded-lg shadow-lg border border-gray-200",
                        "py-2 z-50 overflow-hidden",
                      )}
                      role="menu"
                    >
                      <Link
                        href="/help"
                        onClick={() => setShowBurgerMenu(false)}
                        className={cn(
                          "flex items-center px-4 py-2 text-sm text-gray-700",
                          "hover:bg-gray-50 focus:bg-gray-50",
                          "focus:outline-none transition-colors",
                        )}
                        role="menuitem"
                      >
                        <HelpCircle className="mr-3 h-4 w-4 text-gray-400" />
                        Help / FAQ
                      </Link>

                      <div className="border-t border-gray-100 my-1" />

                      {authState === "unauthenticated" && !isAuthenticated ? (
                        <button
                          onClick={() => openAuthModal("login")}
                          className={cn(
                            "flex items-center w-full px-4 py-2 text-sm text-gray-700",
                            "hover:bg-gray-50 focus:bg-gray-50",
                            "focus:outline-none transition-colors text-left",
                          )}
                          role="menuitem"
                        >
                          <User className="mr-3 h-4 w-4 text-gray-400" />
                          Login / Register
                        </button>
                      ) : null}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        initialMode={authMode}
      />
    </>
  )
}
