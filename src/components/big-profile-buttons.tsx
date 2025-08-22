"use client"

import Image from "next/image"
import type { User } from "@/src/types/user"
import { PracticePlaceholder } from "@/src/components/practice-placeholder"
import {ComponentType} from "react";
import {IconPractice} from "@/src/components/icons/icon-practice";
import {cn} from "@/src/lib/utils";

interface ButtonConfig {
  id: string
  topText?: string
  bottomText?: string
  variant: "two-lines" | "single-line" | "practice" | "with-updates" | "with-bottom-text" | "left" | "logout" | "center"
  hasNew?: boolean
  updates?: number
  onClick: () => void
  show: boolean
  icon: ComponentType<{ className?: string; width?: number; height?: number }>
}

interface BigProfileButtonsProps {
  buttons: ButtonConfig[]
  user?: User
}

// Добавьте эту функцию в ваш компонент или в файл с утилитами
function getUpdateWord(count: number): string {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return 'обновлений';
  }

  switch (lastDigit) {
    case 1:
      return 'обновление';
    case 2:
    case 3:
    case 4:
      return 'обновления';
    default:
      return 'обновлений';
  }
}

export const BigProfileButtons = ({ buttons, user }: BigProfileButtonsProps) => {
  return (
      <div className="w-full overflow-hidden">
        <div className="flex items-center w-full pt-1 ml-0.5">
          {/* Аватарка */}
          <div className="flex-shrink-0 rounded-sm z-50 overflow-hidden aspect-square flex items-center justify-center w-20 h-20 bg-none">
            {user?.avatar ? (
                <Image
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.name}
                    width={80}
                    height={80}
                    className="object-cover"
                />
            ) : (
                <PracticePlaceholder width={80} height={80} />
            )}
          </div>

          {/* Горизонтальный скролл кнопок */}
          <div className="flex-1 min-w-0">
            <div className="flex gap-2 items-center overflow-x-auto pb-2 -mx-2 px-2 no-scrollbar">
              <div className="w-4"></div>
              {buttons.map((button) => (
                  <div className="flex-shrink-0 pt-[9px]">
                    <button
                        onClick={button.onClick}
                        className="w-[74px] h-[74px] bg-white/90 rounded-sm border border-gray-200 shadow-sm flex flex-col items-center justify-center p-1 active:scale-95 transition-transform hover:bg-gray-50"
                    >
                      {button.variant === "practice" && (
                          <div className="flex-col flex gap-1">
                            <div className="flex flex-row border rounded-sm justify-between items-center p-1 shadow-sm">
                              <IconPractice width={24} height={24} />
                              <div className="text-sm font-semibold">{user?.practice || 999}</div>
                            </div>
                            <div className="text-[9px] text-colors-custom-accent items-start justify-start font-semibold">{button.topText}</div>
                          </div>
                      )}
                      {button.variant === "with-updates" && (
                          <div className="flex-col flex">
                            <div className="flex flex-row gap-3 items-start">
                              {button.icon && (<button.icon className="w-8 h-8" />)}
                              <div className={cn(
                                  "flex items-center justify-center w-3 h-3 rounded-sm ml-auto",
                                  button.updates && button.updates > 0 && " bg-colors-custom-accent text-xs"
                              )}/>
                            </div>
                            <div className="text-[9px] items-start justify-start font-semibold mt-1.5 text-start">{button.topText}</div>
                            <div className={cn(
                                "text-[8px] text-colors-custom-accent items-start justify-start font-semibold",
                                (!button.updates || button.updates === 0) && "text-white"
                            )}>
                              {button.updates || 0} {getUpdateWord(button.updates || 0)}
                            </div>
                          </div>
                      )}
                      {button.variant === "single-line" && (
                          <div className="flex-col flex">
                            <div className="flex flex-row justify-between items-center gap-3">
                              {button.icon && (<button.icon className="w-8 h-8" />)}
                              <div className={cn(
                                  "flex items-center justify-center w-3 h-3 rounded-sm ml-auto",
                                  button.updates && button.updates > 0 && " bg-colors-custom-accent text-xs"
                              )}/>
                            </div>
                            <div className="text-[9px] items-start justify-start font-semibold">{button.topText}</div>
                          </div>
                      )}
                      {button.variant === "with-bottom-text" && (
                          <div className="flex-col flex justify-between items-center">
                            {button.icon && (<button.icon className="w-8 h-8 " />)}
                            <div className="text-[9px] items-start justify-start font-semibold">{button.topText}</div>
                            <div className="text-[8px] items-start justify-start font-semibold text-colors-custom-accent">{button.bottomText}</div>
                          </div>
                      )}
                      {button.variant === "two-lines" && (
                          <div className="flex-col flex justify-between items-center">
                            {button.icon && (<button.icon className="w-8 h-8 top-0" />)}
                            <div className="text-[9px] items-start justify-start font-semibold">{button.topText}</div>
                          </div>
                      )}
                      {button.variant === "left" && (
                          <div className="flex-col flex">
                            <div className="flex flex-row items-start gap-3">
                              {button.icon && (<button.icon className="w-8 h-8" />)}
                              <div className={cn(
                                  "flex items-center justify-center w-3 h-3 rounded-sm ml-auto",
                                  button.updates && button.updates > 0 && " bg-colors-custom-accent text-xs"
                              )}/>
                            </div>
                            <div className="text-[9px] items-start justify-start font-semibold mt-1.5 text-start">{button.topText}</div>
                            <div className="text-[9px] items-start justify-start font-semibold text-start">{button.bottomText}</div>
                          </div>
                      )}
                      {button.variant === "logout" && (
                          <div className="flex-col flex justify-between items-center">
                            {button.icon && (<button.icon className="w-8 h-8 top-0 text-red-500" />)}
                            <div className="text-[9px] items-start justify-start font-semibold mt-1.5">{button.topText}</div>
                          </div>
                      )}
                      {button.variant === "center" && (
                          <div className="flex-col flex justify-between items-center">
                            {button.icon && (<button.icon className="w-8 h-8 top-0" />)}
                            <div className="text-[9px] items-start justify-start font-semibold mt-1.5">{button.topText}</div>
                          </div>
                      )}
                    </button>
                  </div>
              ))}
              <div className="w-4"></div>
            </div>
          </div>
        </div>
      </div>
  )
}
