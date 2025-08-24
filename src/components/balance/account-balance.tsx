"use client"

import { useState } from "react"
import {BanknoteArrowUp} from "lucide-react"
import {cn} from "@/lib/utils";
import {formatNumber} from "@/utils/format";

type AccountBalanceProps = {
    isMobile: boolean
    balanceAmount: number
}

export function AccountBalance({isMobile, balanceAmount}: AccountBalanceProps) {
  const [balance] = useState(balanceAmount)

  return (
    <div className="space-y-4">
        <div className={cn(
            "flex",
            !isMobile ? "flex-col gap-4" : "flex-row justify-between gap-10"
        )}>
            <div className={cn(
                "text-lg font-medium text-neutral-900 ",
            )}>
                Доступный баланс аккаунта
            </div>

            <div className="items-center">
                <div className="bg-colors-custom-specialistCardStatItemBg rounded-sm shadow-custom w-min my-auto">
                    <div className="text-2xl font-semibold text-colors-custom-accent px-2 whitespace-nowrap">
                        {formatNumber(balance)} Senti
                    </div>
                </div>
            </div>
        </div>

      <div>
       <div className="pt-3">
        <span className="text-sm text-neutral-900">
          Вы можете оплатить в <span className="text-colors-custom-accent font-medium">Senti</span><br/> план подписки <span className="font-medium">Practice</span> на 100%
        </span>
      </div>

          <div className="pt-4">
              <button className="w-full bg-neutral-900 text-white mb-4 flex flex-row rounded-sm items-center justify-between px-3 py-2 gap-2.5">
                  <div>
                      Программа раннего доступа
                  </div>
                  <BanknoteArrowUp size={36} className="transform  -scale-y-100"/>
              </button>
          </div>
      </div>
    </div>
  )
}
