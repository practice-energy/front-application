"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertTriangle } from "lucide-react"
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

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <DialogTitle className="text-left">Удалить аккаунт</DialogTitle>
              <DialogDescription className="text-left">Это действие нельзя отменить</DialogDescription>
            </div>
          </div>
        </DialogHeader>

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
              Для подтверждения введите <span className="font-bold">УДАЛИТЬ</span>
            </Label>
            <Input
              id="confirm-delete"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Введите УДАЛИТЬ"
              className="mt-2"
              disabled={isDeleting}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isDeleting}>
            Отмена
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={confirmText !== "УДАЛИТЬ" || isDeleting}>
            {isDeleting ? "Удаление..." : "Удалить аккаунт"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
