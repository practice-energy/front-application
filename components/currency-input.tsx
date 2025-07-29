"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { RubleIcon } from "@/components/ui/ruble-sign"
import { formatNumber } from "@/utils/format"
import { cn } from "@/lib/utils"

interface CurrencyInputProps {
  value: number
  onChange: (value: number) => void
  placeholder?: string
  error?: string
  className?: string
}

export function CurrencyInput({ value, onChange, placeholder = "0", error, className }: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(value ? formatNumber(value) : "")
    }
  }, [value, isFocused])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^\d]/g, "")
    const numericValue = rawValue ? Number.parseInt(rawValue, 10) : 0

    setDisplayValue(rawValue ? formatNumber(numericValue) : "")
    onChange(numericValue)
  }

  const handleFocus = () => {
    setIsFocused(true)
    // Show raw number when focused
    setDisplayValue(value ? value.toString() : "")
  }

  const handleBlur = () => {
    setIsFocused(false)
    // Format with commas when not focused
    setDisplayValue(value ? formatNumber(value) : "")
  }

  // Calculate dynamic width based on text length
  const textLength = displayValue.length || placeholder.length
  const dynamicWidth = Math.max(80, textLength * 24) // 24px per character, minimum 80px

  return (
    <div className="flex items-center ml-auto">
      <div className="relative flex items-center transition-all duration-200" style={{ width: `${dynamicWidth}px` }}>
        <input
          type="text"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={cn(
            "w-full text-right pr-12 text-4xl font-bold text-neutral-900 bg-transparent border-0 outline-none focus:ring-0",
            "placeholder:text-gray-400",
            error && "text-red-500",
            className,
          )}
        />
        <RubleIcon size={48} bold={false} className="absolute right-0 mb-0.5 pointer-events-none" />
      </div>
      {error && <p className="absolute top-full left-0 mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}
