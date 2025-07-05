"use client"

import type React from "react"
import {useState, useCallback, useRef, type DragEvent, useEffect} from "react"
import {GripVertical, X, Plus, Upload, File} from "lucide-react"

interface ExperienceItem {
    description: string
    certificate?: File | null
}

interface ExperienceFormProps {
    title?: string,
    description?: string,
    items?: ExperienceItem[],
    onChange: (experience: ExperienceItem[]) => void,
    showCertificates?: boolean,
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

const ExperienceForm: React.FC<ExperienceFormProps> = ({
                                                           title,
                                                           description,
                                                           items = [],
                                                           onChange,
                                                           showCertificates = true,
                                                       }) => {
    const [experience, setExperience] = useState<ExperienceItem[]>(
        items.length > 0 ? items : [{description: "", certificate: null}],
    )
    const [fileDragIndex, setFileDragIndex] = useState<number | null>(null)
    const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null)
    const [dragOverItemIndex, setDragOverItemIndex] = useState<number | null>(null)
    const fileInputRefs = useRef<(HTMLInputElement | null)[]>([])

    // Sync with parent state when items prop changes
    useEffect(() => {
        if (items.length > 0) {
            setExperience(items)
        }
    }, [items])

    const handleDescriptionChange = useCallback(
        (index: number, value: string) => {
            const newExperience = [...experience]
            newExperience[index] = {...newExperience[index], description: value}
            setExperience(newExperience)
            onChange(newExperience)
        },
        [experience, onChange],
    )

    const handleAddExperience = useCallback(() => {
        const newExperience = [...experience, {description: "", certificate: null}]
        setExperience(newExperience)
        onChange(newExperience)
    }, [experience, onChange])

    const handleRemoveExperience = useCallback(
        (index: number) => {
            const newExperience = experience.filter((_, i) => i !== index)
            setExperience(newExperience)
            onChange(newExperience)
            setFileDragIndex(null)
        },
        [experience, onChange],
    )

    const handleFileChange = useCallback(
        (index: number, file: File | null) => {
            if (file && file.size > MAX_FILE_SIZE) {
                alert("File size exceeds 5MB limit")
                return
            }

            const newExperience = [...experience]
            newExperience[index] = {...newExperience[index], certificate: file}
            setExperience(newExperience)
            onChange(newExperience)
        },
        [experience, onChange],
    )

    const handleRemoveCertificate = useCallback(
        (index: number) => {
            handleFileChange(index, null)
        },
        [handleFileChange],
    )

    const handleFileInputClick = useCallback((index: number) => {
        fileInputRefs.current[index]?.click()
    }, [])

    // New drag-and-drop handlers for experience items
    const handleItemDragStart = useCallback((e: DragEvent, index: number) => {
        setDraggedItemIndex(index)
        e.dataTransfer.effectAllowed = "move"
        e.dataTransfer.setData("text/plain", "experienceItem")
    }, [])

    const handleItemDragOver = useCallback(
        (e: DragEvent, index: number) => {
            e.preventDefault()
            if (draggedItemIndex === null) return

            if (dragOverItemIndex !== index) {
                setDragOverItemIndex(index)
            }
        },
        [draggedItemIndex, dragOverItemIndex],
    )

    const handleItemDragLeave = useCallback(() => {
        setDragOverItemIndex(null)
    }, [])

    const handleItemDrop = useCallback(
        (e: DragEvent, index: number) => {
            e.preventDefault()
            if (draggedItemIndex === null || draggedItemIndex === index) return

            const newExperience = [...experience]
            const draggedItem = newExperience[draggedItemIndex]
            newExperience.splice(draggedItemIndex, 1)
            newExperience.splice(index, 0, draggedItem)

            setExperience(newExperience)
            onChange(newExperience)
            setDraggedItemIndex(null)
            setDragOverItemIndex(null)
        },
        [draggedItemIndex, experience, onChange],
    )

    const handleItemDragEnd = useCallback(() => {
        setDraggedItemIndex(null)
        setDragOverItemIndex(null)
    }, [])

    const handleFileDragOver = useCallback((e: DragEvent, index: number) => {
        e.preventDefault()
        e.stopPropagation() // Prevent triggering item reordering
        setFileDragIndex(index)
    }, [])

