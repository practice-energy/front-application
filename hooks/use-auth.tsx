"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "@/types/user"
import { mockUser } from "@/services/mock-user"
import { useProfileStore } from "@/stores/profile-store"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => Promise<void>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => {
    return Promise.resolve()
  },
  logout: () => {},
  updateUser: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  // Check for saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const login = async (userData: User) => {
    // Simulate backend request
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Use mockUser instead of userData
    const user = mockUser
    setUser(user)
    localStorage.setItem("user", JSON.stringify(user))

    // Store user in profileStore
    useProfileStore.getState().setUser(user)
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
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
