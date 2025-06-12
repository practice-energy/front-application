"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { MainSidebar } from "@/components/main-sidebar"
import { Header } from "@/components/header"

interface SidebarLayoutProps {
  children: React.ReactNode
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const pathname = usePathname()

  // Determine if sidebar should be shown based on current route
  const showSidebar = !pathname.startsWith("/specialist/") && !pathname.startsWith("/service/")

  // Load initial state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("sidebarCollapsed")
    if (savedState !== null) {
      setIsCollapsed(JSON.parse(savedState))
    }
  }, [])

  // Listen for sidebar toggle events
  useEffect(() => {
    const handleSidebarToggle = (event: CustomEvent) => {
      setIsCollapsed(event.detail.isCollapsed)
    }

    window.addEventListener("sidebarToggle", handleSidebarToggle as EventListener)
    window.addEventListener("headerSidebarToggle", handleSidebarToggle as EventListener)

    return () => {
      window.removeEventListener("sidebarToggle", handleSidebarToggle as EventListener)
      window.removeEventListener("headerSidebarToggle", handleSidebarToggle as EventListener)
    }
  }, [])

  if (!showSidebar) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="transition-all duration-300">{children}</main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      <MainSidebar isCollapsed={isCollapsed} />
      <main className="transition-all duration-300">{children}</main>
    </div>
  )
}
