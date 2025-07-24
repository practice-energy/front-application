import type React from "react"
import type { User } from "@/types/user"

export interface ProfileMenuProps {
  isAuthenticated: boolean
  user: User | null
  showProfileMenu: boolean
  toggleProfileMenu: () => void
  setShowProfileMenu: (show: boolean) => void
  handleLogout: () => void
  isMobile?: boolean
  role?: string
  handleRoleToggle?: () => void
  isSpecialist?: boolean
}

export interface BurgerMenuProps {
  isAuthenticated: boolean
  showBurgerMenu: boolean
  toggleBurgerMenu: () => void
  setShowBurgerMenu: (show: boolean) => void
}

export interface MobileMenuProps {
  isMobileMenuOpen: boolean
  isAuthenticated: boolean
  user: User | null
  role: "user" | "specialist"
  isSpecialist: boolean
  handleRoleToggle: () => void
  setShowProfileMenu: (show: boolean) => void
  setIsMobileMenuOpen: (open: boolean) => void
  handleLogout: () => void
  openAuthModal: (mode: "login" | "signup") => void
}
