"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertTriangle, X } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

interface DeleteAccountModalProps {
  isOpen: boolean
  onClose: () => void
}

export function DeleteAccountModal({ isOpen, onClose }: DeleteAccountModalProps) {
  const [confirmText, setConfirmText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const { logout } = useAuth()
  const router = useRouter()

  // Блокировка скролла при открытии модального окна
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleDelete = async () => {
    if (confirmText !== "УДАЛИТЬ") return

    setIsDeleting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Clear all storage
      localStorage.clear()
      sessionStorage.clear()

      // Clear cookies
      document.cookie.split(";").forEach((c) => {
        const eqPos = c.indexOf("=")
        const name = eqPos > -1 ? c.substr(0, eqPos) : c
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/"
      })

      // Logout and redirect
      logout()
      router.push("/")
      onClose()
    } catch (error) {
      console.error("Failed to delete account:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleClose = () => {
    if (!isDeleting) {
      setConfirmText("")
      onClose()
    }
  }

  if (!isOpen) return null

  return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Затемнение фона */}
        <div className="fixed inset-0 bg-black/80 transition-opacity" onClick={handleClose} />

        {/* Контейнер для центрирования модального окна */}
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          {/* Само модальное окно */}
          <div className="relative transform overflow-hidden rounded-sm bg-background text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md">
            {/* Кнопка закрытия */}
            <button
                type="button"
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
                onClick={handleClose}
                disabled={isDeleting}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>

            {/* Содержимое модального окна */}
            <div className="p-6">
              {/* Заголовок */}
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <div>
                  <h3 className="text-lg font-semibold leading-none tracking-tight text-left">Удалить аккаунт</h3>
                  <p className="text-sm text-muted-foreground text-left mt-1.5">Это действие нельзя отменить</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4">
                  <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">Что будет удалено:</h4>
                  <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                    <li>• Ваш профиль и все личные данные</li>
                    <li>• История бронирований</li>
                    <li>• Сохраненные специалисты</li>
                    <li>• Все настройки и предпочтения</li>
                  </ul>
                </div>

                <div>
                  <Label htmlFor="confirm-delete" className="text-sm font-medium">
                    Для подтверждения введите пароль
                  </Label>
                  <Input
                      id="confirm-delete"
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                      placeholder="Введите пароль"
                      className="mt-2"
                      disabled={isDeleting}
                  />
                </div>
              </div>

              {/* Футер с кнопками */}
              <div className="mt-6 flex justify-between gap-2">
                <Button variant="outline" onClick={handleClose} disabled={isDeleting}>
                  Отмена
                </Button>
                <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={confirmText !== "УДАЛИТЬ" || isDeleting}
                >
                  {isDeleting ? "Удаление..." : "Удалить аккаунт"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}
