"use client"

import { AccountBalance } from "./account-balance"
import { SubscriptionPlans } from "./subscription-plans"
import {Balance} from "@/types/balance";
import {User} from "@/types/user";

type BalanceContentProps = {
    isMobile: boolean
    balanceStats: Balance
    user?: User
}

export function BalanceContent({
    isMobile,
    balanceStats,
    user,
}: BalanceContentProps) {
    if (isMobile) return (
        <div className="flex flex-col gap-6 p-6">
            <AccountBalance />
            <SubscriptionPlans
                isMobile={isMobile}
                subscriptions={balanceStats.subscriptions}
            />
        </div>
    )

  return (
    <div className="flex flex-row justify-between gap-10 p-6">
        <SubscriptionPlans
            isMobile={isMobile}
            subscriptions={balanceStats.subscriptions}
            user={user}
        />
        <AccountBalance />
    </div>
  )
}
