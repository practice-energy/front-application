"use client"
import { Label } from "@/components/ui/label"

interface Service {
  name: string
  duration: string
  price: number
}

interface ServicesSelectionProps {
  services: Service[]
  selectedService: Service | null
  onServiceSelect: (service: Service) => void
  title?: string
}

export function ServicesSelection({
  services,
  selectedService,
  onServiceSelect,
  title = "Service Type",
}: ServicesSelectionProps) {
  const serviceColors = ["purple", "blue", "green", "amber", "red", "indigo"]

  return (
    <div className="space-y-3">
      <Label className="text-lg font-semibold text-foreground">{title}</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {services.map((service, index) => {
          const color = serviceColors[index % serviceColors.length]
          return (
            <button
              key={service.name}
              type="button"
              onClick={() => onServiceSelect(service)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                selectedService?.name === service.name
                  ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 bg-${color}-500 rounded-full`}></div>
                <div>
                  <p className="font-medium">{service.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {service.duration} • {service.price} Centi
                  </p>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
