"use client"

import Image from "next/image"

interface LogoProps {
  onClick: () => void
}

export function Logo({ onClick }: LogoProps) {
  return (
    <button onClick={onClick} className="flex items-center space-x-2">
      <div className="h-9 w-9 flex items-center justify-center">
        <Image
          src="/practice-logo.svg"
          alt="Practice Logo"
          width={48}
          height={48}
          className="w-8 h-8 text-black bg-white border"
          priority
        />
      </div>
    </button>
  )
}
