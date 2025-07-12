"use client"

import React from "react"
import { X, FileText } from "lucide-react"
import type { FileUploadProps } from "../types/search-bar.types"

export const FileUpload = React.memo(function FileUpload({
  files,
  onRemoveFile,
}: Omit<FileUploadProps, "onFileSelect" | "isDragOver" | "onDragOver" | "onDragLeave" | "onDrop">) {
  if (files.length === 0) return null

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {files.map((file, index) => (
        <div key={index} className="flex items-center gap-2 bg-violet-600/20 text-white rounded-lg px-3 py-2 text-sm">
          <FileText className="w-4 h-4 text-white" />
          <span className="truncate max-w-32">{file.name}</span>
          <button onClick={() => onRemoveFile(index)} className="text-white hover:text-red-300 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
})

export const DragOverlay = React.memo(function DragOverlay({ isDragOver }: { isDragOver: boolean }) {
  if (!isDragOver) return null

  return (
    <div className="absolute inset-0 bg-violet-100/50 rounded-lg flex items-center justify-center pointer-events-none">
      <div className="text-violet-600 text-center">
        <FileText className="w-8 h-8 mx-auto mb-2" />
        <p className="text-sm font-medium">Перетащите файлы сюда</p>
      </div>
    </div>
  )
})
