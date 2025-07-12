import type React from "react"
export interface SearchBarProps {
  onSearch?: (query: string, category?: string, files?: File[]) => void
  showHeading?: boolean
  dynamicWidth?: boolean
  replyingTo?: {
    id: string
    text: string
    sender: "user" | "system"
  } | null
  onCancelReply?: () => void
  placeholder?: string
}

export interface SearchCategory {
  key: string
  label: string
}

export interface FileUploadProps {
  files: File[]
  onFileSelect: (files: FileList | null) => void
  onRemoveFile: (index: number) => void
  isDragOver: boolean
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
}

export interface SearchBarState {
  message: string
  selectedCategory: string | null
  isMenuOpen: boolean
  sidebarWidth: number
  isAnimating: boolean
  uploadedFiles: File[]
  isDragOver: boolean
  isFocused: boolean
  keyboardHeight: number
  isKeyboardVisible: boolean
  isMobileDevice: boolean
}
