"use client"

import type React from "react"

import { useSidebar } from "@/contexts/sidebar-context"
import { MainSidebar } from "@/components/main-sidebar"
import { Header } from "@/components/header"
import { usePathname } from "next/navigation"
import { useIsMobile } from "@/hooks/use-mobile"

interface SidebarLayoutProps {
  children: React.ReactNode
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const { isCollapsed } = useSidebar()
  const pathname = usePathname()
  const isMobile = useIsMobile()

  // Определяем нужно ли показывать header
  const shouldShowHeader = () => {
    // На мобильных устройствах не показываем header на странице календаря
    if (isMobile && pathname === "/calendar") {
      return false
    }
    // На всех остальных страницах показываем header
    return true
  }

  return (
    <div className="flex h-screen bg-background">
      <MainSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        {shouldShowHeader() && <Header />}
        <main
          className={`
            flex-1 overflow-auto transition-all duration-300 ease-in-out
            ${shouldShowHeader() ? "" : "h-screen"}
          `}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
