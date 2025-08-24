"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/src/lib/utils"
import { TransactionList } from "./transaction-list"
import { Transaction } from "@/types/balance"

interface TransactionHistoryProps {
  isMobile: boolean
  transactions: Transaction[]
}

export function TransactionHistory({ isMobile, transactions }: TransactionHistoryProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthNames = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ]

  const navigateMonth = (direction: "prev" | "next") => {
    const newMonth = new Date(currentMonth)
    if (direction === "prev") {
      newMonth.setMonth(currentMonth.getMonth() - 1)
    } else {
      newMonth.setMonth(currentMonth.getMonth() + 1)
    }
    setCurrentMonth(newMonth)
  }

  // Фильтрация транзакций по текущему месяцу
  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.time)
    return transactionDate.getMonth() === currentMonth.getMonth() && 
           transactionDate.getFullYear() === currentMonth.getFullYear()
  })

  return (
    <div className={cn(
      "bg-white  rounded-sm shadow-custom mx-auto",
      isMobile ? "w-full" : "w-[714px]"
    )}>
      {/* Header */}
      <div className="pl-[42px] pr-9 py-3">
        <div className="text-base font-semibold text-neutral-900 ">
          История транзакций
        </div>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center gap-1 mb-3 pl-[34px]">
        <button
            onClick={() => navigateMonth("prev")}
            className="p-0 flex items-center justify-center text-colors-custom-accent hover:text-violet-700 transition-colors"
        >
          <ChevronLeft className="h-[18px] w-[18px]" />
        </button>

        <div className="text-sm font-medium text-neutral-900">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </div>

        <button
            onClick={() => navigateMonth("next")}
            className="p-0 flex items-center justify-center text-colors-custom-accent hover:text-violet-700 transition-colors"
        >
          <ChevronRight className="h-[18px] w-[18px]" />
        </button>
      </div>

      {/* Transaction List */}
      <div className="pl-[42px] pr-[36px] gap-2 pb-2 mb-4">
        <TransactionList transactions={filteredTransactions} />
      </div>
    </div>
  )
}
