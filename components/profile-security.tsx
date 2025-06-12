"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ProfileSecurity() {
  const { toast } = useToast()
  // Mock last password update
  const lastPasswordUpdate = "2024-01-15T10:30:00Z"

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleForgotPassword = () => {
    toast({
      title: "Reset instructions sent",
      description: "Reset instructions sent to your email",
      duration: 3000,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Shield className="h-6 w-6 mr-3 text-violet-600" />
        <h1 className="text-2xl font-bold text-gray-900">Login & Security</h1>
      </div>

      {/* Login Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Login Information</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Email Address</Label>
              <p className="text-gray-900">user@example.com</p>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              Verified
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Password</Label>
              <p className="text-gray-600">••••••••</p>
              <p className="text-sm text-gray-500">Last updated: {formatDate(lastPasswordUpdate)}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={() => console.log("Change email clicked")}
          variant="outline"
          className="flex-1 border-violet-300 text-violet-700 hover:bg-violet-50"
        >
          Change Email
        </Button>
        <Button
          onClick={() => console.log("Change password clicked")}
          className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
        >
          Change Password
        </Button>
      </div>

      {/* Forgot Password Section */}
      <div className="pt-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-3">Can't remember your current password?</p>
          <Button
            variant="link"
            onClick={handleForgotPassword}
            className="text-violet-600 hover:text-violet-700 p-0 h-auto"
          >
            Forgot Password?
          </Button>
        </div>
      </div>
    </div>
  )
}
