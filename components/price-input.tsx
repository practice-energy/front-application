"use client"

import { forwardRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { RubleIcon } from "@/components/ui/ruble-sign"

interface PriceInputProps {
    label?: string
    error?: string
    className?: string
    labelClassName?: string
    required?: boolean
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    placeholder?: string
    disabled?: boolean
}

export const PriceInput = forwardRef<HTMLInputElement, PriceInputProps>(
    (
        {
            label,
            error,
            className,
            labelClassName,
            required = false,
            value = "",
            onChange,
            placeholder,
            disabled = false,
            ...props
        },
        ref,
    ) => {
        const inputClasses = cn(
            "text-[36px]", // Большой шрифт и жирное начертание
            "transition-all duration-200",
            "border-gray-200 dark:border-gray-700",
            "bg-white dark:bg-gray-800",
            "text-gray-900 dark:text-gray-100",
            "placeholder:text-gray-500 dark:placeholder:text-gray-400",
            "!outline-none !ring-0 !focus:outline-none !focus:ring-0",
            "focus:border-violet-500 dark:focus:border-violet-400",
            "focus:ring-2 focus:ring-violet-500/20 dark:focus:ring-violet-400/20",
            "hover:border-gray-300 dark:hover:border-gray-600",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            className,
        )

        return (
            <div className="space-y-2">
                {label && (
                    <Label
                        className={cn(
                            "text-sm font-medium text-foreground dark:text-gray-200",
                            labelClassName,
                        )}
                    >
                        {label}
                        {required && <span className="text-red-500">*</span>}
                    </Label>
                )}

                <div className="relative min-w-0 ml-auto">
                    <input
                        ref={ref}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        disabled={disabled}
                        className={cn(
                            inputClasses,
                            "resize-none h-auto w-min min-w-0text-neutral-900", // Высота автоматическая с большим padding
                            "outline-none focus:outline-none items-center ml-auto",
                        )}
                        {...props}
                    />

                    {/* Иконка рубля справа */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none items-center ml-2 pb-2">
                        <RubleIcon
                            size={48}
                            className="text-neutral-900"
                            bold={false}
                        />
                    </div>
                </div>

                {error && (
                    <p className="text-sm text-red-500 dark:text-red-400 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {error}
                    </p>
                )}
            </div>
        )
    },
)

PriceInput.displayName = "PriceInput"