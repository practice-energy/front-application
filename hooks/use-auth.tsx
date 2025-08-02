"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import type { User } from "@/types/user"
import { mockUser } from "@/services/mock-user"
import { useProfileStore } from "@/stores/profile-store"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: () => Promise<void>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  requireAuth: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => {
    return Promise.resolve()
  },
  logout: () => {},
  updateUser: () => {},
  requireAuth: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const setProfileUser = useProfileStore((state) => state.setUser)
  const router = useRouter()

  // Check for saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser)
      setUser(parsedUser)
      setProfileUser(parsedUser)
    }
  }, []) // Убрали setProfileUser из зависимостей

  const login = async () => {
    // Simulate backend request
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newUser = mockUser
    setUser(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))
    setProfileUser(newUser)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setProfileUser(updatedUser)
    }
  }

  const requireAuth = () => {
    if (!user) {
      router.push("/")
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, updateUser, requireAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
