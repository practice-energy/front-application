"use client"

import React, { useState } from "react"
import { Heart, MessageCircle, Share, Eye, MapPinIcon } from 'lucide-react'
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Specialist } from "@/types/specialist"
import { PracticePlaceholder } from "@/components/practice-placeholder"
import { PentagramIcon } from "@phosphor-icons/react"
import { formatCompactNumber } from "@/utils/format"
import { IconPractice } from "@/components/icons/icon-practice"
import { IconButton } from "@/components/icon-button"
import { SpecialistFlipShareCard } from "@/components/specialist/specialist-flip-share-card"

interface InstagramSpecialistCardProps {
  specialist: Specialist
}

export function InstagramSpecialistCard({ specialist }: InstagramSpecialistCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleLike = () => {
    setIsLiked(!isLiked)
  }

  const handleShare = () => {
    setIsFlipped(!isFlipped)
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/specialist/${specialist.id}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

  const handleSocialShare = (platform: string) => {
    const url = `${window.location.origin}/specialist/${specialist.id}`
    const text = `Check out ${specialist.name} - ${specialist.title}`
    
    let shareUrl = ''
    switch (platform) {
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
        break
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`
        break
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank')
    }
  }

  return (
    <div className="w-[300px] mx-auto" style={{ perspective: '1000px' }}>
      <motion.div
        className="relative w-full transition-transform duration-700 preserve-3d"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front Side - Original Card */}
        <div 
          className="absolute inset-0 w-full backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="bg-white rounded-sm shadow-xl border">
            {/* Image */}
            <div className="relative">
              {specialist.avatar ? (
                <img
                  src={specialist.avatar || "/placeholder.svg"}
                  alt={specialist.name}
                  className="w-full h-[375px] object-cover rounded-t-sm"
                />
              ) : (
                <PracticePlaceholder width={300} height={375} />
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Header with stats */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 text-sm line-clamp-1">{specialist.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{specialist.title}</p>
                </div>
                <div className={cn(
                  "border border-gray-200 bg-white/80 rounded-sm shadow-md shadow-violet-100 p-0.5 w-[65px] gap-2",
                )}>
                  <div className="flex flex-row w-full bg-white items-center gap-1 text-violet-600 border border-gray-200 h-1/2 p-1 rounded-sm shadow-sm">
                    <PentagramIcon size={14} />
                    <div className="ml-auto text-xs">{formatCompactNumber(specialist.likes)}</div>
                  </div>
                  <div className="flex flex-row bg-white items-center gap-1 w-full border border-gray-200 h-1/2 p-1 mt-1 rounded-sm shadow-sm">
                    <IconPractice width={14} height={14} />
                    <div className="ml-auto text-xs">{formatCompactNumber(specialist.practices)}</div>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center text-neutral-900/80 text-sm mb-4">
                <MapPinIcon className="w-4 h-4 mr-1" />
                <span>{specialist.location}</span>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleLike}
                  >
                    <IconButton
                      icon={Heart}
                      className={cn(
                        "transition-colors",
                        isLiked ? "text-red-500 bg-red-50 border-red-200" : "hover:border-gray-200"
                      )}
                    />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <IconButton icon={MessageCircle} className="hover:border-gray-200" />
                  </motion.div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleShare}
                >
                  <IconButton 
                    icon={isFlipped ? Eye : Share} 
                    className="hover:border-gray-200" 
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Side - Share Card */}
        <div 
          className="absolute inset-0 w-full backface-hidden"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <SpecialistFlipShareCard
            specialist={specialist}
            copied={copied}
            onCopyLink={handleCopyLink}
            onShare={handleSocialShare}
          />
        </div>
      </motion.div>
    </div>
  )
}
