export const ANIMATION_DURATION = 300
export const ANIMATION_TIMING = "cubic-bezier(0.4, 0, 0.2, 1)"

export const SIDEBAR_WIDTH = {
  COLLAPSED: 0,
  EXPANDED: 384, // w-96 = 384px
  MOBILE: "100%",
}

export const formatLastMessageTime = (date: Date): string => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 1) return "Только что"
  if (minutes < 60) return `${minutes} мин назад`
  if (hours < 24) return `${hours} ч назад`
  if (days < 7) return `${days} дн назад`

  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
  })
}

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}
