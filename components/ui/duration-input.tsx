"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface DurationInputProps {
  label?: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  error?: string
  className?: string
  required?: boolean
}

const PRESET_DURATIONS = ["30 мин", "45 мин", "60 мин", "90 мин", "2 часа", "3 часа"]

export function DurationInput({
  label = "Продолжительность",
  value,
  onChange,
  disabled = false,
  error,
  className,
  required = false,
}: DurationInputProps) {
  const [isCustom, setIsCustom] = React.useState(false)

  React.useEffect(() => {
    setIsCustom(!PRESET_DURATIONS.includes(value))
  }, [value])

  const handlePresetClick = (duration: string) => {
    onChange(duration)
    setIsCustom(false)
  }

  const handleCustomToggle = () => {
    setIsCustom(!isCustom)
    if (!isCustom) {
      onChange("")
    }
  }

  return (
    <div className={cn("space-y-3", className)}>
      {label && (
        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Clock className="h-4 w-4" />
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>
      )}

      {!disabled && (
        <div className="grid grid-cols-3 gap-2">
          {PRESET_DURATIONS.map((duration) => (
            <Button
              key={duration}
              type="button"
              variant={value === duration ? "default" : "outline"}
              size="sm"
              onClick={() => handlePresetClick(duration)}
              className={cn("text-xs", value === duration && "bg-violet-600 hover:bg-violet-700")}
            >
              {duration}
            </Button>
          ))}
        </div>
      )}

      {(isCustom || disabled) && (
        <div className="relative">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder="например: 2 часа 30 мин"
            className={cn(error && "border-red-500 focus:border-red-500")}
          />
        </div>
      )}

      {!disabled && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleCustomToggle}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          {isCustom ? "Выбрать из списка" : "Указать свое время"}
        </Button>
      )}

      {error && <p className="text-red-500 text-sm flex items-center gap-1">{error}</p>}
    </div>
  )
}
