"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { RotateCw, Check } from "lucide-react"

interface ProfilePhotoUploadProps {
  isOpen: boolean
  onClose: () => void
  photoUrl: string | null
  onSave: (croppedImage: string) => void
}

export function ProfilePhotoUpload({ isOpen, onClose, photoUrl, onSave }: ProfilePhotoUploadProps) {
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)

  // Initialize image when photoUrl changes
  useEffect(() => {
    if (photoUrl) {
      const img = new Image()
      // Only set crossOrigin for external URLs, not for blob URLs
      if (!photoUrl.startsWith("blob:")) {
        img.crossOrigin = "anonymous"
      }
      img.onload = () => {
        imageRef.current = img
        // Reset position and scale when new image loads
        setPosition({ x: 0, y: 0 })
        setScale(1)
        setRotation(0)
        // Draw image after state is reset
        setTimeout(() => drawImage(), 0)
      }
      img.src = photoUrl
    }
  }, [photoUrl])

  const drawImage = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    const img = imageRef.current

    if (!canvas || !ctx || !img) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Save context
    ctx.save()

    // Move to center of canvas
    ctx.translate(canvas.width / 2, canvas.height / 2)

    // Rotate
    ctx.rotate((rotation * Math.PI) / 180)

    // Scale
    ctx.scale(scale, scale)

    // Apply position offset
    ctx.translate(position.x / scale, position.y / scale)

    // Draw image centered
    ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height)

    // Restore context
    ctx.restore()
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      const newPosition = {
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      }
      setPosition(newPosition)
      // Draw immediately after state update
      setTimeout(() => drawImage(), 0)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    setIsDragging(true)
    setDragStart({
      x: e.touches[0].clientX - position.x,
      y: e.touches[0].clientY - position.y,
    })
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      const newPosition = {
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      }
      setPosition(newPosition)
      // Draw immediately after state update
      setTimeout(() => drawImage(), 0)
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  const handleSave = () => {
    const canvas = canvasRef.current
    if (canvas) {
      // Create a circular crop
      const ctx = canvas.getContext("2d")
      if (ctx) {
        const tempCanvas = document.createElement("canvas")
        const tempCtx = tempCanvas.getContext("2d")
        if (tempCtx) {
          // Set dimensions for the output (circular crop)
          const size = Math.min(canvas.width, canvas.height)
          tempCanvas.width = size
          tempCanvas.height = size

          // Draw circular mask
          tempCtx.beginPath()
          tempCtx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
          tempCtx.closePath()
          tempCtx.clip()

          // Draw the original canvas content
          tempCtx.drawImage(canvas, (canvas.width - size) / 2, (canvas.height - size) / 2, size, size, 0, 0, size, size)

          // Convert to WebP
          const croppedImage = tempCanvas.toDataURL("image/webp", 0.9)
          onSave(croppedImage)
          onClose()
        }
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile Photo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative mx-auto rounded-full overflow-hidden bg-gray-100 w-64 h-64 border-2 border-dashed border-gray-300">
            <canvas
              ref={canvasRef}
              width={300}
              height={300}
              className="w-full h-full"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            />
            <div className="absolute inset-0 pointer-events-none border-2 border-white rounded-full"></div>
          </div>

          <div className="space-y-4">
            {/* Zoom controls */}
            <div className="space-y-2">
              <span className="text-sm font-medium">Zoom</span>
              <Slider
                value={[scale]}
                min={0.5}
                max={3}
                step={0.01}
                onValueChange={(value) => {
                  setScale(value[0])
                  setTimeout(() => drawImage(), 0)
                }}
              />
            </div>

            {/* Rotation control */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Rotation</span>
              <Button
                variant="outline"
                size="sm"
                className="h-8"
                onClick={() => {
                  setRotation((prev) => {
                    const newRotation = (prev + 90) % 360
                    setTimeout(() => drawImage(), 0)
                    return newRotation
                  })
                }}
              >
                <RotateCw className="h-4 w-4 mr-2" />
                Rotate
              </Button>
            </div>

            <p className="text-xs text-gray-500">
              Drag to position • Use slider to zoom • Rotate as needed • Your photo will be converted to WebP format
            </p>

            <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
              ⚠️ All photos are reviewed and checked for inappropriate content before being published.
            </p>

            <div className="flex space-x-2 pt-2">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSave} className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600">
                <Check className="h-4 w-4 mr-2" />
                Save Photo
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
