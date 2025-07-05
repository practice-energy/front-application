"use client"

import type React from "react"

import { useState } from "react"
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslations } from "@/hooks/use-translations"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const { t } = useTranslations()
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsLoading(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 transition-colors duration-300">
        <Card className="w-full max-w-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center transition-colors duration-300">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">
              {t("forgotPassword.emailSent")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-gray-600 dark:text-gray-400 transition-colors duration-300">
              {t("forgotPassword.checkEmail")} <span className="font-medium">{email}</span>
            </p>
            <p className="text-center text-sm text-gray-500 dark:text-gray-500 transition-colors duration-300">
              {t("forgotPassword.emailInstructions")}
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => {
                  setIsSubmitted(false)
                  setEmail("")
                }}
                variant="outline"
                className="w-full border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
              >
                {t("forgotPassword.tryDifferentEmail")}
              </Button>
              <Link href="/" className="block">
                <Button className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white transition-all duration-300">
                  {t("forgotPassword.backToHome")}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 transition-colors duration-300">
      <Card className="w-full max-w-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">
            {t("forgotPassword.title")}
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-400 mt-2 transition-colors duration-300">
            {t("forgotPassword.description")}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300"
              >
                {t("auth.email")}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder={t("forgotPassword.enterEmail")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 transition-colors duration-300"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? t("forgotPassword.sending") : t("forgotPassword.sendResetLink")}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              {t("forgotPassword.backToLogin")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
