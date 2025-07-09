"use client"

import Image from "next/image"

interface LogoProps {
  onClick: () => void
}

export function Logo({ onClick }: LogoProps) {
  return (
    <button onClick={onClick} className="flex items-center space-x-2">
      <div className="h-8 w-8 flex items-center justify-center">
        <Image
          src="/practice-logo.svg"
          alt="Practice Logo"
          width={32}
          height={32}
          className="w-8 h-8 text-black dark:text-white"
          priority
        />
      </div>
    </button>
  )
}
