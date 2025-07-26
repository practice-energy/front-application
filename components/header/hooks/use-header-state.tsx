"use client"

import {useState, useRef, useEffect} from "react"
import type { User } from "@/types/user"
import {useProfileStore} from "@/stores/profile-store";

export function useHeaderState() {
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const {user, setUser} = useProfileStore()
  const [hat, setHat] = useState<"adept" | "master" | "superviser">(user?.hat || "adept")

  useEffect(() => {
    console.log("wip", user, hat)
    if (user) {
      setUser({
        ...user, hat: hat,
      })
    }
  }, [setHat]);

  const profileMenuRef = useRef<HTMLDivElement>(null)

  return {
    showProfileMenu,
    setShowProfileMenu,
    profileMenuRef,
    hat,
    setHat,
  }
}
