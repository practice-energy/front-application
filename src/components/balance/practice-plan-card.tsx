"use client"

import React, { useState } from "react"
import { cn } from "@/src/lib/utils"

interface PracticePlanCardProps {
  isCurrentPlan?: boolean
  onClick?: () => void
}

export function PracticePlanCard({ isCurrentPlan = false, onClick }: PracticePlanCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleCardClick = () => {
    if (!isFlipped && onClick) {
      onClick()
    } else {
      setIsFlipped(!isFlipped)
    }
  }

  return (
    <div className="w-[300px] h-[500px] relative">
      <div
        className="relative w-full h-full"
        style={{
          perspective: '1000px',
          transformStyle: 'preserve-3d'
        }}
      >
        <div
          className={cn(
            "relative w-full h-full transition-transform duration-700 ease-in-out",
            "transform-gpu backface-hidden"
          )}
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          {/* Передняя сторона карточки */}
          <div
            className={cn(
              "w-full h-full bg-white border-2 border-purple-500 rounded-lg shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md",
              "flex flex-col backface-hidden"
            )}
            style={{ backfaceVisibility: 'hidden' }}
            onClick={handleCardClick}
          >
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-100">
              <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm transform rotate-45"></div>
              </div>
              <div>
                <h3 className="font-bold text-lg text-black">Practice</h3>
                <p className="text-sm text-red-500">- 30%</p>
                <p className="text-sm text-black">Р 1,750 / месяц</p>
                <p className="text-xs text-black">Всего: 21,000 Р / год.</p>
              </div>
            </div>

            {/* Get Practice Button */}
            <div className="mx-4 mt-4">
              <button className="w-full p-3 bg-purple-600 text-white rounded font-medium hover:bg-purple-700 transition-colors">
                Получить Practice
              </button>
            </div>

            {/* Features List */}
            <div className="flex-1 p-4 space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-black">3,000,000 символов с Alura / месяц</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-black">Нумеролог с фокусом</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-black">Нумеролог с фокусом</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-black">Нумеролог с фокусом</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-black">Нумеролог с фокусом</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-black">Нумеролог с фокусом</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-black">Нумеролог с фокусом</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-black">Нумеролог с фокусом</p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 flex justify-between items-center">
              <span className="text-sm text-black">Для глубокого погружения</span>
              <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
                <div className="w-3 h-3 bg-white transform rotate-45"></div>
              </div>
            </div>
          </div>

          {/* Задняя сторона карточки - Payment Interface */}
          <div
            className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <div className="w-full h-full bg-white border border-purple-200 rounded-lg shadow-sm p-4 flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-black">Оплата</h3>
                <div className="flex gap-2">
                  <span className="text-lg text-black">₽</span>
                  <span className="text-lg text-black bg-purple-100 border border-purple-300 px-2 rounded">$</span>
                </div>
              </div>

              {/* Subscription Plan Details */}
              <div className="bg-white border border-gray-200 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                      <div className="w-4 h-4 bg-white transform rotate-45"></div>
                    </div>
                    <div>
                      <p className="text-sm text-black">План подписки</p>
                      <p className="text-sm text-black">Practice / 30 дней</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-black">2,500 ₽</p>
                    <div className="flex items-center gap-1">
                      <p className="text-xs text-gray-500">Инициант</p>
                      <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="absolute top-2 right-2">
                  <div className="w-4 h-4 border border-gray-300 rounded"></div>
                </div>
              </div>

              {/* QR Code */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 flex justify-center">
                <div className="w-32 h-32 bg-black rounded-lg flex items-center justify-center">
                  <div className="w-24 h-24 bg-white rounded"></div>
                </div>
              </div>

              {/* SentiPay Payment */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                <p className="text-center font-bold text-purple-600 mb-3">SentiPay</p>
                <button className="w-full p-3 bg-purple-600 text-white rounded font-medium hover:bg-purple-700 transition-colors">
                  Оплатить в Senti
                </button>
              </div>

              {/* Email */}
              <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-2">
                <div className="w-4 h-4 bg-black rounded"></div>
                <span className="text-sm text-black">actor@havanaghila.de</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
