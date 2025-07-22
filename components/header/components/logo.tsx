"use client"

import Image from "next/image"
import { usePathname } from "next/navigation"
import {IconPractice} from "@/components/icons/icon-practice";

interface LogoProps {
  onClick: () => void
}

export function Logo({ onClick }: LogoProps) {
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  if (isHomePage) {
    return null
  }

  return (
    <button onClick={onClick} className="flex space-x-2 items-start">
      <div className="h-20 w-20 flex rounded-sm">
        <IconPractice
          width={60}
          height={60}
          className="text-black bg-white rounded-sm"
        />
      </div>
    </button>
  )
}
