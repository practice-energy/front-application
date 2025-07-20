// components/ui/back-button.tsx
"use client"

import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface BackButtonProps {
    className?: string
    iconClassName?: string
    variant?: "ghost" | "outline" | "link" | "default" | "destructive" | "secondary"
    size?: "default" | "sm" | "lg" | "icon"
}

export function BackButton({
                               className = "",
                               iconClassName = "h-6 w-6",
                               variant = "ghost",
                               size = "default",
                           }: BackButtonProps) {
    const router = useRouter()

    return (
        <button
            variant={variant}
            size={size}
            className={`flex p-3 items-center justify-center ${className}`}
            onClick={() => router.back()}
        >
            <ChevronLeft className={iconClassName} />
        </button>
    )
}
