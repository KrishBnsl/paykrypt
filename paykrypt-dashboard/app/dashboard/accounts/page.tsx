"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, PlusCircle } from "lucide-react"
import UserSelector from "../user-selector"
import { db } from "@/lib/db"
import { useUser } from "@/contexts/user-context"

export default function AccountsPage() {
  const { currentUser, loading } = useUser()
  const [accounts, setAccounts] = useState<any[]>([])

  useEffect(() => {
    if (currentUser) {
      setAccounts(currentUser.accounts)
    }
  }, [currentUser])

  if (loading || !currentUser) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Accounts</h1>
        <UserSelector />
      </div>

      <div className="grid gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Your Accounts</h2>
          <Button size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Account
          </Button>
        </div>

        {accounts.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {accounts.map((account) => (
              <Card key={account.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{account.name}</CardTitle>
                  <CardDescription className="capitalize">{account.type.toLowerCase()} Account</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold">${account.balance.toFixed(2)}</div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CreditCard className="mr-1 h-4 w-4" />
                      {account.id.slice(-4)}
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" className="w-full">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-muted-foreground mb-4">You don't have any accounts yet.</p>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Your First Account
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
