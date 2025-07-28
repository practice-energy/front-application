"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import {TimerReset} from "lucide-react"
import { RubleIcon } from "@/components/ui/ruble-sign"
import type { Service } from "@/types/common"
import {formatNumber} from "@/utils/format";
import {BurnEntityButton} from "@/components/burn-entity-button";
import {RepeatEntityButton} from "@/components/repeat-entity-button";
import {EditEntityButton} from "@/components/edit-entity-button";
import {IconPractice} from "@/components/icons/icon-practice";
import {PracticePlaceholder} from "@/components/practice-placeholder";
import { motion, AnimatePresence } from "framer-motion";

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

    const handleCardClick = () => {
        if (onClick) {
            onClick()
        } else {
            router.push(`/service/${service.id}`)
        }
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
                        <BurnEntityButton onClick={onBurn}/>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="md:w-[240px]"
            >
                <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full bg-white rounded-sm shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-gray-200 dark:hover:border-gray-600"
                    onClick={handleCardClick}
                >
                    {/* Image Container - 4:5 aspect ratio */}
                    <motion.div
                        className="relative w-full overflow-hidden"
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
                            />
                        ) : (
                            <PracticePlaceholder
                                width={240}
                                height={240}
                                className="w-full h-full object-cover bg-neutral-100 rounded-b-none"
                            />
                        )}
                    </motion.div>

                    {/* Content */}
                    {service.title !== "" ? (
                        <motion.div
                            className="px-1.5 pb-1.5 bg-colors-neutral-150 h-full"
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
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
                        >
                            <div className={"flex flex-col items-center justify-center gap-1"}>
                                <motion.div
                                    animate={{
                                        rotate: [0, 5, -5, 0],
                                        scale: [1, 1.1, 1.1, 1]
                                    }}
                                    transition={{
                                        duration: 0.6,
                                        repeat: Infinity,
                                        repeatDelay: 3
                                    }}
                                >
                                    <IconPractice width={36} height={36} className="mb-1 text-gray-400"/>
                                </motion.div>
                                <span className="text-xs text-gray-400">
                            Заполните карточку практис
                        </span>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </motion.div>
        </div>
    )
}