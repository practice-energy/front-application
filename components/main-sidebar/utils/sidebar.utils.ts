export const ANIMATION_DURATION = 300
export const ANIMATION_TIMING = "cubic-bezier(0.4, 0, 0.2, 1)"

export const formatTime = (date: Date): string => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 1) return "только что"
  if (minutes < 60) return `${minutes}м назад`
  if (hours < 24) return `${hours}ч назад`
  if (days < 7) return `${days}д назад`

  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
  })
}

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}

export const getStatusColor = (status: string): string => {
  switch (status) {
    case "Ожидает":
      return "text-red-600 dark:text-red-400"
    case "Подтверждено":
      return "text-green-600 dark:text-green-400"
    case "Отменено":
      return "text-gray-600 dark:text-gray-400"
    default:
      return "text-gray-600 dark:text-gray-400"
  }
}
