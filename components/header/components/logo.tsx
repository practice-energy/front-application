"use client"

import Image from "next/image"
import { usePathname } from "next/navigation"
import {IconPractice} from "@/components/icons/icon-practice";
import {useBecomeSpecialist} from "@/stores/chat-store";
import {IconPractice1} from "@/components/icons/practice-1-logo";
import {IconPractice2} from "@/components/icons/prractice-2-logo";
import {useAuth} from "@/hooks/use-auth";

interface LogoProps {
  onClick: () => void
}

export function Logo({ onClick }: LogoProps) {
  const pathname = usePathname()
  const isHomePage = pathname === "/"
  const {
      state: becomeSpecialistState,
  } = useBecomeSpecialist()
    const { isAuthenticated } = useAuth()

  const renderIcon = () => {
      if (!isAuthenticated) {
          return (<IconPractice1
              width={48}
              height={48}
              className="text-neutral-900 bg-none rounded-sm"
          />)
      }

      if (pathname === `/search/${becomeSpecialistState.chatId}`) {
          if (becomeSpecialistState.step === 1) {
              return (<IconPractice1
                  width={48}
                  height={48}
                  className="text-neutral-900 bg-none rounded-sm"
              />)
          }

          if (becomeSpecialistState.step === 2 || becomeSpecialistState.step === 3) {
              return (<IconPractice2
                  width={48}
                  height={48}
                  className="text-neutral-900 bg-none rounded-sm"
              />)
          }
      }

      return (<IconPractice
          width={48}
          height={48}
          className="text-neutral-900 bg-none rounded-sm"
      />)
  }

  return (
    <button
        onClick={onClick}
    >
      <div className="rounded-sm">
          {renderIcon()}
      </div>
    </button>
  )
}
