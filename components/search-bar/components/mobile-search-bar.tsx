"use client"

import React from "react"
import { MessageSquarePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { SearchBarProps } from "../types/search-bar.types"
import { useSearchBar } from "../hooks/use-search-bar"
import { FileUpload, DragOverlay } from "./file-upload"
import { SearchInput } from "./search-input"
import { ActionButtons } from "./action-buttons"

export const MobileSearchBar = React.memo(function MobileSearchBar(props: SearchBarProps) {
  const { placeholder = "Поиск пути" } = props
  const { state, refs, handlers, computed } = useSearchBar({
    onSearch: props.onSearch,
    dynamicWidth: props.dynamicWidth,
  })

  return (
    <div
      ref={refs.containerRef}
      className={cn(
        "px-4 py-4 transition-all duration-300",
        state.isMobileDevice && state.isKeyboardVisible && "!px-2 !py-2",
      )}
      style={computed.dynamicStyles}
      data-animating={state.isAnimating ? "true" : "false"}
    >
      <div className="flex items-center gap-3">
        {/* Main search input container */}
        <div className="flex-1 border rounded-lg">
          <FileUpload files={state.uploadedFiles} onRemoveFile={handlers.removeFile} />

          <div
            className={`relative backdrop-blur-sm p-3 transition-all duration-300 flex items-center gap-2 rounded-lg ${
              state.isDragOver
                ? "border-violet-400 bg-violet-50/30"
                : computed.hasContent
                  ? "bg-white/20 border-white/30"
                  : "bg-white/10 border-white/20 hover:border-white/30"
            }`}
            onDragOver={handlers.handleDragOver}
            onDragLeave={handlers.handleDragLeave}
            onDrop={handlers.handleDrop}
          >
            <form onSubmit={handlers.handleSubmit} className="w-full">
              <SearchInput
                message={state.message}
                placeholder={placeholder}
                textareaRef={refs.textareaRef}
                onChange={handlers.handleMessageChange}
                onKeyDown={handlers.handleKeyDown}
                onFocus={handlers.handleFocus}
                onBlur={handlers.handleBlur}
              />

              <ActionButtons
                canSubmit={computed.canSubmit}
                isMenuOpen={state.isMenuOpen}
                onFileUpload={handlers.openFileDialog}
                onToggleMenu={handlers.toggleMenu}
                onSubmit={handlers.handleSubmit}
                isMobile={true}
              />
            </form>

            <DragOverlay isDragOver={state.isDragOver} />
          </div>

          <input
            ref={refs.fileInputRef}
            type="file"
            multiple
            accept="image/*,text/*,.pdf,.doc,.docx"
            onChange={(e) => handlers.handleFileSelect(e.target.files)}
            className="hidden"
          />
        </div>

        {/* New Chat Button - Mobile only */}
        <Button
          onClick={handlers.handleNewChat}
          className="h-12 w-12 p-0 bg-white dark:bg-gray-800 hover:bg-violet-50 dark:hover:bg-violet-700 text-gray-900 dark:text-white border rounded-lg flex-shrink-0"
        >
          <MessageSquarePlus className="w-5 h-5" />
        </Button>
      </div>

      <style jsx global>{`
        textarea::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
})
