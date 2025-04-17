"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PieChart, Pie, ResponsiveContainer, Cell, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { AlertCircle, UserCog } from "lucide-react"
import { db, authService } from "@/lib/db"
import { useUser } from "@/contexts/user-context"

// Define the Transaction interface to match your data structure
interface Transaction {
  id: string
  senderId: string
  receiverId: string
  amount: number
  description: string
  category: string
  status: string
  riskScore: "LOW" | "MEDIUM" | "HIGH"
  createdAt: Date
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTransactions: 0,
    flaggedTransactions: 0,
    totalVolume: 0
  })
  const [riskData, setRiskData] = useState<any[]>([])
  const [categoryData, setCategoryData] = useState<any[]>([])
  const [userActivity, setUserActivity] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [users, setUsers] = useState<any[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string>("all")
  const { refreshUser } = useUser()

  // Add a color array for the charts
  const CATEGORY_COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

  useEffect(() => {
    // Fetch data on component mount
    const fetchData = () => {
      try {
        setIsLoading(true)
        
        // Safely get users
        const allUsers = typeof db.getUsers === 'function' 
          ? db.getUsers().filter(user => !user.isAdmin)
          : []
          
        setUsers(allUsers)
        
        const users = allUsers
        
        // Safely get transactions
        let transactions: Transaction[] = []
        if (typeof db.getAllTransactions === 'function') {
          transactions = db.getAllTransactions() as Transaction[];
        } else if (typeof db.getTransactions === 'function') {
          transactions = db.getTransactions() as Transaction[];
        }
        
        // Calculate statistics
        const flagged = transactions.filter(t => t.status === "FLAGGED").length
        const volume = transactions.reduce((sum, t) => sum + t.amount, 0)
        
        setStats({
          totalUsers: users.length,
          totalTransactions: transactions.length,
          flaggedTransactions: flagged,
          totalVolume: volume
        })
        
        // Calculate risk distribution
        const riskCounts = {
          LOW: transactions.filter(t => t.riskScore === "LOW").length,
          MEDIUM: transactions.filter(t => t.riskScore === "MEDIUM").length,
          HIGH: transactions.filter(t => t.riskScore === "HIGH").length,
        }
        
        setRiskData([
          { name: "Low Risk", value: riskCounts.LOW, color: "#4ade80" },
          { name: "Medium Risk", value: riskCounts.MEDIUM, color: "#facc15" },
          { name: "High Risk", value: riskCounts.HIGH, color: "#f87171" },
        ])
        
        // Calculate category distribution
        const categories = [...new Set(transactions.map(t => t.category))]
        const categoryCounts = categories.map(category => {
          return {
            name: category,
            value: transactions.filter(t => t.category === category).length,
          }
        }).sort((a, b) => b.value - a.value)
        
        setCategoryData(categoryCounts)
        
        // Calculate user activity
        const userActivity = users.map(user => {
          const userTransactions = transactions.filter(t => t.senderId === user.id || t.receiverId === user.id)
          const sent = transactions.filter(t => t.senderId === user.id).reduce((sum, t) => sum + t.amount, 0)
          const received = transactions.filter(t => t.receiverId === user.id).reduce((sum, t) => sum + t.amount, 0)
          
          return {
            name: `${user.firstName} ${user.lastName}`,
            transactions: userTransactions.length,
            sent,
            received,
          }
        }).sort((a, b) => b.transactions - a.transactions)
        
        setUserActivity(userActivity.slice(0, 5))
        setError(null)
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        setError("Failed to load dashboard data. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
    
    // Set interval to refresh data regularly
    const intervalId = setInterval(fetchData, 5000)
    return () => clearInterval(intervalId)
  }, [])
  
  // Handle user change
  const handleUserChange = (userId: string) => {
    setSelectedUserId(userId)
    
    // Update the current user in the auth service
    authService.setCurrentUser(userId)
    
    // Force refresh the user context to update all components
    if (refreshUser) {
      refreshUser()
      
      // Force a page reload to ensure all components update
      window.location.reload()
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 flex justify-center items-center h-screen">
        <div className="text-center text-destructive">
          <AlertCircle className="h-8 w-8 mx-auto mb-2" />
          <p>{error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        
        {/* User Selector */}
        <div className="flex items-center gap-2">
          <UserCog className="h-5 w-5 text-muted-foreground" />
          <Select value={selectedUserId} onValueChange={handleUserChange}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Select user to view/switch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">System Administrator</SelectItem>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTransactions}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flagged Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.flaggedTransactions}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalVolume.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Transaction Risk Distribution</CardTitle>
            <CardDescription>Overview of risk levels across all transactions</CardDescription>
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
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {riskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
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
            <CardDescription>Distribution of transactions by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryData.slice(0, 5)}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" name="Transaction Count">
                    {categoryData.slice(0, 5).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Top Users by Transaction Activity</CardTitle>
          <CardDescription>Users with the highest transaction counts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={userActivity}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sent" name="Sent" fill="#f87171" />
                <Bar dataKey="received" name="Received" fill="#4ade80">
                  {userActivity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
