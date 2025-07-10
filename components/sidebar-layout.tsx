"use client"

import type React from "react"

import { useSidebar } from "@/contexts/sidebar-context"
import { MainSidebar } from "@/components/main-sidebar"
import { cn } from "@/lib/utils"
import { useEffect } from "react"

interface SidebarLayoutProps {
  children: React.ReactNode
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const { isCollapsed } = useSidebar()

  useEffect(() => {
    const body = document.body
    if (!isCollapsed) {
      body.style.marginLeft = "330px"
    } else {
      body.style.marginLeft = "0"
    }

    return () => {
      body.style.marginLeft = "0"
    }
  }, [isCollapsed])

  return (
    <>
      <MainSidebar />
      <div className={cn("transition-all duration-300 ease-in-out", !isCollapsed ? "ml-[330px]" : "ml-0")}>
        {children}
      </div>
    </>
  )
}
