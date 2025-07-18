"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Mail } from "lucide-react"

export default function EmailVerifiedPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")

  useEffect(() => {
    // Get email from URL params or use default
    const emailParam = searchParams.get("email")
    setEmail(emailParam || "user@example.com")
  }, [searchParams])

  const handleContinue = () => {
    router.push("/profile?section=security")
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <main className="px-4 sm:px-6 lg:px-8 max-w-md mx-auto py-16">
        <Card className="p-8 text-center bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center transition-colors duration-300">
              <CheckCircle className="w-8 h-8 text-violet-600 dark:text-violet-400" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-300">
            Email Verified Successfully!
          </h1>

          <div className="flex items-center justify-center mb-6 text-gray-600 dark:text-gray-400 transition-colors duration-300">
            <Mail className="w-5 h-5 mr-2" />
            <span className="text-sm">{email}</span>
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-8 transition-colors duration-300">
            Your email address has been successfully verified. You can now access all features of your account.
          </p>

          <button
            onClick={handleContinue}
            className="w-full bg-gradient-to-r text-white transition-all duration-300"
          >
            Continue to Profile
          </button>
        </Card>
      </main>
    </div>
  )
}
