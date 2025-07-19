"use client"

import {useCallback, useEffect, useRef, useState} from "react"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle} from "@/components/ui/drawer"
import {
  ChatBubbleLeftIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"
import {Bell} from "lucide-react"
import {useRouter} from "next/navigation"
import {cn} from "@/lib/utils"
import {mockNotifications} from "@/services/mock-notification";
import type {Notification} from "@/types/notification";
import {BellIcon} from "@heroicons/react/24/outline";

interface NotificationSystemProps {
  className?: string
}

export function NotificationSystem({ className }: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [hasNewNotifications, setHasNewNotifications] = useState(false)
  const [browserNotificationPermission, setBrowserNotificationPermission] = useState<NotificationPermission>("default")

  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Check browser notification permission
  useEffect(() => {
    if ("Notification" in window) {
      setBrowserNotificationPermission(Notification.permission)
    }
  }, [])

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen && !isMobile) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, isMobile])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return

      switch (event.key) {
        case "Escape":
          setIsOpen(false)
          buttonRef.current?.focus()
          break
        case "Tab":
          // Handle focus trapping here if needed
          break
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
      return () => document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  // Pulse animation for new notifications
  useEffect(() => {
    const unreadCount = notifications.filter((n) => !n.read).length
    if (unreadCount > 0) {
      setHasNewNotifications(true)
      const timer = setTimeout(() => setHasNewNotifications(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [notifications])

  const unreadCount = notifications.filter((n) => !n.read).length

  const getNotificationIcon = (type: Notification["type"]) => {
    const iconClass = "h-4 w-4 text-violet-600"

    switch (type) {
      case "message":
        return <ChatBubbleLeftIcon className={iconClass} />
      case "email":
        return <ExclamationTriangleIcon className={iconClass} />
      case "meeting":
        return <ClockIcon className={iconClass} />
      case "system":
        return <InformationCircleIcon className={iconClass} />
      default:
        return <Bell className={iconClass} />
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return timestamp.toLocaleDateString()
  }

  const groupNotificationsByTime = (notifications: Notification[]) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)

    const groups: { [key: string]: Notification[] } = {
      New: [],
      "Earlier Today": [],
      Yesterday: [],
      Older: [],
    }

    notifications.forEach((notification) => {
      const notificationDate = new Date(notification.timestamp)
      const isToday = notificationDate >= today
      const isYesterday = notificationDate >= yesterday && notificationDate < today

      if (!notification.read && isToday) {
        groups["New"].push(notification)
      } else if (isToday) {
        groups["Earlier Today"].push(notification)
      } else if (isYesterday) {
        groups["Yesterday"].push(notification)
      } else {
        groups["Older"].push(notification)
      }
    })

    // Remove empty groups
    Object.keys(groups).forEach((key) => {
      if (groups[key].length === 0) {
        delete groups[key]
      }
    })

    return groups
  }

  const handleNotificationClick = useCallback(
    (notification: Notification) => {
      // Mark as read
      setNotifications((prev) => prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n)))

      // Navigate to action URL
      router.push(notification.actionUrl)
      setIsOpen(false)
    },
    [router],
  )

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const requestNotificationPermission = useCallback(async () => {
    if ("Notification" in window && Notification.permission === "default") {
      const permission = await Notification.requestPermission()
      setBrowserNotificationPermission(permission)
    }
  }, [])

  const toggleNotifications = () => {
    setIsOpen(!isOpen)
  }

  const groupedNotifications = groupNotificationsByTime(notifications)

  return (
    <>
      {/* Notification Button */}
      <div className={cn("relative", className)}>
        <button
          ref={buttonRef}
          onClick={toggleNotifications}
          className={cn(
            "h-8 w-8 p-0 rounded-sm transition-all duration-200 relative mt-3",
          )}
          aria-label="Notifications"
          aria-expanded={isOpen}
          aria-haspopup="menu"
        >
          <Bell className="h-6 w-7" />
          {unreadCount > 0 && (
            <div
              className={cn(
                "absolute -top-1 -right-1 w-3 h-3 p-0 text-xs bg-violet-600 hover:bg-violet-600 flex items-center justify-center rounded-sm",
                hasNewNotifications && "animate-pulse",
              )}
            />
          )}
        </button>

        {/* Desktop Dropdown */}
        {isOpen && !isMobile && (
          <div
            ref={dropdownRef}
            className="absolute right-0 top-full mt-2 w-80 lg:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-0 z-50 overflow-hidden max-h-[70vh] flex flex-col"
            role="menu"
            aria-labelledby="notifications-button"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
            </div>

            {/* Browser Notification Permission */}
            {browserNotificationPermission === "default" && (
              <div className="px-4 py-3 bg-purple-50 dark:bg-purple-900/20 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-purple-700 dark:text-purple-300">Enable browser notifications</span>
                  <button
                    onClick={requestNotificationPermission}
                    className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
                  >
                    Enable
                  </button>
                </div>
              </div>
            )}

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {Object.keys(groupedNotifications).length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <BellIcon className="h-8 w-8 text-gray-400 dark:text-gray-500 mx-auto" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">No notifications</p>
                </div>
              ) : (
                Object.entries(groupedNotifications).map(([group, groupNotifications]) => (
                  <div key={group}>
                    <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900/50">
                      <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        {group}
                      </h4>
                    </div>
                    {groupNotifications.map((notification) => (
                      <button
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={cn(
                          "w-full px-4 py-3 text-left hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0",
                          !notification.read && "bg-purple-50/50 dark:bg-purple-900/10",
                        )}
                        role="menuitem"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">{getNotificationIcon(notification.type)}</div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={cn(
                                "text-sm",
                                !notification.read
                                  ? "font-medium text-gray-900 dark:text-gray-100"
                                  : "text-gray-700 dark:text-gray-300",
                              )}
                            >
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                              {formatTimestamp(notification.timestamp)}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="flex-shrink-0">
                              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Bottom Sheet */}
      <Drawer open={isOpen && isMobile} onOpenChange={setIsOpen}>
        <DrawerContent className="max-h-[80vh]">
          <DrawerHeader className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <DrawerTitle>Notifications</DrawerTitle>
              <DrawerClose asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <XMarkIcon className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          {/* Browser Notification Permission */}
          {browserNotificationPermission === "default" && (
            <div className="px-4 py-3 bg-purple-50 dark:bg-purple-900/20 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-700 dark:text-purple-300">Enable browser notifications</span>
                <button
                  onClick={requestNotificationPermission}
                  className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
                >
                  Enable
                </button>
              </div>
            </div>
          )}

          {/* Mobile Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {Object.keys(groupedNotifications).length === 0 ? (
              <div className="px-4 py-8 text-center">
                <BellIcon className="h-8 w-8 text-gray-400 dark:text-gray-500 mx-auto" />
                <p className="text-sm text-gray-500 dark:text-gray-400">No notifications</p>
              </div>
            ) : (
              Object.entries(groupedNotifications).map(([group, groupNotifications]) => (
                <div key={group}>
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      {group}
                    </h4>
                  </div>
                  {groupNotifications.map((notification) => (
                    <button
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={cn(
                        "w-full px-4 py-4 text-left hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0",
                        !notification.read && "bg-purple-50/50 dark:bg-purple-900/10",
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={cn(
                              "text-sm",
                              !notification.read
                                ? "font-medium text-gray-900 dark:text-gray-100"
                                : "text-gray-700 dark:text-gray-300",
                            )}
                          >
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                            {formatTimestamp(notification.timestamp)}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="flex-shrink-0">
                            <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>

          {/* Sticky Footer */}
          {unreadCount > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <Button
                onClick={markAllAsRead}
                variant="outline"
                className="w-full text-purple-600 border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
              >
                Mark all as read
              </Button>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </>
  )
}
