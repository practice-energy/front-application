"use client"

import React from "react"
import { cn } from "@/lib/utils"
import type { SearchBarProps } from "../types/search-bar.types"
import { useSearchBar } from "../hooks/use-search-bar"
import { FileUpload, DragOverlay } from "./file-upload"
import { SearchInput } from "./search-input"
import { ActionButtons } from "./action-buttons"

export const DesktopSearchBar = React.memo(function DesktopSearchBar(props: SearchBarProps) {
  const { placeholder = "Поиск пути" } = props
  const { state, refs, handlers, computed } = useSearchBar({
    onSearch: props.onSearch,
    dynamicWidth: props.dynamicWidth,
  })

  return (
    <div
      ref={refs.containerRef}
      className={cn(
        "px-4 sm:px-6 lg:px-8 py-4 transition-all duration-300",
        state.isMobileDevice && state.isKeyboardVisible && "!px-2 !py-2",
      )}
      style={computed.dynamicStyles}
      data-animating={state.isAnimating ? "true" : "false"}
    >
      <div className="max-w-4xl mx-auto border rounded-sm">
        <FileUpload files={state.uploadedFiles} onRemoveFile={handlers.removeFile} />

        <div
          className={`relative border rounded-sm backdrop-blur-sm p-2.5 sm:p-3.5 transition-all duration-300 flex items-center gap-2 animate-in fade-in duration-300 ${
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
            <div className="pb-2">
              <SearchInput
                message={state.message}
                placeholder={placeholder}
                textareaRef={refs.textareaRef}
                onChange={handlers.handleMessageChange}
                onKeyDown={handlers.handleKeyDown}
                onFocus={handlers.handleFocus}
                onBlur={handlers.handleBlur}
              />
            </div>

            <ActionButtons
              canSubmit={computed.canSubmit}
              isMenuOpen={state.isMenuOpen}
              onFileUpload={handlers.openFileDialog}
              onToggleMenu={handlers.toggleMenu}
              onSubmit={handlers.handleSubmit}
              isMobile={false}
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

      <style jsx global>{`
        textarea::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
})
