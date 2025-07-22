"use client"

import { useState, useEffect, useCallback } from "react"

type LikeType = "specialist" | "service"

interface UseLikesReturn {
  isLiked: (id: string) => boolean
  toggleLike: (id: string) => void
  getLikedItems: (type: LikeType) => string[]
}

export function useLikes(): UseLikesReturn {
  const [likedSpecialists, setLikedSpecialists] = useState<Set<string>>(new Set())

  // Load likes from localStorage on mount
  useEffect(() => {
    const savedSpecialists = localStorage.getItem("likedSpecialists")

    if (savedSpecialists) {
      try {
        setLikedSpecialists(new Set(JSON.parse(savedSpecialists)))
      } catch (error) {
        console.error("Error parsing liked specialists:", error)
      }
    }
  }, [])

  // Save to localStorage whenever likes change
  useEffect(() => {
    localStorage.setItem("likedSpecialists", JSON.stringify([...likedSpecialists]))
  }, [likedSpecialists])

  const isLiked = useCallback(
    (id: string): boolean => {
      const idStr = String(id)
      return likedSpecialists.has(idStr)
    },
    [likedSpecialists],
  )

  const toggleLike = useCallback((id: string) => {
    const idStr = String(id)

    setLikedSpecialists((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(idStr)) {
        newSet.delete(idStr)
      } else {
        newSet.add(idStr)
      }
      return newSet
    })
  }, [])

  const getLikedItems = useCallback(
    (type: LikeType): string[] => {
      return  [...likedSpecialists]
    },
    [likedSpecialists],
  )

  return { isLiked, toggleLike, getLikedItems }
}
