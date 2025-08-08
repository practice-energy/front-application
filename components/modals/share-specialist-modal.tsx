"use client"

import React, { useState, useEffect } from "react"
import { Specialist } from "@/types/specialist"
import { SpecialistShareCard } from "@/components/specialist/specialist-share-card"

interface ShareSpecialistModalProps {
  isOpen: boolean
  onClose: () => void
  specialist: Specialist
}

export function ShareSpecialistModal({ isOpen, onClose, specialist }: ShareSpecialistModalProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open')
    } else {
      document.body.classList.remove('modal-open')
    }
    return () => {
      document.body.classList.remove('modal-open')
    }
  }, [isOpen])

  const shareUrl = `${window.location.origin}/specialist/${specialist.id}`
  const shareText = `Check out ${specialist.name}, ${specialist.title}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy link:", error)
    }
  }

  const handleShare = (platform: string) => {
    const encodedText = encodeURIComponent(shareText)
    const encodedUrl = encodeURIComponent(shareUrl)

    const shareUrls = {
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    }

    if (shareUrls[platform as keyof typeof shareUrls]) {
      window.open(shareUrls[platform], "_blank", "width=600,height=400")
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Затемнение для fixed элементов */}
      <div
        className="fixed inset-0 bg-black/10 backdrop-blur-sm z-[9998]"
        onClick={onClose}
      />

      {/* Модальное окно */}
      <div className="fixed inset-0 flex items-center justify-center p-4 z-[9999] pointer-events-none">
        <div
          className="pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <SpecialistShareCard
            specialist={specialist}
            copied={copied}
            onCopyLink={handleCopyLink}
            onShare={handleShare}
          />
        </div>
      </div>
    </>
  )
}
