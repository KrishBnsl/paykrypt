"use client"

import { useEffect, useState, useMemo } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { db } from "@/lib/db"

interface AccountSummaryProps {
  userId?: string
}

export function AccountSummary({ userId }: AccountSummaryProps) {
  const [data, setData] = useState<any[]>([])
  const [accounts, setAccounts] = useState<any[]>([])

  useEffect(() => {
    if (userId) {
      // Get the specified user
      const user = db.getUserById(userId)

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
    }
  }, [userId]) // Re-run when userId changes

  // Create a smarter Y-axis configuration based on data range
  const getYAxisConfig = useMemo(() => {
    if (!data.length) return { domain: [0, 100] };
    
    // Find min and max balance values (excluding 0)
    const balances = data.map(item => parseFloat(item.balance));
    const minBalance = Math.min(...balances.filter(b => b > 0));
    const maxBalance = Math.max(...balances);
    
    // Calculate appropriate min/max with padding
    const range = maxBalance - minBalance;
    
    // For small amounts (less than $1000), start closer to minimum
    if (maxBalance < 1000) {
      const min = Math.max(0, minBalance - (range * 0.1));
      const max = maxBalance + (range * 0.15);
      return {
        domain: [min, max],
        allowDecimals: true,
        tickCount: 5
      };
    } 
    // For medium amounts
    else if (maxBalance < 10000) {
      return {
        domain: [0, maxBalance * 1.15],
        allowDecimals: false,
        tickCount: 5
      };
    }
    // For large amounts
    else {
      return {
        domain: [0, maxBalance * 1.1],
        allowDecimals: false,
        tickCount: 5
      };
    }
  }, [data]);

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
              tickFormatter={(value) => {
                // Format based on the value size
                if (value >= 1000000) {
                  return `₹${(value / 1000000).toFixed(1)}M`;
                } else if (value >= 1000) {
                  return `₹${(value / 1000).toFixed(0)}K`;
                } else if (Number.isInteger(value)) {
                  return `₹${value}`;
                } else {
                  return `₹${value.toFixed(1)}`;
                }
              }}
              tickLine={false}
              axisLine={false}
              dx={-10}
              domain={getYAxisConfig.domain}
              allowDecimals={getYAxisConfig.allowDecimals}
              tickCount={getYAxisConfig.tickCount}
            />
            <Tooltip
              formatter={(value: number) => [`₹${Number(value).toLocaleString()}`, "Balance"]}
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
