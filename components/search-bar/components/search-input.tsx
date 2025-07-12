"use client"

import React from "react"
import Image from "next/image"

interface SearchInputProps {
  message: string
  placeholder: string
  textareaRef: React.RefObject<HTMLTextAreaElement>
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  onFocus: () => void
  onBlur: () => void
}

export const SearchInput = React.memo(function SearchInput({
  message,
  placeholder,
  textareaRef,
  onChange,
  onKeyDown,
  onFocus,
  onBlur,
}: SearchInputProps) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
        <Image src="/allura-logo.svg" alt="Alura Logo" width={20} height={20} className="w-5 h-5" priority />
      </div>
      <div className="flex-1 min-w-0">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          className="w-full border-0 bg-transparent text-base placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-0 resize-none overflow-hidden min-h-[24px] max-h-[120px] text-gray-900 dark:text-white"
          rows={1}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        />
      </div>
    </div>
  )
})
