"use client"

import {useState, useRef, useEffect} from "react"
import type { User } from "@/types/user"
import {useProfileStore} from "@/stores/profile-store";

export function useHeaderState() {
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement>(null)

  return {
    showProfileMenu,
    setShowProfileMenu,
    profileMenuRef,
  }
}
