"use client"

import { Check } from "lucide-react"

interface IncludedProps {
  items: string[]
}

export function Included({ items }: IncludedProps) {
  if (!items || items.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="flex items-start gap-3">
          <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
            <Check className="w-3 h-3 text-green-600" />
          </div>
          <span className="text-gray-700 dark:text-gray-300 leading-relaxed">{item}</span>
        </div>
      ))}
    </div>
  )
}
