"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TransactionHistory } from "@/components/transaction-history"
import { TransactionAnalytics } from "@/components/transaction-analytics"
import UserSelector from "../user-selector"
import { useUser } from "@/contexts/user-context"

export default function TransactionsPage() {
  const { currentUser, loading } = useUser()

  if (loading || !currentUser) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <UserSelector />
      </div>

      <Tabs defaultValue="history" className="space-y-4">
        <TabsList>
          <TabsTrigger value="history">Transaction History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>View your recent transactions with AI-powered fraud detection insights</CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionHistory userId={currentUser.id} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Analytics</CardTitle>
              <CardDescription>AI-powered analysis of your spending patterns and fraud detection</CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionAnalytics userId={currentUser.id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
