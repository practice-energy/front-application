import type React from "react"
export interface HeaderProps {
  legacyRoutes?: boolean // default false
  authState: "authenticated" | "unauthenticated"
  userAvatar?: string
}

export interface RouteConfig {
  primary: string
  legacy?: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

export interface NavigationItem {
  id: string
  route: RouteConfig
  isActive: boolean
  isAvailable: boolean
}

export interface SidebarToggleState {
  isCollapsed: boolean
  isAnimating: boolean
  lastToggleTime: number
}
