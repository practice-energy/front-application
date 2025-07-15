"use client"

import type * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RubleIcon } from "@/components/ui/ruble-sign"
import { DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"

interface PriceInputProps {
  label?: string
  value: number
  onChange: (value: number) => void
  disabled?: boolean
  error?: string
  placeholder?: string
  className?: string
  required?: boolean
}

export function PriceInput({
  label = "Цена",
  value,
  onChange,
  disabled = false,
  error,
  placeholder = "0",
  className,
  required = false,
}: PriceInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = Number(e.target.value)
    if (!isNaN(numValue) && numValue >= 0) {
      onChange(numValue)
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>
      )}

      <div className="relative">
        <Input
          type="number"
          value={value || ""}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder}
          className={cn("pr-8 text-right", error && "border-red-500 focus:border-red-500")}
          min="0"
          step="1"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
          <RubleIcon className="h-4 w-4 text-gray-500" />
        </div>
      </div>

      {error && <p className="text-red-500 text-sm flex items-center gap-1">{error}</p>}
    </div>
  )
}
