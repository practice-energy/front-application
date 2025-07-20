import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  { name: "Янв", total: 15000 },
  { name: "Фев", total: 18000 },
  { name: "Мар", total: 22000 },
  { name: "Апр", total: 19000 },
  { name: "Май", total: 25000 },
  { name: "Июн", total: 28000 },
]

export function RevenueChartCard() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Доходы</CardTitle>
        <CardDescription>Ваши доходы за последние 6 месяцев</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₽${value}`}
            />
            <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
