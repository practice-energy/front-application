"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut, Calendar, Heart, MessageCircle } from "lucide-react"
import { AuthModal } from "@/components/auth-modal"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"

interface ProfileButtonProps {
  size?: "sm" | "md" | "lg"
  variant?: "header" | "compact"
  className?: string
}

export function ProfileButton({ size = "md", variant = "header", className = "" }: ProfileButtonProps) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const { isAuthenticated, user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false)
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const openAuthModal = (mode: "login" | "signup") => {
    setAuthMode(mode)
    setIsAuthModalOpen(true)
  }

  const avatarSizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }

  const buttonSizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }

  if (!isAuthenticated) {
    if (variant === "compact") {
      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={`relative rounded-full ${buttonSizes[size]} hover:bg-gray-100 ${className}`}
              >
                <Avatar className={avatarSizes[size]}>
                  <AvatarFallback className="bg-gray-100 text-violet-600">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48" align="end">
              <DropdownMenuItem onClick={() => openAuthModal("login")} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Войти</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openAuthModal("signup")} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Зарегистрироваться</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
            onSuccess={handleAuthSuccess}
            initialMode={authMode}
          />
        </>
      )
    }

    // Header variant for non-authenticated users
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className={`relative hover:bg-gray-100 ${className}`}>
              <User className="h-4 w-4 text-violet-600" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48" align="end">
            <DropdownMenuItem onClick={() => openAuthModal("login")} className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Log in or sign up</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={handleAuthSuccess}
          initialMode={authMode}
        />
      </>
    )
  }

  // Authenticated user dropdown
  return (
    <>
      <DropdownMenu
        onOpenChange={(open) => {
          if (
            open &&
            (pathname === "/" ||
              pathname === "/profile" ||
              pathname === "/help" ||
              pathname.startsWith("/messages/") ||
              pathname.startsWith("/review/") ||
              pathname.startsWith("/search/"))
          ) {
          }
        }}
      >
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={`relative rounded-full ${buttonSizes[size]} hover:bg-gray-100 ${className}`}
          >
            <Avatar className={avatarSizes[size]}>
              <AvatarFallback className="bg-gray-100 text-violet-600">
                {user?.name?.charAt(0) || <User className="h-4 w-4" />}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
              <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/profile" className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          {variant === "header" && (
            <>
              <DropdownMenuItem asChild>
                <Link href="/profile?section=calendar" className="cursor-pointer">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Schedule</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profile?section=saved" className="cursor-pointer">
                  <Heart className="mr-2 h-4 w-4" />
                  <span>Saved</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profile?section=chats" className="cursor-pointer">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  <span>Messages</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        initialMode={authMode}
      />
    </>
  )
}
