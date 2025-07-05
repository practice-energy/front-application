"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Camera, Check, X, User, Calendar } from "lucide-react"
import { ProfilePhotoUpload } from "@/components/profile-photo-upload"

interface ProfileData {
  first_name: string
  last_name: string
  about: string
  email: {
    address: string
    verified: boolean
  }
  time_on_platform: string
  photo_url: string
  account_balance: number
  created_at: string
}

interface ProfileOverviewProps {
  profileData: ProfileData
}

export function ProfileOverview({ profileData }: ProfileOverviewProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [showPhotoUpload, setShowPhotoUpload] = useState(false)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 200, height: 200 })
  const [formData, setFormData] = useState({
    first_name: profileData.first_name,
    last_name: profileData.last_name,
    about: profileData.about,
  })

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setPhotoPreview(e.target.result as string)
          setShowPhotoUpload(true)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSavePhoto = () => {
    // Here you would upload the cropped photo
    console.log("Saving photo with crop area:", cropArea)
    setShowPhotoUpload(false)
    setPhotoFile(null)
    setPhotoPreview(null)
  }

  const handleSave = () => {
    // Here you would save the profile data
    console.log("Saving profile data:", formData)
    setIsEditing(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Personal Information</h1>
          <p className="text-gray-600">Manage your account details and preferences</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowPhotoUpload(true)}
            className="border-violet-300 text-violet-700 hover:bg-violet-50"
          >
            <Camera className="h-4 w-4 mr-2" />
            Update Photo
          </Button>
          {!isEditing ? (
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="border-violet-300 text-violet-700 hover:bg-violet-50"
            >
              Edit Profile
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false)
                  setFormData({
                    first_name: profileData.first_name,
                    last_name: profileData.last_name,
                    about: profileData.about,
                  })
                }}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
              >
                <Check className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Profile Card - Remove the gradient header with photo */}
      <Card className="overflow-hidden border-0 shadow-lg">
        <div className="p-8 bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <User className="h-5 w-5 mr-2 text-violet-600" />
                Personal Details
              </h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 mb-2 block">
                    First Name
                  </Label>
                  {isEditing ? (
                    <Input
                      id="firstName"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      className="border-gray-300 focus:border-violet-500 focus:ring-violet-500"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-900 font-medium">{profileData.first_name}</p>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 mb-2 block">
                    Last Name
                  </Label>
                  {isEditing ? (
                    <Input
                      id="lastName"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      className="border-gray-300 focus:border-violet-500 focus:ring-violet-500"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-900 font-medium">{profileData.last_name}</p>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
                    Email Address
                  </Label>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-900 font-medium">{profileData.email.address}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {profileData.email.verified
                        ? "Your email address is verified"
                        : "Please verify your email address"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Information - Remove balance preview and duplicate tenure */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-violet-600" />
                Account Information
              </h3>

              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-sm border border-violet-200">
                  <div className="flex items-center mb-2">
                    <Calendar className="h-5 w-5 mr-2 text-violet-600" />
                    <Label className="text-sm font-medium text-violet-700">Member Since</Label>
                  </div>
                  <p className="text-2xl font-bold text-violet-900">{formatDate(profileData.created_at)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">About Me</h3>
            {isEditing ? (
              <Textarea
                id="about"
                value={formData.about}
                onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                className="border-gray-300 focus:border-violet-500 focus:ring-violet-500"
                rows={4}
                placeholder="Tell us about yourself..."
              />
            ) : (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-900 leading-relaxed">{profileData.about || "No description provided yet."}</p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Photo Upload Modal */}
      <ProfilePhotoUpload
        isOpen={showPhotoUpload}
        onClose={() => setShowPhotoUpload(false)}
        photoUrl={photoPreview}
        onSave={(croppedImage) => {
          console.log("Saving cropped image:", croppedImage.substring(0, 50) + "...")
          setShowPhotoUpload(false)
        }}
      />
    </div>
  )
}
