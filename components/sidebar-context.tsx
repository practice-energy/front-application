import React, { createContext, useContext, useState, useEffect } from "react"

interface SidebarContextType {
    sidebarWidth: number
    isCollapsed: boolean
    setSidebarWidth: (width: number) => void
    toggleSidebar: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [sidebarWidth, setSidebarWidth] = useState(320)
    const [isCollapsed, setIsCollapsed] = useState(false)

    // Загрузка состояния из localStorage при инициализации
    useEffect(() => {
        const savedWidth = localStorage.getItem('sidebarWidth')
        const savedCollapsed = localStorage.getItem('sidebarCollapsed')

        if (savedWidth) setSidebarWidth(Number(savedWidth))
        if (savedCollapsed) setIsCollapsed(savedCollapsed === 'true')
    }, [])

    // Сохранение состояния в localStorage при изменении
    useEffect(() => {
        localStorage.setItem('sidebarWidth', String(sidebarWidth))
        localStorage.setItem('sidebarCollapsed', String(isCollapsed))
    }, [sidebarWidth, isCollapsed])

    const toggleSidebar = () => {
        setIsCollapsed(prev => !prev)
        setSidebarWidth(prev => prev === 0 ? 320 : 0)
    }

    return (
        <SidebarContext.Provider value={{
            sidebarWidth,
            isCollapsed,
            setSidebarWidth,
            toggleSidebar
        }}>
            {children}
        </SidebarContext.Provider>
    )
}

export function useSidebar() {
    const context = useContext(SidebarContext)
    if (context === undefined) {
        throw new Error('useSidebar must be used within a SidebarProvider')
    }
    return context
}
