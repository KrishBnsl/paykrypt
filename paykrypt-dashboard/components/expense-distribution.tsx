"use client"

import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { db } from "@/lib/db"

interface ExpenseDistributionProps {
  userId?: string
}

export function ExpenseDistribution({ userId }: ExpenseDistributionProps) {
  const [data, setData] = useState<any[]>([])
  const [totalSpent, setTotalSpent] = useState(0)

  useEffect(() => {
    if (userId) {
      // Get spending categories for this user
      const categories = db.getUserSpendingCategories(userId)

      // Get user's transactions
      const transactions = db.getTransactionsByUserId(userId)

      // Calculate total spending (outgoing transactions)
      const outgoingTransactions = transactions.filter((t) => t.senderId === userId && t.status !== "FLAGGED")

      const total = outgoingTransactions.reduce((sum, t) => sum + t.amount, 0)
      setTotalSpent(total)

      // Add real value to categories based on percentage
      const categoriesWithValue = categories.map((category) => ({
        ...category,
        value: (category.percentage / 100) * total,
      }))

      setData(categoriesWithValue)
    }
  }, [userId])

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#83A6ED", "#8DD1E1", "#A4DE6C"]

  const formatCurrency = (value: number) => {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2 h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), "Amount"]}
                contentStyle={{ borderRadius: "8px", border: "none" }}
              />
              <Legend formatter={(value) => <span className="text-sm">{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <h3 className="font-medium text-lg mb-2">Monthly Expenses</h3>
            <p className="text-3xl font-bold">{formatCurrency(totalSpent)}</p>
          </div>

          <div className="rounded-lg border p-4 space-y-4">
            <h3 className="font-medium text-lg">Expense Breakdown</h3>

            <div className="space-y-3">
              {data.map((category, index) => (
                <div key={category.id} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span
                        className="block w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      {category.name}
                    </span>
                    <span className="font-medium">{formatCurrency(category.value)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                    <div
                      className="h-1.5 rounded-full"
                      style={{
                        width: `${category.percentage}%`,
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="font-medium text-lg mb-2">Budget Tips</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-1">
                <span className="text-primary">•</span>
                <span>Housing costs should ideally be below 30% of income</span>
              </li>
              <li className="flex items-start gap-1">
                <span className="text-primary">•</span>
                <span>Consider reducing spending in your highest category</span>
              </li>
              <li className="flex items-start gap-1">
                <span className="text-primary">•</span>
                <span>Plan to save at least 15-20% of monthly income</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
