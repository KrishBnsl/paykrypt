"use client"

import { useState, useEffect } from "react"
import { CheckCircle2, AlertCircle, Clock } from "lucide-react"
import { db } from "@/lib/db"

interface RecentTransactionsProps {
  userId?: string
  limit?: number
}

export function RecentTransactions({ userId, limit = 5 }: RecentTransactionsProps) {
  const [transactions, setTransactions] = useState<any[]>([])

  useEffect(() => {
    if (userId) {
      // Get user's transactions
      const userTransactions = db.getTransactionsByUserId(userId)

      // Sort by date (newest first) and limit
      const recentTransactions = [...userTransactions]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit)

      setTransactions(recentTransactions)
    }
  }, [userId, limit])

  // Format transaction for display
  const formatTransaction = (transaction: any, userId: string) => {
    // Determine if this is an incoming or outgoing transaction
    const isOutgoing = transaction.senderId === userId

    // Format amount accordingly
    const formattedAmount = isOutgoing ? -transaction.amount : transaction.amount

    // Get other party's name
    let otherParty = ""
    if (isOutgoing && transaction.receiverId) {
      const receiver = db.getUserById(transaction.receiverId)
      otherParty = receiver ? `${receiver.firstName} ${receiver.lastName}` : "Unknown"
    } else if (!isOutgoing) {
      const sender = db.getUserById(transaction.senderId)
      otherParty = sender ? `${sender.firstName} ${sender.lastName}` : "Unknown"
    } else {
      otherParty = transaction.description
    }

    return {
      ...transaction,
      displayAmount: formattedAmount,
      displayName: isOutgoing ? `To: ${otherParty}` : `From: ${otherParty}`,
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return "Today"
    } else if (diffDays === 1) {
      return "Yesterday"
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <div className="space-y-4">
      {userId &&
        transactions.map((transaction) => {
          const formattedTransaction = formatTransaction(transaction, userId)

          return (
            <div key={transaction.id} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-4">
                <div
                  className={`rounded-full p-2 ${
                    transaction.status === "FLAGGED"
                      ? "bg-destructive/10 text-destructive"
                      : transaction.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300"
                        : "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                  }`}
                >
                  {transaction.status === "FLAGGED" ? (
                    <AlertCircle className="h-4 w-4" />
                  ) : transaction.status === "PENDING" ? (
                    <Clock className="h-4 w-4" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{formattedTransaction.displayName}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(transaction.createdAt)}</p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`text-sm font-medium ${formattedTransaction.displayAmount > 0 ? "text-green-600 dark:text-green-400" : ""}`}
                >
                  {formattedTransaction.displayAmount > 0 ? "+" : ""}
                  {formattedTransaction.displayAmount.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </p>
                <p
                  className={`text-xs ${
                    transaction.riskScore === "HIGH"
                      ? "text-destructive"
                      : transaction.riskScore === "MEDIUM"
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-green-600 dark:text-green-400"
                  }`}
                >
                  {transaction.riskScore === "HIGH"
                    ? "High Risk"
                    : transaction.riskScore === "MEDIUM"
                      ? "Medium Risk"
                      : "Low Risk"}
                </p>
              </div>
            </div>
          )
        })}

      {transactions.length === 0 && (
        <div className="text-center py-4 text-muted-foreground">No recent transactions found.</div>
      )}
    </div>
  )
}
