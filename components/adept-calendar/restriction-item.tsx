"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type {Interval, Restriction} from "@/types/calendar-event"
import {TvMinimalPlayIcon, User, Video} from "lucide-react"
import { useState, useEffect } from "react"
import {Format} from "@/types/common";
import {IconPractice} from "@/components/icons/icon-practice";
import {BurnEntityButton} from "@/components/burn-entity-button";
import {AddEntityButton} from "@/components/add-entity-button";
import {SaveEntityButton} from "@/components/save-entity-button";
import {ActivityStatus} from "@/components/ui/activity-status";
import {IconAlura} from "@/components/icons/icon-alura";
import {cn} from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion"; // Импортируем анимации

interface RestrictionItemProps {
  restriction: Restriction
  onUpdate: (restriction: Restriction) => void
  showDate?: boolean
  date?: string
  isEditMode: boolean
  onEditToggle: () => void
  onDelete?: () => void
}

// Анимации
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  },
  exit: { opacity: 0, y: -10 }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } }
};

const scaleUp = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.2 } }
};

export function RestrictionItem({
                                  restriction,
                                  onUpdate,
                                  showDate,
                                  date,
                                  isEditMode,
                                  onEditToggle,
                                  onDelete
                                }: RestrictionItemProps) {
  const [editedIntervals, setEditedIntervals] = useState<Interval[]>(restriction.intervals)
  const [editedFormats, setEditedFormats] = useState<Format[][]>(restriction.intervals.map(interval => interval.formats || []))
  const [intervalCount, setIntervalCount] = useState(restriction.intervals.length)

// В обработчике
  const togglePracticeStatus = () => {
    // Обновляем только isPractice, не трогая другие изменения
    const updatedRestriction = {
      ...restriction,
      isPractice: !restriction.isPractice
    };

    onUpdate(updatedRestriction);

    // Не вызываем handleSave, чтобы не сбрасывать режим редактирования
    // Но нужно убедиться, что родительский компонент не сбрасывает isEditMode
  }

  useEffect(() => {
    if (!restriction.intervals || restriction.intervals.length === 0) {
      const defaultInterval = { start: '09:00', end: '17:00', formats: [] }
      setEditedIntervals([defaultInterval])
      setEditedFormats([[]])
      setIntervalCount(1)

      onUpdate({
        ...restriction,
        intervals: [defaultInterval]
      })
    } else {
      setEditedIntervals(restriction.intervals)
      setEditedFormats(restriction.intervals.map(interval => interval.formats || []))
      setIntervalCount(restriction.intervals.length)
    }
  }, [restriction])

  useEffect(() => {
    if (!isEditMode) {
      setEditedIntervals(restriction.intervals)
      setEditedFormats(restriction.intervals.map(interval => interval.formats || []))
      setIntervalCount(restriction.intervals.length)
    }
  }, [isEditMode, restriction])

  const handleSave = () => {
    const updatedRestriction = {
      ...restriction,
      intervals: editedIntervals.slice(0, intervalCount).map((interval, i) => ({
        ...interval,
        formats: editedFormats[i] || [],
        isPractice: restriction.isPractice,
      }))
    }
    onUpdate(updatedRestriction)
  }

  const handleTimeChange = (intervalIndex: number, field: 'start' | 'end', value: string) => {
    const newIntervals = [...editedIntervals]
    newIntervals[intervalIndex] = {
      ...newIntervals[intervalIndex],
      [field]: value
    }
    setEditedIntervals(newIntervals)
  }

  const toggleFormat = (intervalIndex: number, format: Format) => {
    const newFormats = [...editedFormats]
    const currentFormats = newFormats[intervalIndex] || []

    if (currentFormats.includes(format)) {
      newFormats[intervalIndex] = currentFormats.filter(f => f !== format)
    } else if (currentFormats.length < 2) {
      newFormats[intervalIndex] = [...currentFormats, format]
    }

    setEditedFormats(newFormats)
  }

  const addInterval = () => {
    if (intervalCount < 3) {
      setIntervalCount(prev => prev + 1)
      if (editedIntervals.length < intervalCount + 1) {
        setEditedIntervals([...editedIntervals, { start: '09:00', end: '17:00', formats: [] }])
        setEditedFormats([...editedFormats, []])
      }
    }
  }

  const removeInterval = () => {
    if (intervalCount > 1) {
      setIntervalCount(prev => prev - 1)
    }
  }

  const renderTimeDisplay = (time: string) => (
      <span className="text-sm font-medium border rounded-sm border-gray-200 px-1 py-0.5 w-[60px] items-center justify-center text-center">{time}</span>
  )

  const renderTimeInput = (value: string, onChange: (val: string) => void) => (
      <input
          type="time"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="
        appearance-none text-sm border rounded-sm
        hover:border-gray-100 active:border-gray-100 active:ring-0
        focus:outline-none focus:ring-0
        focus:border-violet-600 px-2 w-[60px]
        [&::-webkit-calendar-picker-indicator]:hidden
        [&::-webkit-clear-button]:hidden
        [&::-webkit-inner-spin-button]:hidden
        [&::-webkit-datetime-edit-ampm-field]:hidden
        [&::-webkit-datetime-edit-hour-field]:appearance-none
        [&::-webkit-datetime-edit-minute-field]:appearance-none
      "
      />
  )

  return (
      <>
        {showDate && date && (
            <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                className="flex justify-between items-center"
            >
              <div className="text-base font-semibold text-neutral-900">{date}</div>
            </motion.div>
        )}

        <div className="space-y-2 flex flex-row gap-2">
          <motion.div
              layout // Анимация изменения layout
              transition={{ duration: 0.2 }}
              className={cn("w-full")}
          >
            <Card className="p-2 w-full">
              <CardContent className="p-0">
                <div className="flex flex-row">
                  <div className="space-y-4">
                    <div className={cn(
                        "flex items-start w-full",
                        !isEditMode && "gap-4"
                    )}>
                      <AnimatePresence>
                        {Array.from({ length: intervalCount }).map((_, i) => {
                          const interval = editedIntervals[i] || { start: '09:00', end: '17:00', formats: [] }
                          return (
                              <motion.div
                                  key={`interval-${i}`}
                                  initial="hidden"
                                  animate="visible"
                                  exit="exit"
                                  variants={itemVariants}
                                  layout // Анимация изменения layout
                                  transition={{ duration: 0.2 }}
                                  className="flex flex-row justify-center items-center"
                              >
                                {i > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                        className={cn(
                                            "w-10 h-full mt-2 flex",
                                            !isEditMode && "pr-4"
                                        )}
                                    >
                                      <IconAlura
                                          width={18}
                                          height={18}
                                          className={cn(
                                              "mx-auto mb-8 w-6 justify-center",
                                          )}
                                      />
                                    </motion.div>
                                )}
                                <div className="flex flex-col items-center gap-2">
                                  <motion.div
                                      className="flex flex-col items-center gap-1"
                                      whileHover={{ scale: 1.02 }}
                                      transition={{ duration: 0.1 }}
                                  >
                                    {isEditMode ? (
                                        <>
                                          {renderTimeInput(interval.start, (val) => handleTimeChange(i, 'start', val))}
                                          <motion.div
                                              className="h-4 w-px bg-gray-300 my-1"
                                              initial={{ scaleY: 0 }}
                                              animate={{ scaleY: 1 }}
                                              transition={{ duration: 0.2 }}
                                          />
                                          {renderTimeInput(interval.end, (val) => handleTimeChange(i, 'end', val))}
                                        </>
                                    ) : (
                                        <>
                                          {renderTimeDisplay(interval.start)}
                                          <motion.div
                                              className="h-4 w-px bg-gray-300 my-1"
                                              initial={{ scaleY: 0 }}
                                              animate={{ scaleY: 1 }}
                                              transition={{ duration: 0.2 }}
                                          />
                                          {renderTimeDisplay(interval.end)}
                                        </>
                                    )}
                                  </motion.div>

                                  <motion.div
                                      className="flex gap-2 justify-between mx-auto"
                                      variants={scaleUp}
                                  >
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={cn(
                                            "p-1 items-center justify-center rounded-sm",
                                            isEditMode && editedFormats[i]?.includes('video') && "bg-violet-600 hover:bg-violet-700 text-white",
                                            isEditMode && !editedFormats[i]?.includes('video') && "text-violet-600 hover:text-violet-700 md:hover:bg-violet-50",
                                        )}
                                        onClick={isEditMode ? () => toggleFormat(i, 'video') : undefined}
                                        disabled={!isEditMode}
                                    >
                                      <TvMinimalPlayIcon className={cn(
                                          "w-[18px] h-[18px]",
                                          !(isEditMode || editedFormats[i]?.includes('video')) && "opacity-0",
                                      )}/>
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={cn(
                                            "p-1 items-center justify-center rounded-sm",
                                            isEditMode && editedFormats[i]?.includes('in-person') && "bg-violet-600 hover:bg-violet-700 text-white",
                                            isEditMode && !editedFormats[i]?.includes('in-person') && "text-violet-600 hover:text-violet-700 md:hover:bg-violet-50",
                                        )}
                                        onClick={isEditMode ? () => toggleFormat(i, 'in-person') : undefined}
                                        disabled={!isEditMode}
                                    >
                                      <User className={cn(
                                          "w-[18px] h-[18px]",
                                          !(isEditMode || editedFormats[i]?.includes('in-person')) && "opacity-0",
                                      )}/>
                                    </motion.button>
                                  </motion.div>
                                </div>
                              </motion.div>
                          )
                        })}
                      </AnimatePresence>
                    </div>
                  </div>

                  <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={fadeIn}
                      onClick={togglePracticeStatus}
                      className={cn(
                          "cursor-pointer ml-auto",
                          isEditMode && "hover:opacity-80 transition-opacity"
                      )}
                      disabled={!isEditMode}
                  >
                    <ActivityStatus
                        status={restriction.isPractice ? 'activePractice' : 'outOfPractice'}
                        showTitle={intervalCount < 2}
                        className="ml-auto items-start"
                    />
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {isEditMode && (
              <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={scaleUp}
                  className="flex flex-col justify-between gap-2 my-6 mb-4"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <BurnEntityButton onClick={removeInterval}/>
                </motion.div>
                {intervalCount < 3 && (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <AddEntityButton onClick={addInterval}/>
                    </motion.div>
                )}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <SaveEntityButton onClick={handleSave}/>
                </motion.div>
              </motion.div>
          )}
        </div>
      </>
  )
}
