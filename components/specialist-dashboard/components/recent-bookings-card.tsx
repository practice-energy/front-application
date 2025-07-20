import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const recentBookings = [
  {
    name: "Анна Петрова",
    email: "anna@example.com",
    amount: "+₽3,500",
    avatar: "/placeholder-user.jpg",
  },
  {
    name: "Михаил Сидоров",
    email: "mikhail@example.com",
    amount: "+₽2,800",
    avatar: "/placeholder-user.jpg",
  },
  {
    name: "Елена Козлова",
    email: "elena@example.com",
    amount: "+₽4,200",
    avatar: "/placeholder-user.jpg",
  },
  {
    name: "Дмитрий Волков",
    email: "dmitry@example.com",
    amount: "+₽1,900",
    avatar: "/placeholder-user.jpg",
  },
  {
    name: "Ольга Морозова",
    email: "olga@example.com",
    amount: "+₽3,100",
    avatar: "/placeholder-user.jpg",
  },
]

export function RecentBookingsCard() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Последние записи</CardTitle>
        <CardDescription>Вы получили 265 записей в этом месяце.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {recentBookings.map((booking, index) => (
            <div key={index} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src={booking.avatar || "/placeholder.svg"} alt="Avatar" />
                <AvatarFallback>
                  {booking.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{booking.name}</p>
                <p className="text-sm text-muted-foreground">{booking.email}</p>
              </div>
              <div className="ml-auto font-medium">{booking.amount}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
