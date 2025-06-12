import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { ProfileSection, User, ProfileStats, SavedSpecialist, CalendarEvent, SortOption } from "@/types/profile"

interface ProfileState {
  // UI State
  activeSection: ProfileSection
  sidebarCollapsed: boolean
  isMobile: boolean

  // User Data
  user: User | null
  stats: ProfileStats | null
  savedSpecialists: SavedSpecialist[]
  calendarEvents: CalendarEvent[]

  // UI Controls
  sortOption: SortOption
  isLoading: boolean

  // Actions
  setActiveSection: (section: ProfileSection) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setIsMobile: (mobile: boolean) => void
  setUser: (user: User) => void
  setStats: (stats: ProfileStats) => void
  setSavedSpecialists: (specialists: SavedSpecialist[]) => void
  setCalendarEvents: (events: CalendarEvent[]) => void
  setSortOption: (option: SortOption) => void
  setLoading: (loading: boolean) => void

  // Data Actions
  removeSpecialist: (id: string) => void
  clearAllSpecialists: () => void
  cancelEvent: (id: string) => void
  updateEventStatus: (id: string, status: CalendarEvent["status"]) => void
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
      calendarEvents: [],
      sortOption: "recent",
      isLoading: false,

      // Actions
      setActiveSection: (section) => set({ activeSection: section }),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setIsMobile: (mobile) => set({ isMobile: mobile }),
      setUser: (user) => set({ user }),
      setStats: (stats) => set({ stats }),
      setSavedSpecialists: (specialists) => set({ savedSpecialists: specialists }),
      setCalendarEvents: (events) => set({ calendarEvents: events }),
      setSortOption: (option) => set({ sortOption: option }),
      setLoading: (loading) => set({ isLoading: loading }),

      // Data Actions
      removeSpecialist: (id) => {
        const { savedSpecialists } = get()
        set({ savedSpecialists: savedSpecialists.filter((s) => s.id !== id) })
      },
      clearAllSpecialists: () => set({ savedSpecialists: [] }),
      cancelEvent: (id) => {
        const { calendarEvents } = get()
        set({
          calendarEvents: calendarEvents.map((event) =>
            event.id === id ? { ...event, status: "cancelled" as const } : event,
          ),
        })
      },
      updateEventStatus: (id, status) => {
        const { calendarEvents } = get()
        set({
          calendarEvents: calendarEvents.map((event) => (event.id === id ? { ...event, status } : event)),
        })
      },
    }),
    {
      name: "profile-store",
      partialize: (state) => ({
        activeSection: state.activeSection,
        sidebarCollapsed: state.sidebarCollapsed,
        sortOption: state.sortOption,
      }),
    },
  ),
)
