"use client"

import { useState, useRef } from "react"
import type { User } from "@/types/user"

export function useHeaderState(user: User | null) {
  const [isLanguageSwitching, setIsLanguageSwitching] = useState(false)
  const [showBurgerMenu, setShowBurgerMenu] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [role, setRole] = useState<"user" | "specialist">(user?.isSpecialist ? "specialist" : "user")
  const [hat, setHat] = useState<"adept" | "master" | "superviser">("adept")

  const burgerMenuRef = useRef<HTMLDivElement>(null)
  const profileMenuRef = useRef<HTMLDivElement>(null)

  return {
    isLanguageSwitching,
    setIsLanguageSwitching,
    showBurgerMenu,
    setShowBurgerMenu,
    showProfileMenu,
    setShowProfileMenu,
    role,
    setRole,
    burgerMenuRef,
    profileMenuRef,
    hat,
    setHat,
  }
}
