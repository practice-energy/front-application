"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TvIcon as TvMinimalPlayIcon, Users, Play, Pause, Edit } from 'lucide-react'
import { useState, useEffect } from "react"
import { Format } from "@/types/common"
import { BurnEntityButton } from "@/components/burn-entity-button"
import { AddEntityButton } from "@/components/add-entity-button"
import { SaveEntityButton } from "@/components/save-entity-button"
import { ActivityStatus } from "@/components/ui/activity-status"
import { RubleIcon } from "@/components/ui/ruble-sign"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface PracticeItem {
  id: string
  count: number
  duration: number
  price: number
}

interface ServiceFormatItemProps {
  format: Format
  duration: number
  practices: PracticeItem[]
  totalPrice: number
  isActive: boolean
  isEditMode: boolean
  onUpdate: (data: {
    practices: PracticeItem[]
    totalPrice: number
    isActive: boolean
  }) => void
  onEditToggle: () => void
  onStatusToggle: () => void
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  },
  exit: { opacity: 0, y: -10 }
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } }
}

const scaleUp = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.2 } }
}

export function ServiceFormatItem({
  format,
  duration,
  practices,
  totalPrice,
  isActive,
  isEditMode,
  onUpdate,
  onEditToggle,
  onStatusToggle
}: ServiceFormatItemProps) {
  const [editedPractices, setEditedPractices] = useState<PracticeItem[]>(practices)
  const [editedTotalPrice, setEditedTotalPrice] = useState(totalPrice)

  useEffect(() => {
    if (!isEditMode) {
      setEditedPractices(practices)
      setEditedTotalPrice(totalPrice)
    }
  }, [isEditMode, practices, totalPrice])

  useEffect(() => {
    // Пересчитываем общую сумму при изменении практис
    const newTotal = editedPractices.reduce((sum, practice) => sum + (practice.price * practice.count), 0)
    setEditedTotalPrice(newTotal)
  }, [editedPractices])

  const handleSave = () => {
    onUpdate({
      practices: editedPractices,
      totalPrice: editedTotalPrice,
      isActive
    })
    onEditToggle()
  }

  const handlePracticeCountChange = (index: number, count: number) => {
    const newPractices = [...editedPractices]
    newPractices[index] = { ...newPractices[index], count: Math.max(1, count) }
    setEditedPractices(newPractices)
  }

  const handlePracticePriceChange = (index: number, price: number) => {
    const newPractices = [...editedPractices]
    newPractices[index] = { ...newPractices[index], price: Math.max(0, price) }
    setEditedPractices(newPractices)
  }

  const addPractice = () => {
    const newPractice: PracticeItem = {
      id: `practice-${Date.now()}`,
      count: 1,
      duration: duration,
      price: 5000
    }
    setEditedPractices([...editedPractices, newPractice])
  }

  const removePractice = () => {
    if (editedPractices.length > 1) {
      setEditedPractices(editedPractices.slice(0, -1))
    }
  }

  const formatIcon = format === "video" ? TvMinimalPlayIcon : Users
  const formatLabel = format === "video" ? "Онлайн" : "Очно"

  return (
    <div className="space-y-2 flex flex-row gap-2">
      <motion.div
        layout
        transition={{ duration: 0.2 }}
        className="w-full"
      >
        <Card className="p-3 w-full">
          <CardContent className="p-0">
            <div className="flex flex-row">
              <div className="flex-1">
                {/* Заголовок формата */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1 bg-violet-600 text-white px-3 py-1 rounded-sm text-sm">
                    {React.createElement(formatIcon, { size: 16 })}
                    {formatLabel}
                  </div>
                  {!isEditMode && (
                    <div className="text-2xl font-bold text-neutral-900">
                      {totalPrice.toLocaleString()} 
                      <RubleIcon size={32} bold={false} className="ml-1" />
                    </div>
                  )}
                </div>

                {/* Список практис */}
                {isEditMode ? (
                  <div className="space-y-2">
                    <AnimatePresence>
                      {editedPractices.map((practice, index) => (
                        <motion.div
                          key={practice.id}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          variants={itemVariants}
                          className="flex items-center gap-3 p-2 bg-gray-50 rounded-sm"
                        >
                          <span className="text-sm font-medium min-w-[80px]">
                            {index + 1} практис
                          </span>
                          {React.createElement(formatIcon, { size: 16, className: "text-violet-600" })}
                          
                          <input
                            type="number"
                            value={practice.count}
                            onChange={(e) => handlePracticeCountChange(index, parseInt(e.target.value) || 1)}
                            className="w-12 px-1 py-0.5 text-center border rounded text-sm"
                            min="1"
                          />
                          
                          <span className="text-sm">× {practice.duration} минут</span>
                          
                          <div className="flex items-center gap-1 bg-violet-600 text-white px-2 py-1 rounded-sm text-xs">
                            <span>{practice.duration}</span>
                          </div>
                          
                          <div className="flex items-center gap-1 ml-auto">
                            <input
                              type="number"
                              value={practice.price}
                              onChange={(e) => handlePracticePriceChange(index, parseInt(e.target.value) || 0)}
                              className="w-20 px-2 py-1 border rounded text-sm text-right"
                              min="0"
                            />
                            <RubleIcon size={16} />
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    
                    {/* Общая сумма в режиме редактирования */}
                    <div className="flex justify-end mt-3">
                      <div className="flex items-center gap-1 bg-violet-600 text-white px-3 py-2 rounded-sm font-bold">
                        {editedTotalPrice.toLocaleString()}
                        <RubleIcon size={20} className="text-white" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {practices.map((practice, index) => (
                      <div key={practice.id} className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{practice.count} практис по</span>
                        <div className="flex items-center gap-1 bg-violet-600 text-white px-2 py-1 rounded-sm text-xs">
                          <span>{practice.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Статус активности */}
              {!isEditMode && (
                <div className="ml-auto">
                  <ActivityStatus
                    status={isActive ? 'activePractice' : 'outOfPractice'}
                    showTitle={false}
                    className="items-start"
                  />
                </div>
              )}
            </div>

            {/* Кнопки управления */}
            {!isEditMode && (
              <div className="flex justify-end gap-2 mt-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onStatusToggle}
                  className="flex items-center justify-center w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-sm"
                >
                  {isActive ? <Pause size={16} /> : <Play size={16} />}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onEditToggle}
                  className="flex items-center justify-center w-8 h-8 bg-violet-600 hover:bg-violet-700 text-white rounded-sm"
                >
                  <Edit size={16} />
                </motion.button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Кнопки редактирования */}
      {isEditMode && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={scaleUp}
          className="flex flex-col justify-between gap-3"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <BurnEntityButton onClick={removePractice} className="w-8 h-8" iconClassName="w-6 h-6" />
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <AddEntityButton onClick={addPractice} className="w-8 h-8" iconClassName="w-6 h-6" />
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <SaveEntityButton onClick={handleSave} className="w-8 h-8" iconClassName="w-6 h-6" />
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
