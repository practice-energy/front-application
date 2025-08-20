"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Check, MessageCircle, Mail, Link, X } from "lucide-react"
import { motion } from "framer-motion"
import type { Message } from "@/types/chats"

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  message: Message | null
}

export function ShareModal({ isOpen, onClose, message }: ShareModalProps) {
  const [copied, setCopied] = useState(false)
  const [customText, setCustomText] = useState("")

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen || !message) return null

  const messageText = message.content || "Check out this message"
  const shareUrl = `${window.location.origin}/message/${message.id}`
  const shareText = customText || messageText

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
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      email: `mailto:?subject=Shared Message&body=${encodedText}%0A%0A${encodedUrl}`,
    }

    if (shareUrls[platform as keyof typeof shareUrls]) {
      window.open(shareUrls[platform as keyof typeof shareUrls], "_blank", "width=600,height=400")
    }
  }

  const shareOptions = [
    { id: "whatsapp", name: "WhatsApp", icon: MessageCircle, color: "hover:bg-violet-50 hover:text-colors-custom-accent" },
    { id: "email", name: "Email", icon: Mail, color: "hover:bg-violet-50 hover:text-colors-custom-accent" },
  ]

  return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Overlay */}
        <div className="fixed inset-0 bg-black/80 transition-opacity" onClick={onClose} />

        {/* Modal container */}
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <div className="relative transform overflow-hidden rounded-sm bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md border border-gray-200 dark:border-gray-700">
            {/* Modal content */}
            <div className="p-6">
              {/* Header */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold leading-none tracking-tight text-gray-900 dark:text-gray-100">
                  Share Message
                </h3>
              </div>

              <div className="space-y-6">
                {/* Message Preview */}
                <div className="p-3 bg-violet-50 dark:bg-gray-700 rounded-sm">
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">{messageText}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  </p>
                </div>

                {/* Custom Text */}
                <div className="space-y-2">
                  <Label htmlFor="custom-text" className="text-gray-700 dark:text-gray-300">
                    Custom message (optional)
                  </Label>
                  <Textarea
                      id="custom-text"
                      placeholder="Add your own message..."
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                      rows={3}
                  />
                </div>

                {/* Share Link */}
                <div className="space-y-2">
                  <Label htmlFor="share-link" className="text-gray-700 dark:text-gray-300">
                    Share link
                  </Label>
                  <div className="flex gap-2">
                    <Input
                        id="share-link"
                        value={shareUrl}
                        readOnly
                        className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                    />
                    <Button
                        onClick={handleCopyLink}
                        variant="outline"
                        size="sm"
                        className="flex-shrink-0 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 bg-transparent"
                    >
                      {copied ? (
                          <Check className="w-4 h-4 text-green-600" />
                      ) : (
                          <Copy className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Share Options */}
                <div className="space-y-3">
                  <Label className="text-gray-700 dark:text-gray-300">Share to</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {shareOptions.map((option) => (
                        <motion.button
                            key={option.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleShare(option.id)}
                            className={`flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors ${option.color} dark:hover:bg-gray-700`}
                        >
                          <option.icon className="w-5 h-5" />
                          <span className="text-sm font-medium">{option.name}</span>
                        </motion.button>
                    ))}
                  </div>
                </div>

                {/* Copy Link Button */}
                <Button
                    onClick={handleCopyLink}
                    variant="outline"
                    className="w-full border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 bg-transparent"
                >
                  <Link className="w-4 h-4 mr-2" />
                  {copied ? "Link Copied!" : "Copy Link"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}
