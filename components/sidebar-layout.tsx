"use client"

import type React from "react"

import { useAuth } from "@/hooks/use-auth"
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

  // Update body margin when sidebar state changes
  useEffect(() => {
    if (typeof document !== "undefined") {
      // Используем custom event для уведомления компонентов о изменении состояния сайдбара
      window.dispatchEvent(
        new CustomEvent("sidebarToggle", {
          detail: { isCollapsed, width: isCollapsed ? 0 : 400 },
        }),
      )

      // Отложенная установка стилей для лучшей синхронизации рендеринга
      const applyStyles = () => {
        const sidebarWidth = window.innerWidth < 768 ? "0" : "400px"
        document.body.style.marginLeft = isAuthenticated && !isCollapsed ? sidebarWidth : "0"
        document.body.style.transition = "margin-left 300ms cubic-bezier(0.4, 0, 0.2, 1)"
      }

      requestAnimationFrame(applyStyles)
    }
    return () => {
      if (typeof document !== "undefined") {
        document.body.style.marginLeft = "0"
      }
    }
  }, [isAuthenticated, isCollapsed])

  return (
    <div className="min-h-screen">
      {isAuthenticated && <MainSidebar />}
      <main className="min-h-screen">{children}</main>
    </div>
  )
}
