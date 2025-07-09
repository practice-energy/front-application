"use client"

import type React from "react"

import { useAuth } from "@/hooks/use-auth"
import { Header } from "@/components/header/index"
import { MainSidebar } from "@/components/main-sidebar/index"
import { useSidebar } from "@/contexts/sidebar-context"
import { useEffect } from "react"

interface SidebarLayoutProps {
  children: React.ReactNode
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const { isAuthenticated } = useAuth()
  const { isCollapsed } = useSidebar()

  // Update body margin when sidebar state changes
  useEffect(() => {
    if (typeof document !== "undefined") {
      // Используем custom event для уведомления компонентов о изменении состояния сайдбара
      window.dispatchEvent(
        new CustomEvent("sidebarToggle", {
          detail: { isCollapsed, width: isCollapsed ? 0 : 320 }
        })
      )

      // Отложенная установка стилей для лучшей синхронизации рендеринга
      const applyStyles = () => {
        document.body.style.marginLeft = isAuthenticated && !isCollapsed ? "320px" : "0"
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      {isAuthenticated && <MainSidebar />}
      <main className="min-h-[calc(100vh-4rem)]">{children}</main>
    </div>
  )
}
