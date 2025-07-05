"use client"

import { useCallback, useRef } from "react"

interface UseDoubleTapOptions {
  onDoubleTap: () => void
  delay?: number
}

export function useDoubleTap({ onDoubleTap, delay = 300 }: UseDoubleTapOptions) {
  const lastTapRef = useRef<number>(0)

  const handleTap = useCallback(() => {
    const now = Date.now()
    const timeSinceLastTap = now - lastTapRef.current

    if (timeSinceLastTap < delay && timeSinceLastTap > 0) {
      onDoubleTap()
    }

    lastTapRef.current = now
  }, [onDoubleTap, delay])

  return handleTap
}
