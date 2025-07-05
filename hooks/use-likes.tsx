"use client"

import { useState, useEffect, useCallback } from "react"

type LikeType = "specialist" | "service"

interface UseLikesReturn {
  isLiked: (type: LikeType, id: string | number) => boolean
  toggleLike: (type: LikeType, id: string | number) => void
  getLikedItems: (type: LikeType) => string[]
}

export function useLikes(): UseLikesReturn {
  const [likedSpecialists, setLikedSpecialists] = useState<Set<string>>(new Set())
  const [likedServices, setLikedServices] = useState<Set<string>>(new Set())

  // Load likes from localStorage on mount
  useEffect(() => {
    const savedSpecialists = localStorage.getItem("likedSpecialists")
    const savedServices = localStorage.getItem("likedServices")

    if (savedSpecialists) {
      try {
        setLikedSpecialists(new Set(JSON.parse(savedSpecialists)))
      } catch (error) {
        console.error("Error parsing liked specialists:", error)
      }
    }

    if (savedServices) {
      try {
        setLikedServices(new Set(JSON.parse(savedServices)))
      } catch (error) {
        console.error("Error parsing liked services:", error)
      }
    }
  }, [])

  // Save to localStorage whenever likes change
  useEffect(() => {
    localStorage.setItem("likedSpecialists", JSON.stringify([...likedSpecialists]))
  }, [likedSpecialists])

  useEffect(() => {
    localStorage.setItem("likedServices", JSON.stringify([...likedServices]))
  }, [likedServices])

  const isLiked = useCallback(
    (type: LikeType, id: string | number): boolean => {
      const idStr = String(id)
      return type === "specialist" ? likedSpecialists.has(idStr) : likedServices.has(idStr)
    },
    [likedSpecialists, likedServices],
  )

  const toggleLike = useCallback((type: LikeType, id: string | number) => {
    const idStr = String(id)

    if (type === "specialist") {
      setLikedSpecialists((prev) => {
        const newSet = new Set(prev)
        if (newSet.has(idStr)) {
          newSet.delete(idStr)
        } else {
          newSet.add(idStr)
        }
        return newSet
      })
    } else {
      setLikedServices((prev) => {
        const newSet = new Set(prev)
        if (newSet.has(idStr)) {
          newSet.delete(idStr)
        } else {
          newSet.add(idStr)
        }
        return newSet
      })
    }
  }, [])

  const getLikedItems = useCallback(
    (type: LikeType): string[] => {
      return type === "specialist" ? [...likedSpecialists] : [...likedServices]
    },
    [likedSpecialists, likedServices],
  )

  return { isLiked, toggleLike, getLikedItems }
}
