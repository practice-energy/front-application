"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Search, Plus, MessageSquare, ChevronDown, PanelRightOpen, GalleryHorizontalEnd } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/contexts/sidebar-context"
import Image from "next/image"
import { mockSidebarChats, groupChatsByTime, formatTimestamp } from "@/services/mock-data"
import { v4 as uuidv4 } from "uuid"
import type { Chat, ChatItem } from "@/types/chats"

// Animation constants
export const ANIMATION_DURATION = 200
export const ANIMATION_TIMING = "cubic-bezier(0.25, 0.46, 0.45, 0.94)"
