"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Check, AlertCircle, Lock } from "lucide-react"

export default function SetNewPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false,
  })
  const [passwords, setPasswords] = useState({
    new: "",
    confirm: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [token] = useState(searchParams.get("token") || "")

  const togglePasswordVisibility = (field: "new" | "confirm") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const isPasswordValid = passwords.new.length >= 8
  const doPasswordsMatch = passwords.new === passwords.confirm
  const canSubmit = passwords.new && passwords.confirm && isPasswordValid && doPasswordsMatch

  const handleSubmit = async () => {
    if (!canSubmit) return

    setIsSubmitting(true)

    // Mock API call
    setTimeout(() => {
      console.log("Password updated with token:", token)
      setIsSubmitting(false)
      router.push("/profile?section=security")
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Header />
      <main className="px-4 sm:px-6 lg:px-8 max-w-md mx-auto py-16">
        <Card className="p-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center transition-colors duration-300">
              <Lock className="w-8 h-8 text-violet-600 dark:text-violet-400" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 text-center transition-colors duration-300">
            Set New Password
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-8 text-center transition-colors duration-300">
            Please enter your new password below
          </p>

          <div className="space-y-6">
            <div>
              <Label htmlFor="newPassword" className="text-gray-900 dark:text-gray-100 transition-colors duration-300">
                New Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="newPassword"
                  type={showPasswords.new ? "text" : "password"}
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  placeholder="Enter new password"
                  className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 transition-colors duration-300"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300"
                >
                  {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {passwords.new && !isPasswordValid && (
                <div className="flex items-center mt-1 text-red-600 dark:text-red-400 text-sm transition-colors duration-300">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Password must be at least 8 characters long
                </div>
              )}
              {passwords.new && isPasswordValid && (
                <div className="flex items-center mt-1 text-green-600 dark:text-green-400 text-sm transition-colors duration-300">
                  <Check className="h-4 w-4 mr-1" />
                  Password meets requirements
                </div>
              )}
            </div>

            <div>
              <Label
                htmlFor="confirmPassword"
                className="text-gray-900 dark:text-gray-100 transition-colors duration-300"
              >
                Confirm New Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="confirmPassword"
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  placeholder="Confirm new password"
                  className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 transition-colors duration-300"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300"
                >
                  {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {passwords.confirm && !doPasswordsMatch && (
                <div className="flex items-center mt-1 text-red-600 dark:text-red-400 text-sm transition-colors duration-300">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Passwords do not match
                </div>
              )}
              {passwords.confirm && doPasswordsMatch && passwords.new && (
                <div className="flex items-center mt-1 text-green-600 dark:text-green-400 text-sm transition-colors duration-300">
                  <Check className="h-4 w-4 mr-1" />
                  Passwords match
                </div>
              )}
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
              className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white transition-all duration-300"
            >
              {isSubmitting ? "Updating Password..." : "Update Password"}
            </Button>
          </div>
        </Card>
      </main>
    </div>
  )
}
