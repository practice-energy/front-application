import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { ProfileSection } from "@/types/profile"
import { User } from "@/types/user"
import { ProfileStats } from "@/types/profile-stats"
import {Specialist} from "@/types/common";

interface ProfileState {
  // UI State
  activeSection: ProfileSection
  sidebarCollapsed: boolean
  isMobile: boolean

  // User Data
  user: User | null
  stats: ProfileStats | null
  savedSpecialists: Specialist[]

  // UI Controls
  isLoading: boolean

  // Actions
  setActiveSection: (section: ProfileSection) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setIsMobile: (mobile: boolean) => void
  setUser: (user: User) => void
  setStats: (stats: ProfileStats) => void
  setSavedSpecialists: (specialists: Specialist[]) => void
  setLoading: (loading: boolean) => void

  // Data Actions
  removeSpecialist: (id: string) => void
  clearAllSpecialists: () => void
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      // Initial State
      activeSection: "overview",
      sidebarCollapsed: false,
      isMobile: false,
      user: null,
      stats: null,
      savedSpecialists: [],
      isLoading: false,

      // Actions
      setActiveSection: (section) => set({ activeSection: section }),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setIsMobile: (mobile) => set({ isMobile: mobile }),
      setUser: (user) => set({ user }),
      setStats: (stats) => set({ stats }),
      setSavedSpecialists: (specialists) => set({ savedSpecialists: specialists }),
      setLoading: (loading) => set({ isLoading: loading }),

      // Data Actions
      removeSpecialist: (id) => {
        const { savedSpecialists } = get()
        set({ savedSpecialists: savedSpecialists.filter((s) => s.id !== id) })
      },
      clearAllSpecialists: () => set({ savedSpecialists: [] }),
    }),
    {
      name: "profile-store",
      partialize: (state) => ({
        activeSection: state.activeSection,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    },
  ),
)
