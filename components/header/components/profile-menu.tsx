"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Settings, LogOut, User, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"

export function ProfileMenu() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const handleProfileClick = () => {
    router.push("/profile")
    setIsOpen(false)
  }

  const handleSpecialistDashboard = () => {
    router.push("/specialist-dashboard")
    setIsOpen(false)
  }

  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/profile")}
        className="h-8 px-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <Calendar className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline">Календарь</span>
      </Button>

      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "h-8 w-8 rounded-md p-0",
              "hover:bg-gray-100 dark:hover:bg-gray-800",
              "focus:ring-2 focus:ring-violet-500 focus:ring-offset-2",
            )}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || "User"} />
              <AvatarFallback className="bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300">
                {user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <div className="flex items-center gap-2 p-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || "User"} />
              <AvatarFallback className="bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300">
                {user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{user?.name || "Пользователь"}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email || "email@example.com"}</p>
            </div>
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleProfileClick}>
            <User className="mr-2 h-4 w-4" />
            <span>Профиль</span>
          </DropdownMenuItem>

          {user?.isSpecialist && (
            <DropdownMenuItem onClick={handleSpecialistDashboard}>
              <Briefcase className="mr-2 h-4 w-4" />
              <span>Панель специалиста</span>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Настройки</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Выйти</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