    const handleFileDrop = useCallback(
        (e: DragEvent, index: number) => {
            e.preventDefault()
            e.stopPropagation() // Prevent triggering item reordering
            setFileDragIndex(null)

            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                const file = e.dataTransfer.files[0]
                handleFileChange(index, file)
            }
        },
        [handleFileChange],
    )

    const handleFileDragLeave = useCallback(() => {
        setFileDragIndex(null)
    }, [])

    // Prevent adding new items if any description is empty
    const canAddNewItem = experience.every((item) => item.description.trim() !== "")

    return (
        <div
            className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800/50 rounded-sm border border-gray-200 dark:border-gray-600 p-4 space-y-3 transition-colors duration-300">
            {title && (
                <div className="text-center space-y-2 mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
                    {description && <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>}
                </div>
            )}

            {experience.map((item, index) => (
                <div
                    key={index}
                    draggable
                    onDragStart={(e) => handleItemDragStart(e, index)}
                    onDragOver={(e) => handleItemDragOver(e, index)}
                    onDragLeave={handleItemDragLeave}
                    onDrop={(e) => handleItemDrop(e, index)}
                    onDragEnd={handleItemDragEnd}
                    className={`group bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-3 hover:border-violet-300 hover:shadow-sm transition-all duration-200 space-y-3 ${
                        draggedItemIndex === index ? "opacity-50" : ""
                    } ${dragOverItemIndex === index ? "ring-2 ring-violet-500" : ""}`}
                >
                    <div className="flex items-center space-x-3">
                        <div
                            className="flex items-center space-x-2 cursor-grab active:cursor-grabbing"
                            draggable
                            onDragStart={(e) => {
                                e.stopPropagation()
                                handleItemDragStart(e, index)
                            }}
                        >
                            <GripVertical className="h-4 w-4 text-gray-400 dark:text-gray-500"/>
                        </div>
                        <input
                            value={item.description}
                            onChange={(e) => handleDescriptionChange(index, e.target.value)}
                            placeholder="Add your work experience..."
                            className="flex-1 border-0 bg-transparent focus:ring-0 focus:border-0 p-0 text-gray-700 dark:text-gray-300 transition-colors duration-300 outline-none"
                        />
                        {experience.length > 1 && (
                            <button
                                type="button"
                                onClick={() => handleRemoveExperience(index)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                            >
                                <X className="h-3 w-3"/>
                            </button>
                        )}
                    </div>

                    {showCertificates && (
                        <div className="space-y-2" onDragOver={(e) => e.stopPropagation()}
                             onDrop={(e) => e.stopPropagation()}>
                            <div
                                className={`border-2 rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer transition-all duration-200
            ${
                                    fileDragIndex === index
                                        ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20 border-dashed"
                                        : "border-gray-300 dark:border-gray-600 border-dashed"
                                }
            ${item.certificate ? "border-solid" : ""}`}
                                onClick={() => handleFileInputClick(index)}
                                onDragOver={(e) => handleFileDragOver(e, index)}
                                onDragLeave={handleFileDragLeave}
                                onDrop={(e) => handleFileDrop(e, index)}
                            >
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => handleFileChange(index, e.target.files?.[0] || null)}
                                    accept=".pdf,.jpg,.jpeg,.png"
                                />

                                {item.certificate ? (
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center space-x-2">
                                            <File className="h-5 w-5 text-violet-600 dark:text-violet-400"/>
                                            <span
                                                className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[180px]">
                        {item.certificate.name}
                      </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleRemoveCertificate(index)
                                            }}
                                            className="p-1 text-red-500 "
                                        >
                                            <X className="h-4 w-4"/>
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="h-5 w-5 text-violet-600 dark:text-violet-400 mb-1"/>
                                        <p className="text-sm text-center text-gray-700 dark:text-gray-300">
                                            {fileDragIndex === index ? "Drop your certificate here" : "Drag & drop your certificate"}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">or click to browse (Max
                                            5MB)</p>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            ))}

            <button
                type="button"
                onClick={handleAddExperience}
                disabled={!canAddNewItem}
                className={`w-full flex items-center justify-center space-x-2 border border-dashed py-3 rounded-lg transition-colors duration-300 ${
                    canAddNewItem
                        ? "text-violet-600 dark:text-violet-400 border-violet-300 dark:border-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20"
                        : "text-gray-400 dark:text-gray-500 border-gray-300 dark:border-gray-600 cursor-not-allowed"
                }`}
            >
                <Plus className="h-4 w-4"/>
                <span>Add Experience</span>
            </button>
        </div>
    )
}

export default ExperienceForm
