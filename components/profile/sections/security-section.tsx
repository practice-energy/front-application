"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useProfileStore } from "@/stores/profile-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, Check, AlertCircle, Mail, CheckCircle, Info } from "lucide-react"
import { securityService } from "@/services/mock-data"

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

type PasswordFormData = z.infer<typeof passwordSchema>
type EmailFormData = z.infer<typeof emailSchema>

export function SecuritySection() {
  const { user } = useProfileStore()
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isRecoveryLoading, setIsRecoveryLoading] = useState(false)
  const [recoverySuccess, setRecoverySuccess] = useState(false)
  const [showRecoveryInfo, setShowRecoveryInfo] = useState(false)
  const [isChangeEmailModalOpen, setIsChangeEmailModalOpen] = useState(false)
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false)

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: user?.email.address || "",
    },
  })

  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      setErrorMessage("")
      await securityService.updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })
      setSuccessMessage("Password updated successfully")
      passwordForm.reset()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to update password")
    }
  }

  const onEmailSubmit = async (data: EmailFormData) => {
    try {
      setErrorMessage("")
      await securityService.updateEmail(data.email)
      setSuccessMessage("Verification email sent to " + data.email)
      setIsChangeEmailModalOpen(false)
    } catch (error) {
      setErrorMessage("Failed to update email")
    }
  }

  const handlePasswordRecovery = async () => {
    try {
      setIsRecoveryLoading(true)
      setErrorMessage("")
      await securityService.sendPasswordRecovery(user?.email.address || "")
      setRecoverySuccess(true)
      setShowRecoveryInfo(true)
      setTimeout(() => {
        setRecoverySuccess(false)
      }, 3000)
    } catch (error) {
      setErrorMessage("Failed to send recovery email")
    } finally {
      setIsRecoveryLoading(false)
    }
  }

  const handleVerifyEmail = async () => {
    try {
      setIsVerifyingEmail(true)
      setErrorMessage("")
      await securityService.sendEmailVerification(user?.email.address || "")
      setSuccessMessage("Verification email sent successfully")
    } catch (error) {
      setErrorMessage("Failed to send verification email")
    } finally {
      setIsVerifyingEmail(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Security Settings</h1>
        <p className="text-gray-600">Manage your account security and password</p>
      </div>

      {/* Recovery Info Badge */}
      {showRecoveryInfo && (
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Password recovery email has been sent to your email address. Please check your inbox and follow the
            instructions to reset your password.
          </AlertDescription>
        </Alert>
      )}

      {/* Success/Error Messages */}
      {successMessage && (
        <Alert className="bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
        </Alert>
      )}

      {errorMessage && (
        <Alert className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{errorMessage}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Email Management */}
        <Card>
          <CardHeader>
            <CardTitle>Email Address</CardTitle>
            <CardDescription>Manage your email address and verification status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current Email Display */}
            <div className="space-y-3">
              <Label>Current Email</Label>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{user?.email.address}</span>
                  {user?.email.verified ? (
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Unverified
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Email Actions */}
            <div className="space-y-3">
              {!user?.email.verified && (
                <Button
                  onClick={handleVerifyEmail}
                  disabled={isVerifyingEmail}
                  className="w-full bg-violet-600 hover:bg-violet-700"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  {isVerifyingEmail ? "Sending..." : "Verify Email"}
                </Button>
              )}

              <Dialog open={isChangeEmailModalOpen} onOpenChange={setIsChangeEmailModalOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change Email Address</DialogTitle>
                    <DialogDescription>
                      Enter your new email address. You'll need to verify it before the change takes effect.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="newEmail">New Email Address</Label>
                      <Input id="newEmail" type="email" {...emailForm.register("email")} />
                      {emailForm.formState.errors.email && (
                        <p className="text-sm text-red-600">{emailForm.formState.errors.email.message}</p>
                      )}
                    </div>
                    <DialogFooter>
                      <Button variant="outline" type="button" onClick={() => setIsChangeEmailModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={emailForm.formState.isSubmitting}
                        className="bg-violet-600 hover:bg-violet-700"
                      >
                        {emailForm.formState.isSubmitting ? "Updating..." : "Update Email"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Password Recovery */}
        <Card>
          <CardHeader>
            <CardTitle>Password Recovery</CardTitle>
            <CardDescription>Reset your password via email</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                If you've forgotten your password or want to reset it for security reasons, we can send you a secure
                reset link via email.
              </p>
              <Button
                onClick={handlePasswordRecovery}
                className="w-full bg-violet-600 hover:bg-violet-700"
                disabled={isRecoveryLoading}
              >
                <Mail className="mr-2 h-4 w-4" />
                {isRecoveryLoading ? "Sending..." : "Recover Password"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Password Change Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your account password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    {...passwordForm.register("currentPassword")}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {passwordForm.formState.errors.currentPassword && (
                  <p className="text-sm text-red-600">{passwordForm.formState.errors.currentPassword.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    {...passwordForm.register("newPassword")}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {passwordForm.formState.errors.newPassword && (
                  <p className="text-sm text-red-600">{passwordForm.formState.errors.newPassword.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" {...passwordForm.register("confirmPassword")} />
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-600">{passwordForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="bg-violet-600 hover:bg-violet-700"
                disabled={passwordForm.formState.isSubmitting}
              >
                {passwordForm.formState.isSubmitting ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
