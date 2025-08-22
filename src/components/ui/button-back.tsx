// components/ui/back-button.tsx
"use client"

import { ChevronLeft } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { useRouter } from "next/navigation"

interface BackButtonProps {
    className?: string
    iconClassName?: string
    text?: string
}

export function BackButton({
                               className = "",
                               iconClassName = "h-9 w-9",
    text,
                           }: BackButtonProps) {
    const router = useRouter()

    return (
        <button
            className={`flex py-3 items-center justify-center gap-1 ${className}`}
            onClick={() => router.back()}
        >
            <ChevronLeft className={iconClassName} />
            {text && (text)}
        </button>
    )
}
