"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts"
import { db } from "@/lib/db"

export function AdminMetrics() {
  const [users, setUsers] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [risksData, setRisksData] = useState<any[]>([])
  const [categoryData, setCategoryData] = useState<any[]>([])
  const [userActivityData, setUserActivityData] = useState<any[]>([])

  useEffect(() => {
    // Fetch data
    const fetchData = () => {
      const allUsers = db.getUsers().filter(user => !user.isAdmin)
      const allTransactions = db.getAllTransactions()
      
      setUsers(allUsers)
      setTransactions(allTransactions)
      
      // Process risk distribution data
      const riskCounts = {
        LOW: allTransactions.filter(t => t.riskScore === "LOW").length,
        MEDIUM: allTransactions.filter(t => t.riskScore === "MEDIUM").length,
        HIGH: allTransactions.filter(t => t.riskScore === "HIGH").length,
      }
      
      setRisksData([
        { name: "Low Risk", value: riskCounts.LOW, fill: "#4ade80" },
        { name: "Medium Risk", value: riskCounts.MEDIUM, fill: "#facc15" },
        { name: "High Risk", value: riskCounts.HIGH, fill: "#f87171" },
      ])
      
      // Process category data
      const categories = [...new Set(allTransactions.map(t => t.category))]
      const categoryStats = categories.map(category => {
        const categoryTransactions = allTransactions.filter(t => t.category === category)
        return {
          name: category,
          count: categoryTransactions.length,
          value: categoryTransactions.reduce((sum, t) => sum + t.amount, 0)
        }
      })
      
      setCategoryData(categoryStats.sort((a, b) => b.value - a.value).slice(0, 6))
      
      // Process user activity data
      const userActivity = allUsers.map(user => {
        const userTransactions = allTransactions.filter(
          t => t.senderId === user.id || t.receiverId === user.id
        )
        
        return {
          name: `${user.firstName} ${user.lastName}`,
          transactions: userTransactions.length,
          flagged: userTransactions.filter(t => t.status === "FLAGGED").length,
        }
      })
      
      setUserActivityData(userActivity.sort((a, b) => b.transactions - a.transactions))
    }
    
    fetchData()
    
    // Setup an interval to refresh data
    const intervalId = setInterval(fetchData, 5000)
    return () => clearInterval(intervalId)
  }, [])
  
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FC8181", "#9F7AEA"]
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flagged Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.filter(t => t.status === "FLAGGED").length}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Transaction Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={risksData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {risksData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
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
            <CardTitle>Top Transaction Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" />
                  <YAxis
                    tickFormatter={(value) => {
                      if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`
                      return `$${value}`
                    }}
                  />
                  <Tooltip 
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, "Amount"]} 
                  />
                  <Bar dataKey="value" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>User Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={userActivityData}
                layout="vertical"
                margin={{
                  top: 5,
                  right: 30,
                  left: 60,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" />
                <Tooltip />
                <Legend />
                <Bar dataKey="transactions" name="Total Transactions" fill="#0088FE" />
                <Bar dataKey="flagged" name="Flagged Transactions" fill="#FF0000" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
