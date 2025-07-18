"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useSidebar } from "@/contexts/sidebar-context"
import { cn } from "@/lib/utils"
import { v4 as uuidv4 } from "uuid"
import {Repeat2} from "lucide-react";

export function ChatNewButton() {
  const router = useRouter()
  const { isCollapsed } = useSidebar()

  const handleNewChat = () => {
    router.push(`/search/${uuidv4()}`)
  }

  return (
    <div
      className={cn(
        "fixed z-10 transition-all duration-300",
        "top-[5.5rem] left-20",
        "md:top-40 md:left-20",
        isCollapsed ? "left-4" : "left-6",
      )}
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleNewChat}
        className={cn(
          "flex items-center gap-2 px-3 py-2",
          "bg-white dark:bg-gray-800",
          "border border-gray-200 dark:border-gray-700",
          "shadow-sm hover:shadow-md hover:bg-violet-50",
          "transition-all duration-200",
          "text-gray-700 dark:text-gray-300",
          "text-sm md:text-base",
          "rounded-sm",
        )}
        title="New chat"
        aria-label="New chat"
      >
        <Repeat2 className="w-4 h-4 rounded-sm" />
      </motion.button>
    </div>
  )
}
