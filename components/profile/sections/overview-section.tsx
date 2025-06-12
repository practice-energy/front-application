"use client"

import { useState } from "react"
import { useProfileStore } from "@/stores/profile-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Edit, Camera, CheckCircle, AlertCircle, Calendar, BookOpen, Heart } from "lucide-react"
import { ProfileEditModal } from "@/components/profile/profile-edit-modal"
import { ProfilePhotoModal } from "@/components/profile/profile-photo-modal"

export function OverviewSection() {
  const { user, stats } = useProfileStore()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false)

  if (!user || !stats) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile Overview</h1>
        <p className="text-gray-600">Manage your account and view your activity</p>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Your profile details and verification status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Photo and Basic Info */}
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Avatar */}
            <div className="flex flex-col items-center space-y-3">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.photo_url || "/placeholder.svg"} />
                <AvatarFallback className="text-xl">
                  {user.first_name[0]}
                  {user.last_name[0]}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" onClick={() => setIsPhotoModalOpen(true)} className="gap-2">
                <Camera className="h-4 w-4" />
                Update Photo
              </Button>
            </div>

            {/* User Details */}
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {user.first_name} {user.last_name}
                </h3>
                <p className="text-gray-600">{user.email.address}</p>
              </div>

              {/* Email Verification Status */}
              <div className="flex items-center gap-2">
                {user.email.verified ? (
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Email Verified
                  </Badge>
                ) : (
                  <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Email Not Verified
                  </Badge>
                )}
              </div>

              {/* Edit Profile Button - Fixed Position */}
              <div className="pt-2">
                <Button onClick={() => setIsEditModalOpen(true)} className="gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => useProfileStore.getState().setActiveSection("calendar")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeBookings}</div>
            <p className="text-xs text-gray-600">Upcoming sessions</p>
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => useProfileStore.getState().setActiveSection("calendar")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Sessions</CardTitle>
            <BookOpen className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedSessions}</div>
            <p className="text-xs text-gray-600">Total completed</p>
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => useProfileStore.getState().setActiveSection("saved")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Specialists</CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSaved}</div>
            <p className="text-xs text-gray-600">Specialists saved</p>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <ProfileEditModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
      <ProfilePhotoModal isOpen={isPhotoModalOpen} onClose={() => setIsPhotoModalOpen(false)} />
    </div>
  )
}
