"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ExpandableListEditor } from "./expandable-list-editor"
import {
  Plus,
  Edit,
  Trash2,
  Settings,
  DollarSign,
  Clock,
  Camera,
  X,
  GripVertical,
  Save,
  AlertTriangle,
  Package,
} from "lucide-react"

interface Service {
  id: string
  name: string
  price: number
  currency: string
  photos: (File | string)[]
  whatsIncluded: string[]
  description: string
  timeOption: "hourly" | "all-day" | "not-stated"
  duration?: number
}

export function SpecialistServicesSection() {
  const [services, setServices] = useState<Service[]>([
    {
      id: "1",
      name: "Astrology Reading",
      price: 120,
      currency: "Centi",
      photos: ["/placeholder.svg?height=200&width=300"],
      whatsIncluded: [
        "Personal birth chart analysis",
        "Career guidance",
        "Relationship insights",
        "Future predictions",
      ],
      description:
        "Comprehensive astrology reading that provides deep insights into your personality, life path, and future opportunities.",
      timeOption: "hourly",
      duration: 60,
    },
    {
      id: "2",
      name: "Life Coaching Session",
      price: 95,
      currency: "Centi",
      photos: ["/placeholder.svg?height=200&width=300"],
      whatsIncluded: ["Goal setting", "Action plan creation", "Motivation techniques", "Follow-up support"],
      description: "Personalized life coaching to help you achieve your goals and overcome challenges.",
      timeOption: "hourly",
      duration: 45,
    },
  ])

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Service>>({
    name: "",
    price: 0,
    currency: "Centi",
    photos: [],
    whatsIncluded: [],
    description: "",
    timeOption: "hourly",
    duration: 60,
  })
  const [draggedPhotoIndex, setDraggedPhotoIndex] = useState<number | null>(null)

  const resetForm = () => {
    setFormData({
      name: "",
      price: 0,
      currency: "Centi",
      photos: [],
      whatsIncluded: [],
      description: "",
      timeOption: "hourly",
      duration: 60,
    })
  }

  const handleAddService = () => {
    resetForm()
    setEditingService(null)
    setIsAddModalOpen(true)
  }

  const handleEditService = (service: Service) => {
    setFormData(service)
    setEditingService(service)
    setIsAddModalOpen(true)
  }

  const handleSaveService = () => {
    if (!formData.name || !formData.price) return

    const serviceData: Service = {
      id: editingService?.id || Date.now().toString(),
      name: formData.name!,
      price: formData.price!,
      currency: formData.currency!,
      photos: formData.photos!,
      whatsIncluded: formData.whatsIncluded!,
      description: formData.description!,
      timeOption: formData.timeOption!,
      duration: formData.duration,
    }

    if (editingService) {
      setServices((prev) => prev.map((s) => (s.id === editingService.id ? serviceData : s)))
    } else {
      setServices((prev) => [...prev, serviceData])
    }

    setIsAddModalOpen(false)
    resetForm()
    setEditingService(null)
  }

  const handleDeleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id))
    setDeleteConfirm(null)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Settings className="h-6 w-6 mr-3 text-violet-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Services Management</h2>
            <p className="text-gray-600">Manage your services, pricing, and offerings</p>
          </div>
        </div>
        <Button onClick={handleAddService} className="bg-violet-600 hover:bg-violet-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>

      {/* Services Grid */}
      {services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
              {/* Service Image */}
              <div className="aspect-video relative bg-gray-100">
                {service.photos.length > 0 ? (
                  <img
                    src={
                      typeof service.photos[0] === "string" ? service.photos[0] : URL.createObjectURL(service.photos[0])
                    }
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Camera className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex space-x-1">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleEditService(service)}
                    className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setDeleteConfirm(service.id)}
                    className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Service Content */}
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{service.name}</h3>
                  <div className="flex items-center text-violet-600 font-bold">
                    <DollarSign className="h-4 w-4" />
                    <span>
                      {service.price} {service.currency}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm line-clamp-2">{service.description}</p>

                {/* Time Option */}
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {service.timeOption === "hourly" && service.duration
                      ? `${service.duration} minutes`
                      : service.timeOption === "all-day"
                        ? "All day session"
                        : "Duration not specified"}
                  </span>
                </div>

                {/* What's Included Preview */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">What's included:</p>
                  <div className="space-y-1">
                    {service.whatsIncluded.slice(0, 2).map((item, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-violet-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-gray-600 line-clamp-1">{item}</span>
                      </div>
                    ))}
                    {service.whatsIncluded.length > 2 && (
                      <p className="text-xs text-gray-500">+{service.whatsIncluded.length - 2} more</p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No services yet</h3>
          <p className="text-gray-600 mb-6">Create your first service to start accepting bookings</p>
          <Button onClick={handleAddService} className="bg-violet-600 hover:bg-violet-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Service
          </Button>
        </Card>
      )}

      {/* Add/Edit Service Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingService ? "Edit Service" : "Add New Service"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="serviceName">Service Name *</Label>
                <Input
                  id="serviceName"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Astrology Reading"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="servicePrice">Price *</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="servicePrice"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData((prev) => ({ ...prev, price: Number(e.target.value) }))}
                    placeholder="120"
                    className="h-12"
                  />
                  <span className="text-gray-600 font-medium">Centi</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="serviceDescription">Description</Label>
              <Textarea
                id="serviceDescription"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your service and what clients can expect..."
                rows={4}
              />
            </div>

            {/* Time Options */}
            <div className="space-y-4">
              <Label>Session Duration</Label>
              <div className="space-y-4">
                {/* Hours Input */}
                <div className="flex items-center space-x-3">
                  <Input
                    type="number"
                    value={formData.timeOption === "hourly" ? (formData.duration || 60) / 60 : ""}
                    onChange={(e) => {
                      const hours = Number(e.target.value)
                      setFormData((prev) => ({
                        ...prev,
                        timeOption: "hourly",
                        duration: hours * 60,
                      }))
                    }}
                    placeholder="1"
                    className="w-20 h-10"
                    min="0.5"
                    step="0.5"
                  />
                  <span className="text-gray-600">hours</span>
                </div>

                {/* Bullet Flags */}
                <div className="space-y-2">
                  <div
                    className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      formData.timeOption === "all-day"
                        ? "border-violet-300 bg-violet-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setFormData((prev) => ({ ...prev, timeOption: "all-day" }))}
                  >
                    <div
                      className={`w-3 h-3 rounded-full border-2 ${
                        formData.timeOption === "all-day" ? "bg-violet-600 border-violet-600" : "border-gray-300"
                      }`}
                    >
                      {formData.timeOption === "all-day" && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                    <span className="text-gray-700">All day session</span>
                  </div>

                  <div
                    className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      formData.timeOption === "not-stated"
                        ? "border-violet-300 bg-violet-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setFormData((prev) => ({ ...prev, timeOption: "not-stated" }))}
                  >
                    <div
                      className={`w-3 h-3 rounded-full border-2 ${
                        formData.timeOption === "not-stated" ? "bg-violet-600 border-violet-600" : "border-gray-300"
                      }`}
                    >
                      {formData.timeOption === "not-stated" && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                    <span className="text-gray-700">Duration not specified</span>
                  </div>
                </div>
              </div>
            </div>

            {/* What's Included using ExpandableListEditor */}
            <ExpandableListEditor
              title="What's Included"
              description="Specify what clients will receive"
              icon={Package}
              items={formData.whatsIncluded || []}
              isEditing={true}
              onItemsChange={(items) => setFormData((prev) => ({ ...prev, whatsIncluded: items }))}
              placeholder="What's included in this service..."
              emptyMessage="No inclusions added yet"
              modalMode={true}
            />

            {/* Photos */}
            <div className="space-y-4">
              <Label>Service Photos</Label>

              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-violet-300 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []).slice(0, 5 - (formData.photos?.length || 0))
                    setFormData((prev) => ({
                      ...prev,
                      photos: [...(prev.photos || []), ...files].slice(0, 5),
                    }))
                  }}
                  className="hidden"
                  id="service-photo-upload"
                />
                <label htmlFor="service-photo-upload" className="cursor-pointer">
                  <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Upload Photos</p>
                  <p className="text-xs text-gray-500">Max 5 photos, drag to reorder</p>
                </label>
              </div>

              {/* Photo Grid */}
              {(formData.photos?.length || 0) > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.photos?.map((photo, index) => (
                    <div
                      key={index}
                      className="relative group cursor-move bg-white rounded-lg border overflow-hidden hover:border-violet-300 hover:shadow-md transition-all"
                      draggable
                      onDragStart={() => setDraggedPhotoIndex(index)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault()
                        if (draggedPhotoIndex !== null && draggedPhotoIndex !== index) {
                          const newPhotos = [...(formData.photos || [])]
                          const draggedPhoto = newPhotos[draggedPhotoIndex]
                          newPhotos.splice(draggedPhotoIndex, 1)
                          newPhotos.splice(index, 0, draggedPhoto)
                          setFormData((prev) => ({ ...prev, photos: newPhotos }))
                        }
                        setDraggedPhotoIndex(null)
                      }}
                    >
                      <div className="aspect-video relative">
                        <img
                          src={typeof photo === "string" ? photo : URL.createObjectURL(photo)}
                          alt={`Service photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                photos: prev.photos?.filter((_, i) => i !== index) || [],
                              }))
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white hover:bg-red-600 rounded-full h-8 w-8 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded font-medium">
                          {index + 1}
                        </div>
                        <GripVertical className="absolute top-2 right-2 h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSaveService}
                disabled={!formData.name || !formData.price}
                className="bg-violet-600 hover:bg-violet-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {editingService ? "Update Service" : "Add Service"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span>Delete Service</span>
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600">Are you sure you want to delete this service? This action cannot be undone.</p>
          </div>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => deleteConfirm && handleDeleteService(deleteConfirm)}>
              Delete Service
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
