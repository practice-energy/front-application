"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useProfileStore } from "@/stores/profile-store"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Upload, Crop } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProfilePhotoModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ProfilePhotoModal({ isOpen, onClose }: ProfilePhotoModalProps) {
  const { user, setUser } = useProfileStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null)

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setIsUploading(true)
      const reader = new FileReader()
      reader.onload = (e) => {
        setTimeout(() => {
          setSelectedImage(e.target?.result as string)
          setIsUploading(false)
        }, 1000)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleSave = async () => {
    try {
      if (user && selectedImage) {
        const updatedUser = {
          ...user,
          photo_url: selectedImage,
        }
        setUser(updatedUser)
      }
      onClose()
      setSelectedImage(null)
    } catch (error) {
      console.error("Failed to update profile photo:", error)
    }
  }

  const handleCancel = () => {
    setSelectedImage(null)
    setProfilePhotoPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    onClose()
  }

  useEffect(() => {
    if (!isOpen) {
      setSelectedImage(null)
      setProfilePhotoPreview(null)
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Profile Photo</DialogTitle>
          <DialogDescription>Upload and crop your profile photo</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current/Preview Photo */}
          <div className="flex justify-center">
            <Avatar className="h-32 w-32">
              <AvatarImage src={selectedImage || user?.photo_url || "/placeholder.svg"} />
              <AvatarFallback className="text-2xl">
                {user?.first_name?.[0]}
                {user?.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Upload Area */}
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
              isDragOver ? "border-purple-500 bg-purple-50" : "border-gray-300 hover:border-gray-400",
              isUploading && "opacity-50 cursor-not-allowed",
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => !isUploading && fileInputRef.current?.click()}
          >
            {isUploading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600" />
                <span className="ml-2 text-sm">Uploading...</span>
              </div>
            ) : (
              <div>
                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Drag & drop or click to upload</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
              </div>
            )}
          </div>

          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInputChange} className="hidden" />

          {selectedImage && (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <Crop className="h-4 w-4" />
              <span>Crop functionality would be implemented here</span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!selectedImage}>
            Save Photo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
