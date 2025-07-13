"use client"

import Image from "next/image"
import { usePathname } from "next/navigation"

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
    <button onClick={onClick} className="flex items-center space-x-2">
      <div className="h-20 w-20 flex items-center justify-center rounded-sm">
        <Image
          src="/practice-logo.svg"
          alt="Practice Logo"
          width={60}
          height={60}
          className="text-black bg-white rounded-sm"
          priority
        />
      </div>
    </button>
  )
}
