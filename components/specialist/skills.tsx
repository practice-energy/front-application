"use client"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import type { ProfileData } from "@/components/profile/types/common"
import { EnhancedInput } from "@/components/enhanced-input"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"
import { AddEntityButton } from "@/components/add-entity-button"
import { BurnEntityButton } from "../burn-entity-button"
import { motion, AnimatePresence } from "framer-motion"

interface SkillsProps {
    title: string
    items: string[]
    isEditMode: boolean
    onSkillChange: (index: number, value: string) => void
    onAddSkill: () => void
    onRemoveSkill: (index: number) => void
}

export function Skills({
                           title,
                           items,
                           isEditMode,
                           onSkillChange,
                           onAddSkill,
                           onRemoveSkill,
                       }: SkillsProps) {
    const isMobile = useIsMobile()

    if (!items || (items.length === 0 && !isEditMode)) return null

    return (
        <div className="flex flex-col">
            <div className="flex flex-row gap-2">
                <div
                    className={cn(
                        "font-semibold text-neutral-900 mb-4 line-clamp-1 leading-relaxed",
                        isMobile ? "text-mobilebase" : "text-base",
                    )}
                >
                    {title}
                </div>
                {isEditMode && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                    >
                        <AddEntityButton onClick={onAddSkill} />
                    </motion.div>
                )}
            </div>

            {isEditMode ? (
                <div className="space-y-3">
                    <AnimatePresence>
                        {items.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex-1">
                                        <EnhancedInput
                                            value={item}
                                            onChange={(e) => onSkillChange(index, e.target.value)}
                                            placeholder="..."
                                            className="w-full"
                                        />
                                    </div>
                                    <motion.div
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <BurnEntityButton
                                            onClick={() => onRemoveSkill(index)}
                                            className="mb-2 w-9 h-9"
                                            iconSize={24}
                                        />
                                    </motion.div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <ul className="space-y-2 ml-1">
                    <AnimatePresence>
                        {items.map((item, index) => (
                            <motion.li
                                key={index}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                                className="flex items-start gap-3"
                            >
                                <motion.div
                                    className="w-3 h-3 bg-violet-500 dark:bg-violet-600 rounded-sm mt-1.5 flex-shrink-0"
                                    whileHover={{ scale: 1.2 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                />
                                <span className="text-gray-700">{item}</span>
                            </motion.li>
                        ))}
                    </AnimatePresence>
                </ul>
            )}
        </div>
    )
}