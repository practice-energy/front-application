"use client"

import {useState, useRef, ChangeEvent, DragEvent, useEffect} from "react"
import Image from "next/image"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import type { ProfileData } from "@/components/profile/types/common"
import { AddEntityButton } from "@/components/add-entity-button"
import { Education } from "@/types/common"
import { EditEntityButton } from "@/components/edit-entity-button"
import { BurnEntityButton } from "@/components/burn-entity-button"
import { EnhancedInput } from "../enhanced-input"
import { SaveEntityButton } from "@/components/save-entity-button"
import { ImageUp } from "lucide-react"
import { PracticePlaceholder } from "@/components/practice-placeholder"
import { motion, AnimatePresence } from "framer-motion"

interface CertificatesProps {
    title: string
    items: Education[]
    isEditMode: boolean
    onInputChange: (field: keyof ProfileData, value: Education[]) => void
    errors: Record<string, string>
    fieldKey: keyof ProfileData
}

export function Certificates({ title, items, isEditMode, onInputChange, errors, fieldKey }: CertificatesProps) {
    const isMobile = useIsMobile()
    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const [fileUploads, setFileUploads] = useState<Record<number, File | null>>({})
    const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({})
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
    const [hoveredCertificate, setHoveredCertificate] = useState<number | null>(null)
    const [removingIndex, setRemovingIndex] = useState<number | null>(null)

    const handleAddCertificate = () => {
        const updatedItems = [...items, {
            title: "",
            description: "",
            certificate: "",
        }]
        onInputChange(fieldKey, updatedItems)
        setEditingIndex(updatedItems.length - 1)
    }

    useEffect(() => {
        if(!isEditMode) {
            setEditingIndex(null)
        }
    }, [isEditMode])

    const handleBurnCertificate = async (index: number) => {
        setRemovingIndex(index)
        await new Promise(resolve => setTimeout(resolve, 300)) // Wait for animation

        const updatedItems = items.filter((_, i) => i !== index)
        onInputChange(fieldKey, updatedItems)

        if (editingIndex === index) {
            setEditingIndex(null)
        }

        setFileUploads(prev => {
            const newUploads = {...prev}
            delete newUploads[index]
            return newUploads
        })
        setRemovingIndex(null)
    }

    const handleStartEditing = (index: number) => {
        setEditingIndex(index)
    }

    const handleSaveCertificate = async (index: number, updatedItem: Education) => {
        if (fileUploads[index]) {
            await new Promise(resolve => setTimeout(resolve, 1000))
            const mockFileUrl = URL.createObjectURL(fileUploads[index]!)

            const updatedItems = [...items]
            updatedItems[index] = {
                ...updatedItems[index],
                certificate: mockFileUrl
            }
            onInputChange(fieldKey, updatedItems)

            setFileUploads(prev => {
                const newUploads = {...prev}
                delete newUploads[index]
                return newUploads
            })
        } else {
            const updatedItems = [...items]
            updatedItems[index] = updatedItem
            onInputChange(fieldKey, updatedItems)
        }

        setEditingIndex(null)
    }

    const handleFieldChange = (index: number, field: keyof Education, value: string) => {
        const updatedItems = [...items]
        updatedItems[index] = {
            ...updatedItems[index],
            [field]: value
        }
        onInputChange(fieldKey, updatedItems)
    }

    const handleFileChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFileUploads(prev => ({
                ...prev,
                [index]: e.target.files![0]
            }))
        }
    }

    const handleDragOver = (index: number, e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setDragOverIndex(index)
    }

    const handleDragLeave = () => {
        setDragOverIndex(null)
    }

    const handleDrop = (index: number, e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setDragOverIndex(null)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFileUploads(prev => ({
                ...prev,
                [index]: e.dataTransfer.files[0]
            }))
        }
    }

    const triggerFileInput = (index: number) => {
        fileInputRefs.current[index]?.click()
    }

    const getCertificatePreview = (index: number) => {
        if (fileUploads[index]) {
            return URL.createObjectURL(fileUploads[index]!)
        }
        return items[index].certificate
    }

    return (
        <>
            <div className="flex flex-row gap-2">
                <div className={cn(
                    "font-semibold text-neutral-900 md:mb-4 line-clamp-1 leading-relaxed",
                    isMobile ? "text-mobilebase" : "text-base",
                )}>{title}</div>
                {isEditMode && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                    >
                        <AddEntityButton onClick={handleAddCertificate}/>
                    </motion.div>
                )}
            </div>
            <div className="space-y-3">
                <AnimatePresence>
                    {items.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{
                                opacity: removingIndex === index ? 0 : 1,
                                height: removingIndex === index ? 0 : 'auto',
                                transition: {
                                    opacity: { duration: 0.2 },
                                    height: { duration: 0.3 }
                                }
                            }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                        >
                            {isEditMode && (
                                <div className="flex flex-row gap-6 justify-end pr-3 p-3">
                                    {editingIndex === index ? (
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="flex gap-6"
                                        >
                                            <SaveEntityButton onClick={() => handleSaveCertificate(index, item)} />
                                            <BurnEntityButton onClick={() => handleBurnCertificate(index)} />
                                        </motion.div>
                                    ) : (
                                        <>
                                            {isEditMode && (
                                                <motion.div
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="flex gap-6"
                                                >
                                                    <EditEntityButton onClick={() => handleStartEditing(index)} />
                                                    <BurnEntityButton onClick={() => handleBurnCertificate(index)} />
                                                </motion.div>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                            <motion.div
                                className="bg-white p-3 rounded-sm shadow-sm"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {editingIndex === index ? (
                                    <motion.div
                                        className="flex"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="flex-1 min-w-0 pr-3">
                                            <EnhancedInput
                                                value={item.title}
                                                onChange={(e) => handleFieldChange(index, 'title', e.target.value)}
                                                placeholder="Введите название"
                                                error={errors.title}
                                                required
                                                showEditIcon
                                            />
                                            <EnhancedInput
                                                value={item.description}
                                                onChange={(e) => handleFieldChange(index, 'description', e.target.value)}
                                                placeholder="Введите описание"
                                                type="input"
                                                rows={1}
                                                showEditIcon
                                            />
                                        </div>
                                        <motion.div
                                            className="relative w-[64px] h-[64px] aspect-square flex-shrink-0 my-auto pb-1 bg-colors-neutral-150 rounded-sm border shadow-md cursor-pointer ml-auto"
                                            onClick={() => triggerFileInput(index)}
                                            onDragOver={(e) => handleDragOver(index, e)}
                                            onDragLeave={handleDragLeave}
                                            onDrop={(e) => handleDrop(index, e)}
                                            onMouseEnter={() => setHoveredCertificate(index)}
                                            onMouseLeave={() => setHoveredCertificate(null)}
                                            whileHover={{ scale: 1.02 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                        >
                                            <input
                                                type="file"
                                                ref={el => fileInputRefs.current[index] = el}
                                                onChange={(e) => handleFileChange(index, e)}
                                                className="hidden"
                                                accept="image/*,.pdf"
                                            />

                                            {getCertificatePreview(index) ? (
                                                <>
                                                    <Image
                                                        src={getCertificatePreview(index) || "/placeholder.svg"}
                                                        alt={`Certificate ${index}`}
                                                        width={48}
                                                        height={48}
                                                        className={cn(
                                                            "w-full h-full object-cover rounded-sm transition-opacity",
                                                            dragOverIndex === index ? "opacity-50" : "",
                                                            hoveredCertificate === index ? "opacity-50" : ""
                                                        )}
                                                    />
                                                    {(dragOverIndex === index || hoveredCertificate === index) && (
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <div className="flex flex-col items-center">
                                                                <ImageUp className="w-8 h-8 text-neutral-600" />
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-colors-neutral-150 rounded-sm">
                                                    <PracticePlaceholder
                                                        width={48}
                                                        height={48}
                                                        className={cn(
                                                            "object-cover rounded-sm transition-opacity",
                                                            dragOverIndex === index ? "opacity-20" : "",
                                                            hoveredCertificate === index ? "opacity-20" : ""
                                                        )}
                                                    />
                                                    {(dragOverIndex === index || hoveredCertificate === index) && (
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <div className="flex flex-col items-center">
                                                                <ImageUp className="w-8 h-8 text-neutral-600" />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </motion.div>
                                    </motion.div>
                                ) : (
                                    <div className="flex">
                                        <div className="flex-1 min-w-0 pr-3">
                                            <div className="font-semibold text-neutral-900 line-clamp-1 leading-relaxed">{item.title}</div>
                                            <div className="text-sm text-neutral-600 mt-1 line-clamp-2 leading-relaxed">{item.description}</div>
                                        </div>
                                        <div className="w-[72px] aspect-square flex-shrink-0 bg-colors-neutral-150 rounded-sm border shadow-md">
                                            {item.certificate ? (
                                                <Image
                                                    src={item.certificate || "/placeholder.svg"}
                                                    alt={`Certificate ${index}`}
                                                    width={48}
                                                    height={48}
                                                    className="w-full h-full object-cover rounded-sm"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-colors-neutral-150 rounded-sm">
                                                    <PracticePlaceholder width={48} height={48} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </>
    )
}
