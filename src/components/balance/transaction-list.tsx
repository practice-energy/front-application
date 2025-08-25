"use client"

import { cn } from "@/src/lib/utils"
import {Transaction} from "@/types/balance";
import {IconPractice} from "@/components/icons/icon-practice";
import {ActivityStatus} from "@/components/ui/activity-status";
import {formatNumber} from "@/utils/format";
import {RubleIcon} from "@/components/ui/ruble-sign";

interface TransactionListProps {
  transactions: Transaction[]
  isMobile: boolean
}

export function TransactionList({ transactions, isMobile }: TransactionListProps) {
  const formatDateTime = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear().toString().slice(-2)
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    
    return `${day}.${month}.${year} / ${hours}:${minutes}`
  }

  return (
    <div className="space-y-2">
      {transactions.map((transaction) => (
          <div
              key={transaction.id}
              className="flex items-center justify-between p-1 rounded-sm border border-neutral-900 transition-colors"
          >
            <div className="flex items-center gap-4 flex-1">
              {/* Avatar/Icon */}
              <div className="w-[40px] h-[44px] bg-neutral-900 rounded-sm items-center justify-center px-0.5 py-1.5">
                <IconPractice width={36} height={32} className="text-white" />
              </div>

              {/* Transaction Details */}
              <div className="flex-1 min-w-0 flex-row w-full">
                <div className="text-sm font-medium text-neutral-900">
                  {transaction.name}
                </div>
              </div>
            </div>

            {!isMobile && (
                <div className="flex gap-1 flex-col w-[108px] items-center justify-center">
                  {!isMobile && (<div className="h-[18px]"/>)}
                  <div className="items-end ml-auto text-sm text-neutral-900 flex whitespace-nowrap">
                    {formatDateTime(transaction.time)}
                  </div>
                </div>
            )}

            <div className={cn(
                "flex flex-col gap-1",
                !isMobile && "w-[90px]"
            )}>
              <div className="flex flex-row gap-1.5">
                {isMobile && (<div className="text-sm text-neutral-900 flex whitespace-nowrap">
                  {formatDateTime(transaction.time)}
                </div>)}
                <ActivityStatus showTitle={false} status={transaction.status} className="ml-auto"/>
              </div>
              <div className="flex flex-row justify-between items-center text-sm text-neutral-900 gap-[32px]" >
                <div className="flex flex-row items-center ml-auto">
                  <div className="text-sm text-neutral-900 ml-auto">
                    {formatNumber(transaction.amount)}
                  </div>
                  <RubleIcon size={22} bold={false}/>
                </div>
              </div>
            </div>
          </div>
      ))}
    </div>)
}
