"use client"

import { useState, useEffect } from "react"
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { db } from "@/lib/db"

interface TransactionHistoryProps {
  userId?: string
}

export function TransactionHistory({ userId }: TransactionHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState("all")
  const [riskFilter, setRiskFilter] = useState("all")
  const [transactions, setTransactions] = useState<any[]>([])

  useEffect(() => {
    if (userId) {
      // Get user's transactions
      const userTransactions = db.getTransactionsByUserId(userId)

      // Sort by date (newest first)
      const sortedTransactions = [...userTransactions].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )

      setTransactions(sortedTransactions)
    }
  }, [userId])

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

  // Filter and paginate transactions
  const filteredTransactions = transactions
    .filter((transaction) => {
      const formattedTransaction = formatTransaction(transaction, userId || "")

      const matchesSearch =
        formattedTransaction.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || transaction.status.toLowerCase() === statusFilter.toLowerCase()
      const matchesRisk = riskFilter === "all" || transaction.riskScore.toLowerCase() === riskFilter.toLowerCase()

      return matchesSearch && matchesStatus && matchesRisk
    })
    .map((transaction) => formatTransaction(transaction, userId || ""))

  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const paginatedTransactions = filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

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
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="flagged">Flagged</SelectItem>
            </SelectContent>
          </Select>
          <Select value={riskFilter} onValueChange={setRiskFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Risk" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Risks</SelectItem>
              <SelectItem value="low">Low Risk</SelectItem>
              <SelectItem value="medium">Medium Risk</SelectItem>
              <SelectItem value="high">High Risk</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Risk Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{transaction.displayName}</p>
                      <p className="text-sm text-muted-foreground">{transaction.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                  <TableCell className={transaction.displayAmount > 0 ? "text-green-600 dark:text-green-400" : ""}>
                    {transaction.displayAmount > 0 ? "+" : ""}
                    {transaction.displayAmount.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className={`rounded-full p-1 ${
                          transaction.status === "FLAGGED"
                            ? "bg-destructive/10 text-destructive"
                            : transaction.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300"
                              : "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                        }`}
                      >
                        {transaction.status === "FLAGGED" ? (
                          <AlertCircle className="h-3 w-3" />
                        ) : transaction.status === "PENDING" ? (
                          <Clock className="h-3 w-3" />
                        ) : (
                          <CheckCircle2 className="h-3 w-3" />
                        )}
                      </div>
                      <span className="text-sm capitalize">{transaction.status.toLowerCase()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        transaction.riskScore === "HIGH"
                          ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                          : transaction.riskScore === "MEDIUM"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                            : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      }`}
                    >
                      {transaction.riskScore.charAt(0).toUpperCase() + transaction.riskScore.slice(1).toLowerCase()}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {filteredTransactions.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length}{" "}
            transactions
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
