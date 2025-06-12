"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Save, Edit, Check, X, Plus, GripVertical, Eye, Upload } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface PhotoItem {
  id: string
  file: File
  url: string
}

export function SpecialistProfileEdit() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    title: "Spiritual Guide & Life Coach",
    bio: "With over 15 years of experience in spiritual guidance and life coaching, I help clients find clarity, purpose, and balance. My approach combines traditional astrological wisdom with modern coaching techniques to create personalized paths for growth and transformation.",
    experience: [
      "Senior Life Coach at Mindful Living Center (2015-Present)",
      "Spiritual Guide at Wellness Collective (2010-2015)",
    ],
    education: ["Certified Life Coach, International Coach Federation", "Master's in Psychology, Stanford University"],
    specialties: ["Astrology", "Life Coaching", "Meditation"],
    location: "San Francisco, CA",
    languages: ["English", "Spanish"],
    photos: [] as PhotoItem[],
  })

  const [editedData, setEditedData] = useState(profileData)
  const [customSpecialty, setCustomSpecialty] = useState("")
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const specialtyOptions = [
    "Астрология",
    "Таро и оракулы",
    "Нумерология",
    "Медитация и визуализация",
    "Энергетические практики",
    "Рейки и целительство",
    "Магия",
    "Предназначение",
    "Карма и реинкарнация",
    "Алхимия внутренняя",
    "Внутренняя алхимия",
    "Шаманизм",
    "Нумерология",
    "Древние учения",
    "Подсознание",
    "Ангелология",
    "Синхроничности и знаки",
    "Кристаллы и минералы",
    "Символизм и геометрия",
    "Манифестация",
    "Теневая работа",
    "Астральные путешествия",
    "Родовая система и предки",
    "Хьюман-дизайн",
    "Квантовые практики",
    "Тета-хиллинг",
  ]

  const handleSave = () => {
    setProfileData(editedData)
    setIsEditing(false)
    // Here you would typically save to your backend
    console.log("Saving profile data:", editedData)
  }

  const handleCancel = () => {
    setEditedData(profileData)
    setIsEditing(false)
  }

  const toggleSpecialty = (specialty: string) => {
    setEditedData((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter((s) => s !== specialty)
        : [...prev.specialties, specialty],
    }))
  }

  const handleExperienceChange = (index: number, value: string) => {
    setEditedData((prev) => ({
      ...prev,
      experience: prev.experience.map((item, i) => (i === index ? value : item)),
    }))
  }

  const addExperienceItem = () => {
    setEditedData((prev) => ({
      ...prev,
      experience: [...prev.experience, ""],
    }))
  }

  const removeExperienceItem = (index: number) => {
    setEditedData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }))
  }

  const handleEducationChange = (index: number, value: string) => {
    setEditedData((prev) => ({
      ...prev,
      education: prev.education.map((item, i) => (i === index ? value : item)),
    }))
  }

  const addEducationItem = () => {
    setEditedData((prev) => ({
      ...prev,
      education: [...prev.education, ""],
    }))
  }

  const removeEducationItem = (index: number) => {
    setEditedData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }))
  }

  const addCustomSpecialty = () => {
    if (customSpecialty.trim() && !editedData.specialties.includes(customSpecialty.trim())) {
      setEditedData((prev) => ({
        ...prev,
        specialties: [...prev.specialties, customSpecialty.trim()],
      }))
      setCustomSpecialty("")
    }
  }

  const removeSpecialty = (specialtyToRemove: string) => {
    setEditedData((prev) => ({
      ...prev,
      specialties: prev.specialties.filter((s) => s !== specialtyToRemove),
    }))
  }

  const handlePhotoUpload = (files: FileList | null) => {
    if (!files) return

    const newPhotos: PhotoItem[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      url: URL.createObjectURL(file),
    }))

    setEditedData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...newPhotos].slice(0, 10), // Limit to 10 photos
    }))
  }

  const removePhoto = (photoId: string) => {
    setEditedData((prev) => ({
      ...prev,
      photos: prev.photos.filter((photo) => photo.id !== photoId),
    }))
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (draggedIndex === null) return

    const newPhotos = [...editedData.photos]
    const draggedPhoto = newPhotos[draggedIndex]
    newPhotos.splice(draggedIndex, 1)
    newPhotos.splice(dropIndex, 0, draggedPhoto)

    setEditedData((prev) => ({
      ...prev,
      photos: newPhotos,
    }))
    setDraggedIndex(null)
  }

  const movePhoto = (fromIndex: number, toIndex: number) => {
    const newPhotos = [...editedData.photos]
    const [movedPhoto] = newPhotos.splice(fromIndex, 1)
    newPhotos.splice(toIndex, 0, movedPhoto)

    setEditedData((prev) => ({
      ...prev,
      photos: newPhotos,
    }))
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button onClick={handleCancel} variant="outline">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-violet-600 hover:bg-violet-700 text-white">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {/* Basic Info */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Professional Title</Label>
            {isEditing ? (
              <Input
                id="title"
                value={editedData.title}
                onChange={(e) => setEditedData({ ...editedData, title: e.target.value })}
                className="mt-1"
              />
            ) : (
              <p className="mt-1 text-lg font-semibold">{profileData.title}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Location</Label>
              {isEditing ? (
                <Input
                  id="location"
                  value={editedData.location}
                  onChange={(e) => setEditedData({ ...editedData, location: e.target.value })}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1">{profileData.location}</p>
              )}
            </div>
            <div>
              <Label>Languages</Label>
              {isEditing ? (
                <Input
                  value={editedData.languages.join(", ")}
                  onChange={(e) => setEditedData({ ...editedData, languages: e.target.value.split(", ") })}
                  className="mt-1"
                  placeholder="English, Spanish"
                />
              ) : (
                <p className="mt-1">{profileData.languages.join(", ")}</p>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Bio */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Professional Bio</h3>
        {isEditing ? (
          <Textarea
            value={editedData.bio}
            onChange={(e) => setEditedData({ ...editedData, bio: e.target.value })}
            rows={5}
            placeholder="Tell potential clients about yourself, your approach, and your experience..."
          />
        ) : (
          <p className="text-gray-700 leading-relaxed">{profileData.bio}</p>
        )}
      </Card>

      {/* Experience and Education */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Experience</h3>
          {isEditing ? (
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-4 space-y-3">
              {editedData.experience.map((item, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-lg border border-gray-200 p-3 hover:border-violet-300 hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <GripVertical className="h-4 w-4 text-gray-400" />
                      <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
                    </div>
                    <Input
                      value={item}
                      onChange={(e) => handleExperienceChange(index, e.target.value)}
                      placeholder="Add your work experience..."
                      className="flex-1 border-0 bg-transparent focus:ring-0 focus:border-0 p-0 text-gray-700"
                    />
                    {editedData.experience.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExperienceItem(index)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addExperienceItem}
                className="w-full flex items-center justify-center space-x-2 text-violet-600 border-violet-300 hover:bg-violet-50 border-dashed py-3 rounded-lg"
              >
                <Plus className="h-4 w-4" />
                <span>Add Experience</span>
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {profileData.experience.map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-violet-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <span className="text-violet-600 text-xs">•</span>
                  </div>
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Education & Credentials</h3>
          {isEditing ? (
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-4 space-y-3">
              {editedData.education.map((item, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-lg border border-gray-200 p-3 hover:border-violet-300 hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <GripVertical className="h-4 w-4 text-gray-400" />
                      <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
                    </div>
                    <Input
                      value={item}
                      onChange={(e) => handleEducationChange(index, e.target.value)}
                      placeholder="Add your education or certification..."
                      className="flex-1 border-0 bg-transparent focus:ring-0 focus:border-0 p-0 text-gray-700"
                    />
                    {editedData.education.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEducationItem(index)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addEducationItem}
                className="w-full flex items-center justify-center space-x-2 text-violet-600 border-violet-300 hover:bg-violet-50 border-dashed py-3 rounded-lg"
              >
                <Plus className="h-4 w-4" />
                <span>Add Education</span>
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {profileData.education.map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-violet-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <span className="text-violet-600 text-xs">•</span>
                  </div>
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Specialties */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Select Your Specialties</h3>
        {isEditing ? (
          <div className="space-y-6">
            <p className="text-gray-600">Choose the areas where you can help others</p>

            {/* Specialty Grid */}
            <div className="flex flex-wrap justify-center gap-3">
              {specialtyOptions.map((specialty) => {
                const isSelected = editedData.specialties.includes(specialty)
                return (
                  <button
                    key={specialty}
                    type="button"
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                      isSelected
                        ? "bg-violet-500 text-white border-violet-500"
                        : "bg-white text-gray-700 border-gray-200 hover:border-violet-300 hover:bg-violet-50"
                    }`}
                    onClick={() => toggleSpecialty(specialty)}
                  >
                    {specialty}
                  </button>
                )
              })}
            </div>

            {/* Custom Specialty Input */}
            <div className="mt-4">
              <Label htmlFor="customSpecialty" className="text-sm font-medium text-gray-700">
                Add Custom Specialty
              </Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="customSpecialty"
                  value={customSpecialty}
                  onChange={(e) => setCustomSpecialty(e.target.value)}
                  placeholder="Enter your specialty..."
                  className="flex-1 text-sm"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addCustomSpecialty()
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={addCustomSpecialty}
                  variant="outline"
                  size="sm"
                  className="text-violet-600 border-violet-300 hover:bg-violet-50"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Selection Summary */}
            {editedData.specialties.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 bg-gray-600 rounded-md flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="font-medium text-gray-800 text-sm">
                    {editedData.specialties.length} specialt{editedData.specialties.length === 1 ? "y" : "ies"} selected
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {editedData.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-white text-gray-700 border border-gray-200"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {profileData.specialties.map((specialty, index) => (
              <Badge key={index} variant="secondary" className="bg-violet-50 text-violet-700 border border-violet-200">
                {specialty}
              </Badge>
            ))}
          </div>
        )}
      </Card>

      {/* Photo Gallery */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Photo Gallery</h3>
        {isEditing ? (
          <div className="space-y-6">
            <p className="text-gray-600">Add photos to showcase your practice</p>
            <p className="text-sm text-violet-600 font-medium">Maximum 10 photos allowed</p>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-violet-300 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handlePhotoUpload(e.target.files)}
                className="hidden"
                id="photo-upload"
              />
              <label htmlFor="photo-upload" className="cursor-pointer">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto">
                    <Upload className="h-8 w-8 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900">Upload Photos</p>
                    <p className="text-sm text-gray-500 mt-1">Click to select multiple photos (max 10)</p>
                  </div>
                </div>
              </label>
            </div>

            {editedData.photos.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-600">{editedData.photos.length} of 10 photos uploaded</p>
                  <p className="text-xs text-gray-500">Drag photos to reorder</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {editedData.photos.map((photo, index) => (
                    <div
                      key={photo.id}
                      className="relative group cursor-move"
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                    >
                      <div className="relative overflow-hidden rounded-lg border-2 border-transparent hover:border-violet-300 transition-all">
                        <img
                          src={photo.url || "/placeholder.svg"}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-32 object-cover cursor-pointer"
                          onClick={() => setSelectedPhotoIndex(index)}
                        />

                        {/* Overlay with controls */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedPhotoIndex(index)
                              }}
                              className="bg-white bg-opacity-90 text-gray-700 hover:bg-white"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                removePhoto(photo.id)
                              }}
                              className="bg-red-500 bg-opacity-90 text-white hover:bg-red-600"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Drag handle */}
                        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <GripVertical className="h-4 w-4 text-white drop-shadow-lg" />
                        </div>

                        {/* Photo number */}
                        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                          {index + 1}
                        </div>
                      </div>

                      {/* Reorder buttons */}
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                        {index > 0 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => movePhoto(index, index - 1)}
                            className="h-6 w-6 p-0 text-xs"
                          >
                            ←
                          </Button>
                        )}
                        {index < editedData.photos.length - 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => movePhoto(index, index + 1)}
                            className="h-6 w-6 p-0 text-xs"
                          >
                            →
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            {profileData.photos.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {profileData.photos.map((photo, index) => (
                  <div key={photo.id} className="relative group">
                    <img
                      src={photo.url || "/placeholder.svg"}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setSelectedPhotoIndex(index)}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                      <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No photos uploaded yet</p>
            )}
          </div>
        )}
      </Card>

      {/* Photo Preview Modal */}
      {selectedPhotoIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <img
              src={editedData.photos[selectedPhotoIndex]?.url || profileData.photos[selectedPhotoIndex]?.url}
              alt={`Gallery ${selectedPhotoIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg"
            />

            {/* Close button */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setSelectedPhotoIndex(null)}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white hover:bg-black hover:bg-opacity-70"
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Navigation buttons */}
            {selectedPhotoIndex > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSelectedPhotoIndex(selectedPhotoIndex - 1)}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white hover:bg-black hover:bg-opacity-70"
              >
                ←
              </Button>
            )}

            {selectedPhotoIndex < (editedData.photos.length || profileData.photos.length) - 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSelectedPhotoIndex(selectedPhotoIndex + 1)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white hover:bg-black hover:bg-opacity-70"
              >
                →
              </Button>
            )}

            {/* Photo counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
              {selectedPhotoIndex + 1} of {editedData.photos.length || profileData.photos.length}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
