"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Shield, Key, Mail, AlertTriangle, CheckCircle } from "lucide-react"
import { DeleteAccountModal } from "@/components/modals/delete-account-modal"
import {useProfileStore} from "@/stores/profile-store";

export function SecuritySection() {
  const { user, stats } = useProfileStore()
  const [emailVerified] = useState(user?.email.verified)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  return (
    <div className="w-full max-w-[935px] mx-auto px-4 lg:px-6 space-y-6 transition-all duration-300">
      {/* Account Verification - Keep this section */}
      <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-lg">
        <CardHeader className="p-6">
          <CardTitle className="flex items-center gap-2 dark:text-gray-100">
            <Shield className="h-5 w-5 text-violet-600" />
            Account Verification
          </CardTitle>
          <CardDescription className="dark:text-gray-400">
            Verify your contact information to secure your account
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-4">
          <div className="flex items-center justify-between p-4 bg-violet-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <div>
                <p className="font-medium dark:text-gray-200">Email Address</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">john.doe@example.com</p>
              </div>
            </div>
            {emailVerified ? (
              <Badge className="bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 rounded-sm">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            ) : (
              <Button size="sm" variant="outline">
                Verify
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Password & Authentication - Keep this section */}
      <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-lg">
        <CardHeader className="p-6">
          <CardTitle className="flex items-center gap-2 dark:text-gray-100">
            <Key className="h-5 w-5 text-violet-600" />
            Password & Authentication
          </CardTitle>
          <CardDescription className="dark:text-gray-400">
            Update your password and enable two-factor authentication
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password" className="dark:text-gray-200">
                Current Password
              </Label>
              <Input
                id="current-password"
                type="password"
                placeholder="Enter current password"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password" className="dark:text-gray-200">
                New Password
              </Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Enter new password"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="dark:text-gray-200">
                Confirm New Password
              </Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm new password"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              />
            </div>
            <Button className="w-full">Update Password</Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Account Section - NEW */}
      <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-lg border-red-200 dark:border-red-800">
        <CardHeader className="p-6">
          <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertTriangle className="h-5 w-5" />
            Delete Account
          </CardTitle>
          <CardDescription className="dark:text-gray-400">
            Permanently delete your account and all associated data
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              {/*<AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />*/}
              <div className="space-y-2">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  Warning: This action cannot be undone
                </p>
                <p className="text-sm text-red-700 dark:text-red-300">
                  Deleting your account will permanently remove all your data, including bookings, messages, saved
                  specialists, and account balance. You will not be able to recover this information.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              variant="destructive"
              // size="lg"
              onClick={() => setIsDeleteModalOpen(true)}
              className="py-3 px-6 gap-2 "
            >
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Account Modal */}
      <DeleteAccountModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} />
    </div>
  )
}
