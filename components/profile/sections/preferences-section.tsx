"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  BellIcon,
  GlobeAltIcon,
  PaintBrushIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline"
import { cn } from "@/lib/utils"
import { useTheme } from "@/hooks/use-theme"
import { useSidebar } from "@/contexts/sidebar-context"

export function PreferencesSection() {
  const [pushNotifications, setPushNotifications] = useState(false)
  const [language, setLanguage] = useState("en")
  const [timezone, setTimezone] = useState("UTC-5")
  const { theme, setTheme } = useTheme()
  const { isCollapsed } = useSidebar()
  const [isAnimating, setIsAnimating] = useState(false)

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme as any)
  }

  const themeOptions = [
    {
      value: "light",
      label: "Light",
      icon: SunIcon,
      description: "Always use light theme",
    },
    {
      value: "dark",
      label: "Dark",
      icon: MoonIcon,
      description: "Always use dark theme",
    },
    {
      value: "system",
      label: "System",
      icon: ComputerDesktopIcon,
      description: "Follow system preference",
    },
  ]

  return (
      <div
          className="w-full max-w-[935px] mx-auto px-4 lg:px-6 space-y-6"
          data-animating={isAnimating ? "true" : "false"}
      >
        {/* Notifications Section */}
        <Card
            className="shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-lg"
        >
          <CardHeader className="p-6">
            <CardTitle className="flex items-center gap-2 dark:text-gray-100">
              <BellIcon className="h-5 w-5 text-violet-600 " />
              Notifications
            </CardTitle>
            <CardDescription className="dark:text-gray-400">Manage how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-4">
            {/* Push Notifications */}
            <div
                className="flex items-center justify-between p-4 bg-violet-50 dark:bg-gray-700 rounded-lg"
            >
              <div>
                <h4 className="font-medium dark:text-gray-200">Push Notifications</h4>
                <p className="text-sm text-gray-600 ">Get instant notifications on your device</p>
              </div>
              <Switch
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                  className="data-[state=checked]:bg-violet-600"
                  aria-label="Enable/disable push notifications"
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance Section */}
        <Card
            className="shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-lg"
        >
          <CardHeader className="p-6">
            <CardTitle className="flex items-center gap-2 dark:text-gray-100">
              <PaintBrushIcon className="h-5 w-5 text-violet-600" />
              Appearance
            </CardTitle>
            <CardDescription className="dark:text-gray-400">
              Customize the look and feel of your interface
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="space-y-4">
              <div>
                <Label className="dark:text-gray-200 mb-3 block">Theme Preference</Label>
                <div className="flex flex-col sm:flex-row gap-3">
                  {themeOptions.map((option) => {
                    const Icon = option.icon
                    const isActive = theme === option.value
                    return (
                        <button
                            key={option.value}
                            onClick={() => handleThemeChange(option.value)}
                            className={cn(
                                "flex-1 p-4 rounded-lg border-2 min-h-[48px]",
                                isActive
                                    ? "border-violet-600 bg-purple-50 dark:bg-purple-900/20"
                                    : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500",
                            )}
                        >
                          <Icon
                              className={cn(
                                  "h-6 w-6 mx-auto mb-2",
                                  isActive ? "text-violet-600" : "text-gray-600 ",
                              )}
                          />
                          <p
                              className={cn(
                                  "text-sm font-medium",
                                  isActive ? "text-violet-600 " : "dark:text-gray-200",
                              )}
                          >
                            {option.label}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{option.description}</p>
                        </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
  )
}
