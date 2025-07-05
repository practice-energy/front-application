"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle, Trash2 } from "lucide-react"

interface DeleteAccountModalProps {
  isOpen: boolean
  onClose: () => void
}

export function DeleteAccountModal({ isOpen, onClose }: DeleteAccountModalProps) {
  const [password, setPassword] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!password.trim()) return

    setIsDeleting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      // Handle account deletion logic here
      console.log("Account deleted")
      onClose()
    } catch (error) {
      console.error("Failed to delete account:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCancel = () => {
    setPassword("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Confirm Account Deletion
          </DialogTitle>
          <DialogDescription className="text-left space-y-2">
            <p>
              This action cannot be undone. This will permanently delete your account and remove all your data from our
              servers.
            </p>
            <p className="font-medium text-gray-900 dark:text-gray-100">You will lose access to:</p>
            <ul className="list-disc list-inside text-sm space-y-1 ml-4">
              <li>All your bookings and appointments</li>
              <li>Saved specialists and preferences</li>
              <li>Chat history and messages</li>
              <li>Account balance and transaction history</li>
            </ul>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password-confirm" className="text-sm font-medium">
              Enter your password to confirm deletion:
            </Label>
            <Input
              id="password-confirm"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full"
              disabled={isDeleting}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={!password.trim() || isDeleting}
            className="gap-2"
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete Account
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
