"use client"
import { IconPractice } from "@/src/components/icons/icon-practice"
import Image from "next/image";
import {PracticePlaceholder} from "@/src/components/practice-placeholder";
import {Feedback} from "@/src/types/feedback";

interface FeedbackItemProps {
  feedback: Feedback
  rating?: number
}

export function FeedbackItem({ feedback, rating = 203 }: FeedbackItemProps) {
  // Format date to "dd.MM.YY"
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp)
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear().toString().slice(-2)
    return `${day}.${month}.${year}`
  }

  return (
    <div className="flex-shrink-0 w-60 h-[90px] bg-white shadow-md rounded-sm p-1 flex gap-3">
      {/* Left column */}
      <div className="flex flex-col items-center justify-between">
        {/* PracticeIcon with rating */}
        <div className="flex items-center gap-1">
          <IconPractice width={16} height={14} />
          <span className="text-sm font-medium text-gray-900">{rating}</span>
        </div>

        {feedback.avatar ? (
            <Image
                src={feedback.avatar}
                alt={feedback.author}
                width={36}
                height={36}
                className="rounded-sm object-cover"
            />) : (<PracticePlaceholder width={36} height={36}/>)}

        {/* Date */}
        <span className="text-xs text-gray-500 pl-1">{formatDate(feedback.date)}</span>
      </div>

      {/* Right column */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Author name */}
        <span className="font-medium text-gray-900 text-sm truncate">{feedback.author}</span>

        {/* Feedback text with line-clamp-4 */}
        <p className="text-xs text-gray-700 leading-tight line-clamp-4 flex-1">{feedback.comment}</p>
      </div>
    </div>
  )
}
