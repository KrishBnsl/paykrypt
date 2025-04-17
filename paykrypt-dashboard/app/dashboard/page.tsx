"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AccountSummary } from "@/components/account-summary"
import { RecentTransactions } from "@/components/recent-transactions"
import { FraudDetectionOverview } from "@/components/fraud-detection-overview"
import { SecurityStatus } from "@/components/security-status"
import { ExpenseDistribution } from "@/components/expense-distribution"
import UserSelector from "./user-selector"
import { db } from "@/lib/db"
import { useUser } from "@/contexts/user-context"

export default function DashboardPage() {
  const { currentUser, loading } = useUser()
  const [transactions, setTransactions] = useState<any[]>([])

  useEffect(() => {
    if (currentUser) {
      // Get user's transactions
      const userTransactions = db.getTransactionsByUserId(currentUser.id)
      setTransactions(userTransactions)
    }
  }, [currentUser])

  if (loading || !currentUser) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <UserSelector />
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${currentUser.balance.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">{currentUser.accounts.length} active accounts</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  $
                  {transactions
                    .filter((t) => t.status === "PENDING" && t.senderId === currentUser.id)
                    .reduce((sum, t) => sum + t.amount, 0)
                    .toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {transactions.filter((t) => t.status === "PENDING" && t.senderId === currentUser.id).length} pending
                  transactions
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Low</div>
                <p className="text-xs text-muted-foreground">No suspicious activity detected</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Security Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Protected</div>
                <p className="text-xs text-muted-foreground">Quantum-secure encryption active</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Account Summary</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <AccountSummary userId={currentUser.id} />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your recent transaction history with AI-powered fraud detection</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentTransactions userId={currentUser.id} limit={5} />
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Expense Distribution</CardTitle>
              <CardDescription>Breakdown of your spending across different categories</CardDescription>
            </CardHeader>
            <CardContent>
              <ExpenseDistribution userId={currentUser.id} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Fraud Detection Overview</CardTitle>
              <CardDescription>AI-powered analysis of your transaction patterns</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <FraudDetectionOverview userId={currentUser.id} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="security" className="space-y-4">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Security Status</CardTitle>
              <CardDescription>Overview of your account security and quantum-secure encryption</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <SecurityStatus userId={currentUser.id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
