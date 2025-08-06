"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, Play, Pause, Edit, MonitorPlayIcon as TvMinimalPlay, X, TimerReset } from 'lucide-react'
import { useState, useEffect } from "react"
import { Format } from "@/types/common"
import { Practice } from "@/types/service"
import { BurnEntityButton } from "@/components/burn-entity-button"
import { AddEntityButton } from "@/components/add-entity-button"
import { SaveEntityButton } from "@/components/save-entity-button"
import { ActivityStatus } from "@/components/ui/activity-status"
import { RubleIcon } from "@/components/ui/ruble-sign"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

// Utility functions for number formatting
const formatNumberWithCommas = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const parseFormattedNumber = (str: string): number => {
  return parseInt(str.replace(/,/g, '')) || 0;
};

interface ServiceFormatItemProps {
  format: Format
  practices: Practice[]
  totalPrice: number
  isActive: boolean
  isEditMode?: boolean
  onUpdate?: (data: {
    practices: Practice[]
    totalPrice: number
    enabled: boolean
  }) => void
  onEditToggle?: () => void
  onStatusToggle?: () => void
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

const scaleUp = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.2 } }
}

export function ServiceFormatItem({
                                    format,
                                    practices,
                                    totalPrice,
                                    isActive,
                                    isEditMode = false,
                                    onUpdate,
                                    onEditToggle,
                                    onStatusToggle
                                  }: ServiceFormatItemProps) {
  const [editedPractices, setEditedPractices] = useState<Practice[]>(
      practices.map(p => ({
        ...p,
        duration: p.slots * 30
      }))
  )
  const [editedTotalPrice, setEditedTotalPrice] = useState(totalPrice)
  const [formattedPrices, setFormattedPrices] = useState<Record<string, string>>(
      practices.reduce((acc, practice) => ({
        ...acc,
        [practice.id]: formatNumberWithCommas(practice.price)
      }), {})
  )

  useEffect(() => {
    if (!isEditMode) {
      setEditedPractices(practices.map(p => ({
        ...p,
        duration: p.slots * 30
      })))
      setEditedTotalPrice(totalPrice)
      setFormattedPrices(
          practices.reduce((acc, practice) => ({
            ...acc,
            [practice.id]: formatNumberWithCommas(practice.price)
          }), {})
      )
    }
  }, [isEditMode, practices, totalPrice])

  useEffect(() => {
    const newTotal = editedPractices.reduce((sum, practice) => sum + practice.price, 0)
    setEditedTotalPrice(newTotal)
  }, [editedPractices])

  const handleSave = () => {
    if (onUpdate) {
      onUpdate({
        practices: editedPractices,
        totalPrice: editedTotalPrice,
        enabled: isActive
      })
    }
    if (onEditToggle) {
      onEditToggle()
    }
  }

  const handlePracticeCountChange = (index: number, count: number) => {
    const newPractices = [...editedPractices]
    const newCount = Math.max(1, count)
    newPractices[index] = {
      ...newPractices[index],
      slots: newCount,
      duration: newCount * 30
    }
    setEditedPractices(newPractices)
  }

  const handlePracticePriceChange = (index: number, formattedValue: string) => {
    const newPractices = [...editedPractices]
    const practiceId = newPractices[index].id
    const numericValue = parseFormattedNumber(formattedValue)
    const limitedValue = Math.min(100000, Math.max(0, numericValue))

    newPractices[index] = {
      ...newPractices[index],
      price: limitedValue
    }

    setEditedPractices(newPractices)
    setFormattedPrices({
      ...formattedPrices,
      [practiceId]: formatNumberWithCommas(limitedValue)
    })
  }

  const addPractice = () => {
    const newId = `practice-${Date.now()}`
    const newPractice: Practice = {
      id: newId,
      slots: 1,
      duration: 30,
      price: 5000
    }
    
    const newPractices = [...editedPractices, newPractice]
    setEditedPractices(newPractices)
    setFormattedPrices({
      ...formattedPrices,
      [newId]: formatNumberWithCommas(5000)
    })
    
    // Если это первый практис и есть onUpdate, сразу обновляем данные
    if (practices.length === 0 && onUpdate) {
      onUpdate({
        practices: newPractices,
        totalPrice: 5000,
        enabled: isActive
      })
      
      // Автоматически переходим в режим редактирования
      if (onEditToggle) {
        onEditToggle()
      }
    }
  }

  const removePractice = () => {
    if (editedPractices.length > 1) {
      const newPractices = editedPractices.slice(0, -1)
      const removedId = editedPractices[editedPractices.length - 1].id
      const newFormattedPrices = {...formattedPrices}
      delete newFormattedPrices[removedId]

      setEditedPractices(newPractices)
      setFormattedPrices(newFormattedPrices)
    }
  }

  const formatLabel = format === "video" ? "Онлайн" : "Очно"

  // Empty practices state
  if (practices.length === 0) {
    return (
      <div className="flex items-center gap-2 flex-1 w-full">
        <AddEntityButton onClick={addPractice} />
        <div className="flex items-center gap-2 px-2 h-[36px] rounded-sm border border-gray-200 w-full">
          {format === "video" ? (
            <TvMinimalPlay size={20} className="text-neutral-700" />
          ) : (
            <Users size={20} className="text-neutral-700" />
          )}
          <span className="text-gray-700">{formatLabel}</span>
        </div>
      </div>
    )
  }

  return (
      <div className={cn(
          "space-y-2 flex gap-1.5",
          isEditMode ? "flex-row" : "flex-col",
      )}>
        <motion.div
            layout
            transition={{ duration: 0.2 }}
            className="w-full"
        >
          <Card className="py-2 px-1.5">
            <CardContent className="p-0">
              <div className={cn("flex")}>
                <div className={cn(
                    "flex",
                    isEditMode ? "flex-col" : "flex-row",
                )}>
                  {/* Заголовок формата */}
                  <div className="flex flex-col items-start gap-2 justify-start">
                    <div className="flex items-center gap-1 h-[36px] bg-violet-600 text-white px-3 rounded-sm text-sm">
                      {format === "video" ? (<TvMinimalPlay size={18} />) : (<Users size={18} />)}
                      {formatLabel}
                    </div>
                    {!isEditMode && (
                        <div className="text-[18px] ml-2 font-semibold items-center text-neutral-900">
                          {formatNumberWithCommas(totalPrice)}
                          <RubleIcon size={24} bold={false} />
                        </div>
                    )}
                  </div>

                  {/* Список практис */}
                  {isEditMode ? (
                      <div className="flex flex-col ml-1">
                        <AnimatePresence>
                          {editedPractices.map((practice, index) => (
                              <motion.div
                                  key={practice.id}
                                  initial="hidden"
                                  animate="visible"
                                  exit="exit"
                                  variants={itemVariants}
                                  className="flex flex-row items-center gap-2 rounded-sm"
                              >
                          <span className="text-sm font-medium min-w-[70px]">
                            {index + 1} практис
                          </span>

                                <input
                                    type="number"
                                    value={practice.slots}
                                    onChange={(e) => handlePracticeCountChange(index, parseInt(e.target.value) || 1)}
                                    className="focus:outline-none focus:ring-0 w-8 px-0.5 py-0.5 text-center border rounded text-sm appearance-none [-moz-appearance:_textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                                    min="1"
                                />

                                <div className="flex flex-row min-w-[90px] items-center">
                                  <X size={18}/>
                                  <div className="text-sm">30 минут</div>
                                </div>

                                <div className="flex items-center gap-1 bg-violet-600 text-white py-1 rounded-sm text-xs px-2 mr-2 w-[60px]">
                                  <TimerReset size={16} className="text-white" />
                                  <div>{practice.slots * 30}</div>
                                </div>

                                <div className="flex items-center py-1 ml-auto">
                                  <input
                                      type="text"
                                      value={formattedPrices[practice.id] || ''}
                                      onChange={(e) => handlePracticePriceChange(index, e.target.value)}
                                      className="text-end focus:outline-none focus:ring-0 px-1 py-0.5 w-16 border rounded text-sm"
                                  />
                                  <RubleIcon size={24} bold={false} />
                                </div>
                              </motion.div>
                          ))}
                        </AnimatePresence>

                        {/* Общая сумма в режиме редактирования */}
                        {practices.length > 0 && (
                            <div className="flex justify-end ml-auto mt-1">
                              <div className="flex items-center gap-1 bg-violet-600 text-white px-1 py-1 rounded-sm text-sm min-w-16 text-end">
                                <div className="text-end ml-auto">
                                  {formatNumberWithCommas(editedTotalPrice)}
                                </div>
                              </div>
                              <RubleIcon size={24} className="text-violet-600" bold={false}/>
                            </div>
                        )}
                      </div>
                  ) : (
                      <div className="flex flex-col px-3 gap-3">
                        {practices.map((practice, index) => (
                            <div key={practice.id} className="flex items-center flex-row gap-2 text-sm text-neutral-700 min-w-40">
                              <div>{`${practice.slots} практис по`}</div>
                              <div className="flex flex-row items-center gap-1 bg-violet-600 text-white px-1 py-1 rounded-sm text-xs">
                                <TimerReset size={16} className="text-white" />
                                <span>{practice.slots * 30}</span>
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
            </CardContent>
          </Card>
        </motion.div>

        {/* Кнопки редактирования */}
        {isEditMode && onUpdate && onEditToggle && (
            <motion.div
                initial="hidden"
                animate="visible"
                variants={scaleUp}
                className="flex flex-col gap-3"
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

        {/* Кнопки управления */}
        {!isEditMode && onStatusToggle && onEditToggle && (
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
      </div>
  )
}
