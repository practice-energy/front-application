"use client"

import {useState, useRef, useEffect} from "react"
import type { User } from "@/src/types/user"
import {useProfileStore} from "@/src/stores/profile-store";

export function useHeaderState() {
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement>(null)

  return {
    showProfileMenu,
    setShowProfileMenu,
    profileMenuRef,
  }
}
