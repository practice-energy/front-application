"use client"

import React from "react"
import { cn } from "@/src/lib/utils"
import {IconPractice1} from "@/components/icons/practice-1-logo";
import {IconPractice2} from "@/components/icons/prractice-2-logo";

interface PurePlanCardProps {
  isCurrentPlan?: boolean
  onClick?: () => void
}

export function PurePlanCard({ isCurrentPlan = false, onClick }: PurePlanCardProps) {
  return (
    <div 
      className={cn(
        "w-[300px] h-[500px] bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md",
        "flex flex-col"
      )}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-center gap-12 p-6 border-gray-100">
        <IconPractice2 width={68} height={80}/>
      </div>

      {/* Current Plan Indicator */}
      {isCurrentPlan && (
        <div className="mx-4 mt-4 p-3 bg-gray-100 rounded text-center">
          <span className="text-sm text-black">Ваш текущий план</span>
        </div>
      )}

      {/* Features List */}
      <div className="flex-1 p-4 space-y-3">
        <div className="flex items-start gap-2">
          <div className="w-2 h-2 bg-gray-300 rounded-full mt-2 flex-shrink-0"></div>
          <p className="text-sm text-black">1000 символов с Alura / 4 часа</p>
        </div>
        <div className="flex items-start gap-2">
          <div className="w-2 h-2 bg-gray-300 rounded-full mt-2 flex-shrink-0"></div>
          <p className="text-sm text-black">Нумеролог с фокусом</p>
        </div>
        <div className="flex items-start gap-2">
          <div className="w-2 h-2 bg-gray-300 rounded-full mt-2 flex-shrink-0"></div>
          <p className="text-sm text-black">Нумеролог с фокусом</p>
        </div>
        <div className="flex items-start gap-2">
          <div className="w-2 h-2 bg-gray-300 rounded-full mt-2 flex-shrink-0"></div>
          <p className="text-sm text-black">Нумеролог с фокусом</p>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 flex justify-between items-center">
        <span className="text-sm text-black">Для общих запросов</span>
        <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
          <div className="w-3 h-3 bg-white rounded-full"></div>
        </div>
      </div>
    </div>
  )
}
