"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { authService, db } from "@/lib/db"

interface AccountSummaryProps {
  userId?: string
}

export function AccountSummary({ userId }: AccountSummaryProps) {
  const [data, setData] = useState<any[]>([])
  const [accounts, setAccounts] = useState<any[]>([])

  useEffect(() => {
    // Get the current user or the specified user
    const user = userId ? db.getUserById(userId) : authService.getCurrentUser()

    if (user) {
      setAccounts(user.accounts)

      // Generate synthetic data for the chart
      const generateData = () => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const currentMonth = new Date().getMonth()

        return Array.from({ length: 12 }, (_, i) => {
          const monthIndex = (currentMonth - 11 + i) % 12
          const month = months[monthIndex >= 0 ? monthIndex : monthIndex + 12]

          // Generate a somewhat realistic balance progression
          const baseValue = user.balance * 0.8 // Start at 80% of current balance
          const trend = i * (user.balance * 0.02) // Upward trend
          const seasonality = Math.sin((i / 12) * Math.PI * 2) * (user.balance * 0.05) // Seasonal pattern
          const noise = (Math.random() - 0.5) * (user.balance * 0.04) // Random fluctuations

          return {
            name: month,
            balance: Math.max(baseValue + trend + seasonality + noise, 0).toFixed(2),
          }
        })
      }

      setData(generateData())
    }
  }, [userId])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((account) => (
          <div key={account.id} className="rounded-lg border p-4">
            <h3 className="font-medium">{account.name}</h3>
            <p className="text-sm text-muted-foreground capitalize">{account.type.toLowerCase()}</p>
            <p className="text-xl font-bold mt-2">${account.balance.toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: 10,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} dy={10} />
            <YAxis
              tickFormatter={(value) => `$${Number(value).toLocaleString()}`}
              tickLine={false}
              axisLine={false}
              dx={-10}
            />
            <Tooltip
              formatter={(value: number) => [`$${Number(value).toLocaleString()}`, "Balance"]}
              labelFormatter={(label) => `Month: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
