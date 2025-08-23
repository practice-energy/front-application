"use client"

import { AccountBalance } from "./account-balance"
import { SubscriptionPlans } from "./subscription-plans"
import {Balance} from "@/types/balance";

type BalanceContentProps = {
    isMobile: boolean
    balanceStats: Balance
}

export function BalanceContent({
    isMobile,
    balanceStats
}: BalanceContentProps) {
    if (isMobile) return (
        <div className="flex flex-col gap-6 p-6">
            <AccountBalance />
            <SubscriptionPlans />
        </div>
    )

  return (
    <div className="flex flex-row justify-between gap-6 p-6">
        <SubscriptionPlans />
        <AccountBalance />
    </div>
  )
}
