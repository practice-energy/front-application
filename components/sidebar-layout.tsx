"use client"

import type React from "react"

import { useAuth } from "@/hooks/use-auth"
import { Header } from "@/components/header/index"
import { MainSidebar } from "@/components/main-sidebar/index"
import { useSidebar } from "@/contexts/sidebar-context"
import { usePathname } from "next/navigation"
import { useIsMobile } from "@/hooks/use-mobile"
import { useEffect } from "react"

interface SidebarLayoutProps {
  children: React.ReactNode
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const { isAuthenticated } = useAuth()
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const { isCollapsed } = useSidebar()

  // Определяем нужно ли показывать header
  const shouldShowHeader = () => {
    // На мобильных устройствах не показываем header на странице календаря
    if (isMobile) {
        return false
    }

    if (pathname === "/" && !isAuthenticated) {
      return false
    }
    // На всех остальных страницах показываем header
    return true
  }

  const showHeader = shouldShowHeader()

  return (
    <div className="min-h-screen">
      {showHeader && <Header />}
      {isAuthenticated && <MainSidebar />}
      <main className={showHeader ? "min-h-[calc(100vh-3rem)]" : "min-h-screen"}>{children}</main>
    </div>
  )
}
