"use client"

import {useIsMobile} from "@/hooks/use-mobile";
import {cn} from "@/lib/utils";

interface IncludedProps {
  title: string
  items: string[]
}

export function Included({ title, items }: IncludedProps) {
  const isMobile = useIsMobile()

  if (!items || items.length === 0) return null

  return (
    <>
      <div className={cn(
          "font-semibold text-neutral-900 mb-4 line-clamp-1 leading-relaxed",
          isMobile ? "text-mobilebase" :"text-base"
      )}>{title}</div>
      <ul className="space-y-2 ml-1">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className="w-3 h-3 bg-violet-500 dark:bg-violet-600 rounded-sm mt-1.5 flex-shrink-0" />
            <span className="text-gray-700 dark:text-gray-300">{item}</span>
          </li>
        ))}
      </ul>
    </>
  )
}
