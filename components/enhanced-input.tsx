"use client"

import type React from "react"

import { forwardRef } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AlertCircle, Edit3 } from "lucide-react"
import { cn } from "@/lib/utils"

interface EnhancedInputProps {
  label?: string
  error?: string
  type?: "input" | "textarea"
  rows?: number
  icon?: React.ReactNode
  showEditIcon?: boolean
  className?: string
  labelClassName?: string
  required?: boolean
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  placeholder?: string
  disabled?: boolean
  maxLength?: number
  showCharCount?: boolean
}

export const EnhancedInput = forwardRef<HTMLInputElement | HTMLTextAreaElement, EnhancedInputProps>(
  (
    {
      label,
      error,
      type = "input",
      rows = 3,
      icon,
      showEditIcon = false,
      className,
      labelClassName,
      required = false,
      value = "",
      onChange,
      placeholder,
      disabled = false,
      showCharCount = false,
      ...props
    },
    ref,
  ) => {
      const inputClasses = cn(
          "transition-all duration-200",
          "border-gray-200 dark:border-gray-700",
          "bg-white dark:bg-gray-800",
          "text-gray-900 dark:text-gray-100",
          "placeholder:text-gray-500 dark:placeholder:text-gray-400",
          // Жесткое переопределение outline (важно: !important в Tailwind)
          "!outline-none !ring-0 !focus:outline-none !focus:ring-0", // Добавлено
          // Ваши кастомные стили фокуса
          "focus:border-violet-500 dark:focus:border-violet-400",
          "focus:ring-2 focus:ring-violet-500/20 dark:focus:ring-violet-400/20",
          "hover:border-gray-300 dark:hover:border-gray-600",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
          showEditIcon && "pr-10",
          className,
      )

    return (
      <div className="space-y-2">
        {label && (
          <Label
            className={cn(
              "text-sm font-medium flex items-center gap-2 text-foreground dark:text-gray-200",
              labelClassName,
            )}
          >
            {icon}
            {label}
            {required && <span className="text-red-500">*</span>}
          </Label>
        )}

        <div className="relative">
          {type === "textarea" ? (
            <Textarea
              ref={ref as React.Ref<HTMLTextAreaElement>}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              disabled={disabled}
              rows={rows}
              className={cn(inputClasses, "resize-none")}
              {...props}
            />
          ) : (
            <Input
              ref={ref as React.Ref<HTMLInputElement>}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              disabled={disabled}
              className={cn(
                  inputClasses,
                  "resize-none w-full",
                  "outline-none focus:outline-none",
              )}
              {...props}
            />
          )}

          {showEditIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Edit3 className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            </div>
          )}
        </div>

        <div className="flex justify-between items-start">
          <div className="flex-1">
            {error && (
              <p className="text-sm text-red-500 dark:text-red-400 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {error}
              </p>
            )}
          </div>
        </div>
      </div>
    )
  },
)

EnhancedInput.displayName = "EnhancedInput"
