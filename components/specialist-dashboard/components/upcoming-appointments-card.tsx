import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const upcomingAppointments = [
  {
    time: "09:00",
    client: "Анна Петрова",
    service: "Консультация по питанию",
    status: "confirmed",
  },
  {
    time: "11:30",
    client: "Михаил Сидоров",
    service: "Персональная тренировка",
    status: "pending",
  },
  {
    time: "14:00",
    client: "Елена Козлова",
    service: "Массаж",
    status: "confirmed",
  },
  {
    time: "16:30",
    client: "Дмитрий Волков",
    service: "Йога-сессия",
    status: "confirmed",
  },
]

export function UpcomingAppointmentsCard() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Предстоящие записи</CardTitle>
        <CardDescription>У вас 4 записи на сегодня</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingAppointments.map((appointment, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="text-sm font-medium">{appointment.time}</div>
                <div>
                  <p className="text-sm font-medium">{appointment.client}</p>
                  <p className="text-sm text-muted-foreground">{appointment.service}</p>
                </div>
              </div>
              <Badge variant={appointment.status === "confirmed" ? "default" : "secondary"}>
                {appointment.status === "confirmed" ? "Подтверждено" : "Ожидает"}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
