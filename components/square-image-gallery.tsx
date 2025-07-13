"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SquareImageGalleryProps {
    images: string[]
    alt: string
    ratioWidth: number
    ratioHeight: number
    orientation?: "vertical" | "horizontal"
    thumbnailsPosition?: "start" | "end"
    thumbnailGap?: number
    thumbnailsPerView?: number
    borderRadius?: number
    onImageClick?: (index: number) => void
    className?: string
}

export function SquareImageGallery({
                                       images = [],
                                       alt,
                                       ratioWidth = 1,
                                       ratioHeight = 1,
                                       orientation = "vertical",
                                       thumbnailGap = 8,
                                       thumbnailsPerView = 5,
                                       borderRadius = 2,
                                       onImageClick,
                                       className = ""
                                   }: SquareImageGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const galleryRef = useRef<HTMLDivElement>(null)
    const touchStartX = useRef(0)
    const touchEndX = useRef(0)
    const [showArrows, setShowArrows] = useState(false)

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") {
                navigate(-1)
            } else if (e.key === "ArrowRight") {
                navigate(1)
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [images.length])

    const navigate = (direction: number) => {
        setSelectedIndex(prev => {
            const newIndex = prev + direction
            if (newIndex < 0) return images.length - 1
            if (newIndex >= images.length) return 0
            return newIndex
        })
    }

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.touches[0].clientX
    }

    const handleTouchEnd = () => {
        const diff = touchStartX.current - touchEndX.current
        const swipeThreshold = 50

        if (diff > swipeThreshold) {
            navigate(1) // Swipe left - next image
        } else if (diff < -swipeThreshold) {
            navigate(-1) // Swipe right - previous image
        }
    }

    if (!images || images.length === 0) {
        return (
            <div className={`w-full h-full ${className}`}>
                <div
                    className="bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
                    style={{
                        aspectRatio: `${ratioWidth}/${ratioHeight}`,
                        borderRadius: `${borderRadius}px`
                    }}
                >
                    <div className="text-center">
                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">No images available</p>
                    </div>
                </div>
            </div>
        )
    }

    // For single image
    if (images.length === 1) {
        return (
            <div className={`w-full h-full ${className}`}>
                <div
                    className="overflow-hidden bg-gray-100 dark:bg-gray-800"
                    style={{
                        aspectRatio: `${ratioWidth}/${ratioHeight}`,
                        borderRadius: `${borderRadius}px`
                    }}
                >
                    <img
                        src={images[0] || "/placeholder.svg"}
                        alt={alt}
                        className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                        onClick={() => onImageClick?.(0)}
                    />
                </div>
            </div>
        )
    }

    const isVertical = orientation === "vertical"

    // Aspect ratio styles
    const aspectStyle = {
        aspectRatio: `${ratioWidth}/${ratioHeight}`,
        borderRadius: `${borderRadius}px`
    }

    return (
        <div
            ref={galleryRef}
            className={`flex ${isVertical ? 'flex-row' : 'flex-col'} w-full h-full ${className}`}
            style={{ gap: `${thumbnailGap}px` }}
            onMouseEnter={() => setShowArrows(true)}
            onMouseLeave={() => setShowArrows(false)}
        >
            {/* Main image */}
            <div
                className="group overflow-hidden bg-gray-100 dark:bg-gray-800 flex-1 relative"
                style={aspectStyle}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div className="relative w-full h-full" style={{ borderRadius: `${borderRadius}px`}}>
                    <img
                        src={images[selectedIndex] || "/placeholder.svg"}
                        alt={`${alt} - Image ${selectedIndex + 1}`}
                        className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                        onClick={() => onImageClick?.(selectedIndex)}
                        style={{ borderRadius: `${borderRadius}px` }}
                    />

                    {/* Image counter */}
                    <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-sm text-xs">
                        {selectedIndex + 1} / {images.length}
                    </div>

                    {/* Desktop navigation arrows */}
                    {showArrows && (
                        <div className="hidden md:flex absolute inset-0 items-center justify-between px-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="bg-black/20 hover:bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(-1);
                                }}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="bg-black/20 hover:bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(1);
                                }}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
