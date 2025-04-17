"use client"

import { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function FraudDetectionOverview() {
  const [riskData, setRiskData] = useState<any[]>([])
  const [categoryData, setCategoryData] = useState<any[]>([])

  useEffect(() => {
    // Generate synthetic data for risk scores
    const generateRiskData = () => {
      return [
        { name: "Very Low", value: 65 },
        { name: "Low", value: 20 },
        { name: "Medium", value: 10 },
        { name: "High", value: 4 },
        { name: "Very High", value: 1 },
      ]
    }

    // Generate synthetic data for transaction categories
    const generateCategoryData = () => {
      return [
        { name: "Retail", transactions: 42, flagged: 2 },
        { name: "Dining", transactions: 28, flagged: 0 },
        { name: "Travel", transactions: 15, flagged: 3 },
        { name: "Services", transactions: 22, flagged: 1 },
        { name: "Entertainment", transactions: 18, flagged: 0 },
      ]
    }

    setRiskData(generateRiskData())
    setCategoryData(generateCategoryData())
  }, [])

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF0000"]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Transaction Risk Distribution</CardTitle>
            <CardDescription>AI-analyzed risk levels across your transactions</CardDescription>
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
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transactions by Category</CardTitle>
            <CardDescription>Distribution of transactions with flagged items</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="transactions" fill="#0088FE" name="Total Transactions" />
                  <Bar dataKey="flagged" fill="#FF0000" name="Flagged Transactions" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI Fraud Detection System</CardTitle>
          <CardDescription>How our advanced system protects your transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-lg border p-4">
                <h3 className="font-medium mb-2">Synthetic Data Generation</h3>
                <p className="text-sm text-muted-foreground">
                  Advanced diffusion models create realistic transaction data for training our AI system.
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="font-medium mb-2">CNN & LSTM Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Neural networks analyze spatial and temporal patterns to detect fraudulent behavior.
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="font-medium mb-2">Quantum-Secure Encryption</h3>
                <p className="text-sm text-muted-foreground">
                  Post-quantum encryption protects your data against future quantum computing threats.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
