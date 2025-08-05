"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {TimerReset} from "lucide-react"
import { RubleIcon } from "@/components/ui/ruble-sign"
import {formatNumber} from "@/utils/format";
import {BurnEntityButton} from "@/components/burn-entity-button";
import {RepeatEntityButton} from "@/components/repeat-entity-button";
import {EditEntityButton} from "@/components/edit-entity-button";
import {IconPractice} from "@/components/icons/icon-practice";
import {PracticePlaceholder} from "@/components/practice-placeholder";
import { motion, AnimatePresence } from "framer-motion";
import {cn} from "@/lib/utils";
import {Service} from "@/types/service";

interface InstagramServiceCardProps {
    service: Service
    onClick?: () => void
    specialistId?: string // ID of specialist for reply functionality
    isEditMode? : boolean
    onCopy?: () => void
    onEdit?: () => void
    onBurn?: () => void
}

export function InstagramServiceCard({
                                         service,
                                         onClick,
                                         isEditMode,
                                         onCopy,
                                         onEdit,
                                         onBurn
                                     }: InstagramServiceCardProps) {
    const router = useRouter()
    const [isBurning, setIsBurning] = useState(false)

    const handleCardClick = () => {
        if (onClick && !isBurning) {
            onClick()
        } else if (!isBurning) {
            router.push(`/service/${service.id}`)
        }
    }

    const handleBurn = () => {
        setIsBurning(true)
        setTimeout(() => {
            onBurn?.()
        }, 300) // Даем время для анимации перед вызовом onBurn
    }

    return (
        <div className="relative">
            <AnimatePresence>
                {isEditMode && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-row ml-auto mr-1.5 gap-6 items-end justify-end p-2"
                    >
                        <RepeatEntityButton onClick={onCopy}/>
                        <EditEntityButton onClick={onEdit}/>
                        <BurnEntityButton onClick={handleBurn}/>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {!isBurning && (
                    <motion.div
                        layout // Анимация изменения layout
                        initial={{ scale: 1, opacity: 1 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{
                            scale: 0.8,
                            opacity: 0,
                            transition: { duration: 0.3 }
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="md:w-[240px]"
                    >
                        <motion.div
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 1 }}
                            className="w-full h-full bg-white rounded-sm shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-gray-200 dark:hover:border-gray-600"
                            onClick={handleCardClick}
                        >
                            {/* Image Container - фиксированный размер */}
                            <motion.div
                                className="relative w-full h-[225px] overflow-hidden" // Фиксированная высота как у SVG
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                            >
                                {service.images && service.images.length > 0 ? (
                                    <motion.img
                                        src={service.images[0] || "/placeholder.svg"}
                                        alt={service.title}
                                        className="w-full h-full object-cover"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.5 }}
                                        exit={{ opacity: 0 }}
                                    />
                                ) : (
                                    <motion.svg
                                        viewBox="0 0 251 225"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={cn(
                                            "w-full h-full object-cover bg-neutral-100 rounded-b-none stroke-current",
                                            "text-gray-400",
                                        )}
                                        preserveAspectRatio="xMidYMid meet"
                                    >
                                        {/* Группа с трансформацией масштабирования и смещением вверх */}
                                        <g transform="scale(0.33) translate(250, 240)"> {/* Уменьшили Y-координату с 340 до 240 */}
                                            <path d="M44 224.421L44 0.999961" stroke="currentColor" stroke-width="30"/>
                                            <line x1="8.60365" y1="32.7127" x2="241.415" y2="195.729" stroke="currentColor" stroke-width="30"/>
                                            <line x1="241.415" y1="30.2873" x2="8.60355" y2="193.304" stroke="currentColor" stroke-width="30"/>
                                            <path d="M206 224.421L206 0.999962" stroke="currentColor" stroke-width="30"/>
                                        </g>
                                    </motion.svg>
                                )}
                            </motion.div>

                            {/* Content */}
                            {service.title !== "" ? (
                                <motion.div
                                    className="px-1.5 pb-1.5 min-h-[65px] bg-colors-neutral-150 h-full"
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.1, duration: 0.3 }}
                                    exit={{ opacity: 0 }}
                                >
                                    {/* First row: Title on left, Price on right */}
                                    <div className="flex justify-between items-center mb-1.5">
                                        <motion.div
                                            className="font-bold text-base text-gray-900 line-clamp-1 flex-1"
                                            whileHover={{ x: 2 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            {service.title}
                                        </motion.div>
                                        <motion.div
                                            className="text-[18px] font-semibold whitespace-nowrap"
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            {service.price > 0 && (
                                                <>
                                                    {formatNumber(service.price)}
                                                    <RubleIcon size={20} bold={false} className="inline mb-0.5" />
                                                </>
                                            )}
                                        </motion.div>
                                    </div>

                                    {/* Second row: Duration with icon */}
                                    <motion.div
                                        className="flex items-center gap-1 mb-1.5"
                                        whileHover={{ x: 2 }}
                                    >
                                        {service.duration && service.duration !== "" && (
                                            <>
                                                <TimerReset className="text-gray-500 w-[14px] h-[14px]" size={14}/>
                                                <span className="text-xs text-neutral-700">
                                                    {service.duration}
                                                </span>
                                            </>
                                        )}
                                    </motion.div>

                                    {/* Third row: Description */}
                                    <motion.div
                                        className="text-xs text-neutral-900 opacity-80 line-clamp-1"
                                        whileHover={{ x: 2 }}
                                    >
                                        {service.description}
                                    </motion.div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    className="p-1.5 bg-colors-neutral-150 h-full items-center justify-center"
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                >
                                    <div className={"flex flex-col items-center justify-center gap-1 md:w-[240px] min-h-[65px] text-gray-400 md:h-[65px] text-sm"}/>
                                </motion.div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
