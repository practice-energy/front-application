"use client"

import type { ReactNode } from "react"
import { useSidebar } from "@/contexts/sidebar-context"
import { MainSidebar } from "@/components/main-sidebar"
import { cn } from "@/lib/utils"

interface SidebarLayoutProps {
  children: ReactNode
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const { isCollapsed } = useSidebar()

  return (
    <div className="flex h-screen overflow-hidden">
      <MainSidebar />

      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-200 ease-in-out",
          isCollapsed ? "ml-0" : "ml-0 md:ml-96",
        )}
      >
        {children}
      </div>
    </div>
  )
}
