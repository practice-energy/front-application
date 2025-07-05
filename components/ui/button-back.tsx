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
                               iconClassName = "h-4 w-4",
                               variant = "ghost",
                               size = "default",
                           }: BackButtonProps) {
    const router = useRouter()

    return (
        <Button
            variant={variant}
            size={size}
            className={`p-3 flex items-center justify-center ${className}`}
            onClick={() => router.back()}
        >
            <ChevronLeft className={iconClassName} />
        </Button>
    )
}
