"use client"

import React from "react"
import { ArrowUp, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface ActionButtonsProps {
  canSubmit: boolean
  isMenuOpen: boolean
  onFileUpload: () => void
  onToggleMenu: () => void
  onSubmit: (e: React.FormEvent) => void
  isMobile?: boolean
}

export const ActionButtons = React.memo(function ActionButtons({
  canSubmit,
  isMenuOpen,
  onFileUpload,
  onToggleMenu,
  onSubmit,
  isMobile = false,
}: ActionButtonsProps) {
  const buttonSize = isMobile ? "h-8" : "h-9"
  const buttonPadding = isMobile ? "px-2 py-1" : "px-3 py-2"

  return (
    <div className="flex items-center justify-between mt-2">
      <div className="flex items-center gap-2">
        {/* File Upload Button */}
        <Button
          type="button"
          size="sm"
          onClick={onFileUpload}
          className={`bg-white dark:bg-gray-800 hover:bg-violet-50 dark:hover:bg-violet-700 text-gray-900 dark:text-white ${buttonPadding} ${buttonSize} transition-colors duration-200 flex items-center gap-1 border`}
        >
          <Paperclip className="w-4 h-4" />
        </Button>

        {/* Practice Button */}
        <Button
          type="button"
          size="sm"
          onClick={onToggleMenu}
          className={`${buttonPadding} ${buttonSize} font-medium transition-colors duration-200 flex items-center gap-1 ${
            isMenuOpen
              ? "bg-violet-600 text-white border-violet-600 hover:bg-violet-500 border"
              : "bg-white dark:bg-gray-800 hover:bg-violet-50 dark:hover:bg-violet-700 text-gray-900 dark:text-white border"
          }`}
        >
          <Image
            src="/practice-logo.svg"
            alt="Settings"
            width={14}
            height={14}
            className={`${isMenuOpen ? "filter brightness-0 invert" : "dark:filter dark:brightness-0 dark:invert"}`}
          />
          <span className={isMobile ? "text-sm" : ""}>Практис</span>
        </Button>
      </div>

      {/* Send Button */}
      <Button
        type="submit"
        disabled={!canSubmit}
        onClick={onSubmit}
        className={`${isMobile ? "h-8 w-8" : "h-9 w-9"} p-0 ${
          canSubmit
            ? "bg-violet-600 hover:bg-violet-700 text-white"
            : "bg-violet-200 dark:bg-violet-700 text-white dark:text-gray-500 cursor-not-allowed"
        }`}
      >
        <ArrowUp className="w-4 h-4" />
      </Button>
    </div>
  )
})
