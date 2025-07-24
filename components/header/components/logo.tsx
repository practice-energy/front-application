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
    <button
        onClick={onClick}
        className="space-x-2"
        style={{
          position: "fixed",
          left: "440px",
          top: "20px",
          zIndex: 60,
        }}
    >
      <div className="h-20 w-20 rounded-sm">
        <IconPractice
          width={60}
          height={60}
          className="text-black bg-white rounded-sm"
        />
      </div>
    </button>
  )
}
