"use client"

import type React from "react"
import { useEffect } from "react"
import { useAuth } from "../hooks/useAuth"
import { useSidebar } from "../hooks/useSidebar"
import { useRouter } from "next/router"
import { usePathname } from "next/navigation"
import Sidebar from "./Sidebar"
import MainContent from "./MainContent"

interface SidebarLayoutProps {
  children: React.ReactNode
}

function isPublicRoute(pathname: string): boolean {
  // Define your public routes here
  return pathname === "/" || pathname === "/login"
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const { isOpen } = useSidebar()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Only redirect after loading is complete
    if (!isLoading && !isAuthenticated && !isPublicRoute(pathname)) {
      router.push("/")
    }
  }, [isAuthenticated, isLoading, pathname, router])

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  // Don't render protected content for unauthenticated users
  if (!isAuthenticated && !isPublicRoute(pathname)) {
    return null
  }

  return (
    <div className="flex h-screen">
      {isOpen && <Sidebar />}
      <MainContent>{children}</MainContent>
    </div>
  )
}
