"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
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
    <div className="min-h-screen bg-white">
      <Header />
      <main className="px-4 sm:px-6 lg:px-8 max-w-md mx-auto py-16">
        <Card className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-violet-600" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">Email Verified Successfully!</h1>

          <div className="flex items-center justify-center mb-6 text-gray-600">
            <Mail className="w-5 h-5 mr-2" />
            <span className="text-sm">{email}</span>
          </div>

          <p className="text-gray-600 mb-8">
            Your email address has been successfully verified. You can now access all features of your account.
          </p>

          <Button
            onClick={handleContinue}
            className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
          >
            Continue to Profile
          </Button>
        </Card>
      </main>
    </div>
  )
}
