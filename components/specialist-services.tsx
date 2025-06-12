"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Save, X } from "lucide-react"

interface Service {
  id: string
  name: string
  duration: string
  price: number
  description?: string
}

export function SpecialistServices() {
  const [services, setServices] = useState<Service[]>([
    {
      id: "1",
      name: "Personal Astrology Reading",
      duration: "60 minutes",
      price: 120,
      description: "Comprehensive birth chart analysis and life guidance",
    },
    {
      id: "2",
      name: "Life Coaching Session",
      duration: "50 minutes",
      price: 95,
      description: "Goal-setting and personal development coaching",
    },
  ])

  const [editingService, setEditingService] = useState<string | null>(null)
  const [newService, setNewService] = useState<Partial<Service>>({})
  const [isAddingService, setIsAddingService] = useState(false)

  const durationOptions = [
    "15 minutes",
    "30 minutes",
    "45 minutes",
    "60 minutes",
    "90 minutes",
    "2 hours",
    "3 hours",
    "All day",
  ]

  const handleAddService = () => {
    if (newService.name && newService.duration && newService.price) {
      const service: Service = {
        id: Date.now().toString(),
        name: newService.name,
        duration: newService.duration,
        price: newService.price,
        description: newService.description || "",
      }
      setServices([...services, service])
      setNewService({})
      setIsAddingService(false)
    }
  }

  const handleEditService = (id: string, updatedService: Partial<Service>) => {
    setServices(services.map((service) => (service.id === id ? { ...service, ...updatedService } : service)))
    setEditingService(null)
  }

  const handleDeleteService = (id: string) => {
    setServices(services.filter((service) => service.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Services</h2>
        <Button onClick={() => setIsAddingService(true)} className="bg-violet-600 hover:bg-violet-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>

      {/* Add new service form */}
      {isAddingService && (
        <Card className="p-6 border-2 border-dashed border-violet-300">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="new-service-name">Service Name</Label>
                <Input
                  id="new-service-name"
                  value={newService.name || ""}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  placeholder="e.g. Personal Astrology Reading"
                />
              </div>
              <div>
                <Label htmlFor="new-service-duration">Duration</Label>
                <Select
                  value={newService.duration || ""}
                  onValueChange={(value) => setNewService({ ...newService, duration: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {durationOptions.map((duration) => (
                      <SelectItem key={duration} value={duration}>
                        {duration}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="new-service-price">Price (Centi)</Label>
                <Input
                  id="new-service-price"
                  type="number"
                  value={newService.price || ""}
                  onChange={(e) => setNewService({ ...newService, price: Number(e.target.value) })}
                  placeholder="120"
                />
              </div>
              <div>
                <Label htmlFor="new-service-description">Description (Optional)</Label>
                <Input
                  id="new-service-description"
                  value={newService.description || ""}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  placeholder="Brief description of the service"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleAddService} size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save Service
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddingService(false)
                  setNewService({})
                }}
                size="sm"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Services list */}
      <div className="space-y-4">
        {services.map((service) => (
          <Card key={service.id} className="p-6">
            {editingService === service.id ? (
              <EditServiceForm
                service={service}
                onSave={(updatedService) => handleEditService(service.id, updatedService)}
                onCancel={() => setEditingService(null)}
                durationOptions={durationOptions}
              />
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold">{service.name}</h3>
                    <Badge variant="secondary">{service.duration}</Badge>
                    <Badge className="bg-violet-100 text-violet-700">{service.price} Centi</Badge>
                  </div>
                  {service.description && <p className="text-gray-600 text-sm">{service.description}</p>}
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setEditingService(service.id)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteService(service.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {services.length === 0 && !isAddingService && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No services yet</h3>
          <p className="text-gray-600 mb-6">Add your first service to start accepting bookings</p>
          <Button onClick={() => setIsAddingService(true)} className="bg-violet-600 hover:bg-violet-700 text-white">
            Add Your First Service
          </Button>
        </div>
      )}
    </div>
  )
}

function EditServiceForm({
  service,
  onSave,
  onCancel,
  durationOptions,
}: {
  service: Service
  onSave: (service: Partial<Service>) => void
  onCancel: () => void
  durationOptions: string[]
}) {
  const [editedService, setEditedService] = useState(service)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-service-name">Service Name</Label>
          <Input
            id="edit-service-name"
            value={editedService.name}
            onChange={(e) => setEditedService({ ...editedService, name: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="edit-service-duration">Duration</Label>
          <Select
            value={editedService.duration}
            onValueChange={(value) => setEditedService({ ...editedService, duration: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {durationOptions.map((duration) => (
                <SelectItem key={duration} value={duration}>
                  {duration}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-service-price">Price (Centi)</Label>
          <Input
            id="edit-service-price"
            type="number"
            value={editedService.price}
            onChange={(e) => setEditedService({ ...editedService, price: Number(e.target.value) })}
          />
        </div>
        <div>
          <Label htmlFor="edit-service-description">Description</Label>
          <Input
            id="edit-service-description"
            value={editedService.description || ""}
            onChange={(e) => setEditedService({ ...editedService, description: e.target.value })}
          />
        </div>
      </div>
      <div className="flex space-x-2">
        <Button onClick={() => onSave(editedService)} size="sm">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
        <Button variant="outline" onClick={onCancel} size="sm">
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  )
}
