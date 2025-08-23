"use client"

import React, { useState } from "react"
import { cn } from "@/src/lib/utils"
import {IconPractice2} from "@/components/icons/prractice-2-logo";
import {LoaderPinwheel, Sparkles, SparklesIcon} from "lucide-react";
import {IconPractice} from "@/components/icons/icon-practice";
import {RubleIcon} from "@/components/ui/ruble-sign";

interface PracticePlanCardProps {
  isCurrentPlan?: boolean
  onClick?: () => void
  selectedPeriod: 'month' | 'year'
}

export function PracticePlanCard({ isCurrentPlan = false, onClick, selectedPeriod }: PracticePlanCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleCardClick = () => {
    setIsFlipped(!isFlipped)
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
              "w-full h-full bg-white border border-gray-200 rounded-sm shadow-custom cursor-pointer transition-all duration-200 hover:shadow-active",
              "flex flex-col backface-hidden"
            )}
            style={{ backfaceVisibility: 'hidden' }}
            onClick={handleCardClick}
          >
        {/* Header */}
        <div className="p-1.5">
          <div className="relative h-[142px]">
            <div className={cn(
              "absolute inset-0 flex items-start gap-6 pl-6 pr-1.5 pt-6 pb-2 border border-neutral-900 rounded-sm transition-all duration-300 ease-in-out transform-gpu",
              selectedPeriod === 'year' 
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2 pointer-events-none"
            )}>
              <IconPractice width={90} height={80}/>
              <div className="flex flex-col">
                <div className="text-4xl text-neutral-900 font-semibold">Practice</div>
                <div className="flex flex-col">
                  <div className="text-colors-custom-accent font-semibold ml-auto leading-4">- 30%</div>
                  <div className="items-end flex flex-row gap-2 mr-2">
                    <div className="flex flex-row gap-1 items-center justify-start leading-7">
                      <p className="text-[26px]">₽</p>
                      <div className="text-2xl whitespace-nowrap"> 1,750</div>
                    </div>
                    <span className="text-neutral-900 text-xs whitespace-nowrap mb-1.5">/ месяц</span>
                  </div>
                  <div className="flex text-xs text-neutral-900">
                    Всего: 21,000 ₽ / год.
                  </div>
                </div>
              </div>
            </div>
            
            <div className={cn(
              "absolute inset-0 flex items-start gap-6 pl-6 pr-1.5 pt-6 pb-2 border border-neutral-900 rounded-sm transition-all duration-300 ease-in-out transform-gpu",
              selectedPeriod === 'month' 
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2 pointer-events-none"
            )}>
              <IconPractice width={90} height={80}/>
              <div className="flex flex-col gap-[20px]">
                <div className="text-4xl text-neutral-900 font-semibold">Practice</div>
                <div className="items-end flex flex-row gap-2 mr-2">
                  <div className="flex flex-row gap-1 items-center justify-start leading-7">
                    <p className="text-[26px]">₽</p>
                    <div className="text-2xl whitespace-nowrap"> 2,500</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Plan Indicator */}
        {isCurrentPlan ? (
            <div className="p-1.5 bg-colors-custom-currentPlanBg rounded-sm text-center mt-1.5 mx-1.5">
              <span className="text-sm text-neutral-900 font-semibold">Ваш текущий план</span>
            </div>
        ) : (
            <div 
              className="p-1.5 bg-colors-custom-accent text-white rounded-sm text-center mt-1.5 mx-1.5 cursor-pointer hover:bg-purple-700 transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                onClick?.()
              }}
            >
              <span className="text-sm font-semibold">Получить Practice</span>
            </div>
        )}

        {/* Features List */}
        <div className="flex-1 flex flex-col pl-6 pr-1.5 gap-1.5 mt-[22px]">
          <div className="flex gap-1.5 flex-row items-center">
            <div className="w-3 h-3 bg-colors-custom-accent rounded-sm flex-shrink-0"></div>
            <p className="text-sm text-neutral-900">3,000,000 символов с Alura / месяц</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 flex justify-between items-center">
          <span className="text-base text-neutral-900">Для глубокого погружения</span>
          <Sparkles size={24}/>
        </div>
          </div>

          {/* Задняя сторона карточки - Payment Interface */}
          <div
            className="absolute top-0 left-0 w-full h-full flex items-center justify-center cursor-pointer"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
            onClick={handleCardClick}
          >
            <div className="w-full h-full bg-white border border-purple-200 rounded-sm shadow-sm p-4 flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-black">Оплата</h3>
                <div className="flex gap-2">
                  <span className="text-lg text-black">₽</span>
                  <span className="text-lg text-black bg-purple-100 border border-purple-300 px-2 rounded">$</span>
                </div>
              </div>

              {/* Subscription Plan Details */}
              <div className="bg-white border border-gray-200 rounded-lg p-3 mb-4 relative">
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
