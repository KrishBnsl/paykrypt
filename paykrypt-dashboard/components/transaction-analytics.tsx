"use client"

import { useEffect, useState } from "react"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/lib/db"

interface TransactionAnalyticsProps {
  userId?: string
}

export function TransactionAnalytics({ userId }: TransactionAnalyticsProps) {
  const [monthlyData, setMonthlyData] = useState<any[]>([])
  const [categoryData, setCategoryData] = useState<any[]>([])
  const [riskData, setRiskData] = useState<any[]>([])

  useEffect(() => {
    if (userId) {
      // Get user's transactions
      const transactions = db.getTransactionsByUserId(userId)

      // Generate monthly transaction data
      const generateMonthlyData = () => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const currentMonth = new Date().getMonth()

        // Initialize data for all months
        const monthlyTransactions = Array.from({ length: 12 }, (_, i) => {
          const monthIndex = (currentMonth - 11 + i) % 12
          const month = months[monthIndex >= 0 ? monthIndex : monthIndex + 12]

          return {
            name: month,
            total: 0,
            flagged: 0,
          }
        })

        // Fill in with real transaction counts
        transactions.forEach((transaction) => {
          const date = new Date(transaction.createdAt)
          const monthIndex = (date.getMonth() - currentMonth + 12) % 12

          if (monthIndex < 12) {
            monthlyTransactions[monthIndex].total += 1

            if (transaction.status === "FLAGGED") {
              monthlyTransactions[monthIndex].flagged += 1
            }
          }
        })

        return monthlyTransactions
      }

      // Generate spending categories data
      const generateCategoryData = () => {
        // Get unique categories
        const categories = [...new Set(transactions.map((t) => t.category))]

        // Count transactions per category
        return categories
          .map((category) => {
            const count = transactions.filter((t) => t.category === category).length
            return {
              name: category,
              value: count,
            }
          })
          .sort((a, b) => b.value - a.value)
      }

      // Generate risk distribution data
      const generateRiskData = () => {
        const riskCounts = {
          LOW: 0,
          MEDIUM: 0,
          HIGH: 0,
        }

        transactions.forEach((transaction) => {
          riskCounts[transaction.riskScore as keyof typeof riskCounts] += 1
        })

        return [
          { name: "Low Risk", value: riskCounts.LOW },
          { name: "Medium Risk", value: riskCounts.MEDIUM },
          { name: "High Risk", value: riskCounts.HIGH },
        ]
      }

      setMonthlyData(generateMonthlyData())
      setCategoryData(generateCategoryData())
      setRiskData(generateRiskData())
    }
  }, [userId])

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]
  const RISK_COLORS = ["#00C49F", "#FFBB28", "#FF0000"]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Monthly Transaction Activity</CardTitle>
          <CardDescription>Total transactions and flagged items by month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlyData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="total"
                  stackId="1"
                  stroke="#8884d8"
                  fill="#8884d8"
                  name="Total Transactions"
                />
                <Area
                  type="monotone"
                  dataKey="flagged"
                  stackId="2"
                  stroke="#FF0000"
                  fill="#FF0000"
                  name="Flagged Transactions"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Transactions by Category</CardTitle>
            <CardDescription>Distribution of transactions across categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} transactions`, "Count"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transaction Risk Analysis</CardTitle>
            <CardDescription>AI-powered risk assessment of your transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {riskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={RISK_COLORS[index % RISK_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} transactions`, "Count"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
