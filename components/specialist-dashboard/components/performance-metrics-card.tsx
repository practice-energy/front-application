import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const metrics = [
  {
    label: "Рейтинг клиентов",
    value: 4.8,
    max: 5,
    percentage: 96,
  },
  {
    label: "Процент завершенных сессий",
    value: 94,
    max: 100,
    percentage: 94,
  },
  {
    label: "Повторные клиенты",
    value: 78,
    max: 100,
    percentage: 78,
  },
  {
    label: "Время отклика",
    value: 2.3,
    max: 24,
    percentage: 90,
  },
]

export function PerformanceMetricsCard() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Показатели эффективности</CardTitle>
        <CardDescription>Ваша производительность за последний месяц</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {metrics.map((metric, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{metric.label}</p>
                <p className="text-sm text-muted-foreground">
                  {metric.label === "Время отклика"
                    ? `${metric.value}ч`
                    : metric.label === "Рейтинг клиентов"
                      ? `${metric.value}/5`
                      : `${metric.value}%`}
                </p>
              </div>
              <Progress value={metric.percentage} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
