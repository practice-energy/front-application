"use client"

import React from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { DesktopMufi } from "./desktop"
import { MobileMufi } from "./mobile"

interface SearchBarProps {
  onSearch?: (query: string, title?: string, files?: File[], isPractice?: boolean) => void
  showHeading?: boolean
  dynamicWidth?: boolean
  replyingTo?: {
    id: string
    text: string
    sender: "user" | "system"
  } | null
  onCancelReply?: () => void
  placeholder?: string
  chatTitle?: string
  disableFileApply: boolean
  showPractice: boolean
  mode?: "accept" | "continue" | "input"
  onContinue?: () => void
  canAccept?: boolean
  selector: {
    question: string
    variants: string[]
  }
}

export const Mufi = React.memo(function SearchBar(props: SearchBarProps) {
  const isMobile = useIsMobile()
  const { mode = "input", ...restProps } = props

  if (isMobile) {
    return <MobileMufi {...restProps} mode={mode} />
  }

  return (
    <div className="max-w-4xl mx-auto mb-6">
      <DesktopMufi {...restProps} mode={mode} />
    </div>
  )
})
