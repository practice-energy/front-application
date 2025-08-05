"use client"

import type React from "react"

import { forwardRef, useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { RubleIcon } from "@/components/ui/ruble-sign"

interface CurrencyInputProps {
    value?: string | number
    onChange?: (value: string) => void
    placeholder?: string
    disabled?: boolean
    className?: string
    error?: string
    iconSize?: number
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
    ({ value = "", onChange, placeholder = "0", disabled = false, className, error, iconSize = 48, ...props }, ref) => {
        const [displayValue, setDisplayValue] = useState("")
        const [inputWidth, setInputWidth] = useState("auto")

        // Функция для форматирования числа с запятыми
        const formatNumber = (num: string | number): string => {
            if (!num) return ""
            const numStr = num.toString().replace(/[^\d]/g, "")
            if (!numStr) return ""
            return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        }

        // Функция для получения чистого числа без форматирования
        const getCleanNumber = (formatted: string): string => {
            return formatted.replace(/[^\d]/g, "")
        }

        // Обновляем отображаемое значение при изменении value
        useEffect(() => {
            const formatted = formatNumber(value)
            setDisplayValue(formatted)

            // Вычисляем ширину на основе длины текста
            const textLength = formatted.length || placeholder.length
            const minWidth = Math.max(textLength * 24, 80) // 24px на символ, минимум 80px
            setInputWidth(`${minWidth}px`)
        }, [value, placeholder])

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const inputValue = e.target.value
            const cleanValue = getCleanNumber(inputValue)

            // Проверяем, не превышает ли введенное значение максимально допустимое
            if (cleanValue.length > 7) return // 9,999,999 - 9 цифр

            const formatted = formatNumber(cleanValue)

            setDisplayValue(formatted)

            // Вычисляем новую ширину
            const textLength = formatted.length || placeholder.length
            const minWidth = Math.max(textLength * 24, 80)
            setInputWidth(`${minWidth}px`)

            if (onChange) {
                onChange(cleanValue)
            }
        }

        return (
            <div className="flex items-center justify-end ml-auto">
                <div className="relative flex items-center">
                    <input
                        ref={ref}
                        type="text"
                        value={displayValue}
                        onChange={handleChange}
                        placeholder={placeholder}
                        disabled={disabled}
                        style={{ width: inputWidth }}
                        className={cn(
                            "text-[36px] font-bold text-neutral-900",
                            "bg-transparent border-none outline-none",
                            "text-right pr-2", // Выравнивание по правому краю с отступом для иконки
                            "placeholder:text-gray-400",
                            "transition-all duration-200 ease-in-out",
                            "focus:outline-none focus:ring-0",
                            disabled && "opacity-50 cursor-not-allowed",
                            error && "text-red-500",
                            className,
                        )}
                        {...props}
                    />

                    {/* Иконка рубля справа */}
                    <div className="flex items-center pointer-events-none">
                        <RubleIcon size={iconSize} className="text-neutral-900 mb-0.5" bold={false} />
                    </div>
                </div>

                {error && <p className="absolute top-full left-0 mt-1 text-sm text-red-500">{error}</p>}
            </div>
        )
    },
)

CurrencyInput.displayName = "CurrencyInput"
