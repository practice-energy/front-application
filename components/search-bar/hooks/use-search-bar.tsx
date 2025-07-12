"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { v4 as uuidv4 } from "uuid"
import { ANIMATION_DURATION, ANIMATION_TIMING } from "@/components/main-sidebar/utils/sidebar.utils"
import { useSidebar } from "@/contexts/sidebar-context"
import type { SearchBarState } from "../types/search-bar.types"
import { preventEmoji, createSearchParams, generateChatTitle } from "../utils/search-bar.utils"

interface UseSearchBarProps {
  onSearch?: (query: string, category?: string, files?: File[]) => void
  dynamicWidth?: boolean
}

export const useSearchBar = ({ onSearch, dynamicWidth = false }: UseSearchBarProps) => {
  const router = useRouter()
  const { isCollapsed: sidebarCollapsed } = useSidebar()

  const [state, setState] = useState<SearchBarState>({
    message: "",
    selectedCategory: null,
    isMenuOpen: false,
    sidebarWidth: 0,
    isAnimating: false,
    uploadedFiles: [],
    isDragOver: false,
    isFocused: false,
    keyboardHeight: 0,
    isKeyboardVisible: false,
    isMobileDevice: false,
  })

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setState((prev) => ({
        ...prev,
        isMobileDevice: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      }))
    }
    checkMobile()
  }, [])

  // Handle sidebar width changes
  useEffect(() => {
    if (!dynamicWidth) return

    const handleSidebarToggle = (event: CustomEvent) => {
      const { isCollapsed } = event.detail
      setState((prev) => ({ ...prev, isAnimating: true }))

      const targetWidth = isCollapsed ? 0 : 320
      setState((prev) => ({ ...prev, sidebarWidth: targetWidth }))

      setTimeout(() => {
        setState((prev) => ({ ...prev, isAnimating: false }))
      }, ANIMATION_DURATION)
    }

    const observeSidebar = () => {
      const sidebar = document.querySelector("[data-sidebar]") as HTMLElement
      if (!sidebar) return

      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
      }

      resizeObserverRef.current = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const width = entry.contentRect.width
          setState((prev) => ({ ...prev, sidebarWidth: width }))
        }
      })

      resizeObserverRef.current.observe(sidebar)
      setState((prev) => ({ ...prev, sidebarWidth: sidebar.offsetWidth }))
    }

    observeSidebar()
    window.addEventListener("sidebarToggle", handleSidebarToggle as EventListener)

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
      window.removeEventListener("sidebarToggle", handleSidebarToggle as EventListener)
    }
  }, [dynamicWidth])

  // Handle mobile keyboard
  useEffect(() => {
    if (!state.isMobileDevice) return

    const handleFocusIn = () => {
      setTimeout(() => {
        const viewport = window.visualViewport
        if (viewport) {
          const keyboardHeight = window.innerHeight - viewport.height
          setState((prev) => ({
            ...prev,
            keyboardHeight,
            isKeyboardVisible: keyboardHeight > 0,
          }))
        }
      }, 300)
    }

    const handleFocusOut = () => {
      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          keyboardHeight: 0,
          isKeyboardVisible: false,
        }))
      }, 300)
    }

    window.addEventListener("focusin", handleFocusIn)
    window.addEventListener("focusout", handleFocusOut)

    return () => {
      window.removeEventListener("focusin", handleFocusIn)
      window.removeEventListener("focusout", handleFocusOut)
    }
  }, [state.isMobileDevice])

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return

    const newFiles = Array.from(files).slice(0, 5)
    setState((prev) => ({
      ...prev,
      uploadedFiles: [...prev.uploadedFiles, ...newFiles].slice(0, 5),
    }))
  }, [])

  const removeFile = useCallback((index: number) => {
    setState((prev) => ({
      ...prev,
      uploadedFiles: prev.uploadedFiles.filter((_, i) => i !== index),
    }))
  }, [])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const trimmedMessage = state.message.trim()
      if (!trimmedMessage && state.uploadedFiles.length === 0) return

      if (onSearch) {
        onSearch(trimmedMessage, state.selectedCategory || undefined, state.uploadedFiles)
        setState((prev) => ({
          ...prev,
          message: "",
          selectedCategory: null,
          isMenuOpen: false,
          uploadedFiles: [],
        }))
      } else {
        const searchId = uuidv4()

        window.dispatchEvent(
          new CustomEvent("newChatCreated", {
            detail: {
              chatId: searchId,
              title: generateChatTitle(trimmedMessage),
              query: trimmedMessage,
              files: state.uploadedFiles,
            },
          }),
        )

        const queryParams = createSearchParams(trimmedMessage, state.selectedCategory)
        router.push(`/search/${searchId}?${queryParams}`)
      }
    },
    [state.message, state.selectedCategory, state.uploadedFiles, onSearch, router],
  )

  const handleNewChat = useCallback(() => {
    const searchId = uuidv4()

    window.dispatchEvent(
      new CustomEvent("newChatCreated", {
        detail: {
          chatId: searchId,
          title: "New Chat",
          query: "",
          files: [],
        },
      }),
    )

    router.push(`/search/${searchId}`)
  }, [router])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      preventEmoji(e)

      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSubmit(e)
      }
    },
    [handleSubmit],
  )

  const handleMessageChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setState((prev) => ({ ...prev, message: e.target.value }))
  }, [])

  const handleFocus = useCallback(() => {
    setState((prev) => ({ ...prev, isFocused: true }))
  }, [])

  const handleBlur = useCallback(() => {
    setState((prev) => ({ ...prev, isFocused: false }))
  }, [])

  const toggleMenu = useCallback(() => {
    setState((prev) => ({ ...prev, isMenuOpen: !prev.isMenuOpen }))
  }, [])

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setState((prev) => ({ ...prev, isDragOver: true }))
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setState((prev) => ({ ...prev, isDragOver: false }))
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setState((prev) => ({ ...prev, isDragOver: false }))
      handleFileSelect(e.dataTransfer.files)
    },
    [handleFileSelect],
  )

  const dynamicStyles = useMemo(() => {
    if (!dynamicWidth) return {}

    const currentSidebarWidth = sidebarCollapsed ? 0 : state.sidebarWidth || 320

    const baseStyles = {
      marginLeft: `${currentSidebarWidth}px`,
      transition: state.isAnimating ? `all ${ANIMATION_DURATION}ms ${ANIMATION_TIMING}` : "none",
    }

    if (state.isMobileDevice && state.isKeyboardVisible) {
      return {
        ...baseStyles,
        position: "fixed" as const,
        bottom: `${state.keyboardHeight}px`,
        left: "0",
        right: "0",
        width: "100%",
        marginLeft: "0",
        zIndex: 1000,
        transform: "translateY(0)",
      }
    }

    return baseStyles
  }, [
    dynamicWidth,
    sidebarCollapsed,
    state.sidebarWidth,
    state.isAnimating,
    state.isMobileDevice,
    state.isKeyboardVisible,
    state.keyboardHeight,
  ])

  const canSubmit = state.message.trim() || state.uploadedFiles.length > 0
  const hasContent = state.message.trim().length > 0 || state.isFocused

  return {
    state,
    refs: {
      textareaRef,
      containerRef,
      fileInputRef,
    },
    handlers: {
      handleFileSelect,
      removeFile,
      handleSubmit,
      handleNewChat,
      handleKeyDown,
      handleMessageChange,
      handleFocus,
      handleBlur,
      toggleMenu,
      openFileDialog,
      handleDragOver,
      handleDragLeave,
      handleDrop,
    },
    computed: {
      dynamicStyles,
      canSubmit,
      hasContent,
    },
  }
}
