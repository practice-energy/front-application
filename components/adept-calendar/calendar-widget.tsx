interface CalendarWidgetProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
  isCollapsible?: boolean
}

export function CalendarWidget({ selectedDate, onDateSelect, isCollapsible = false }: CalendarWidgetProps) {
  // Your component implementation here
}
