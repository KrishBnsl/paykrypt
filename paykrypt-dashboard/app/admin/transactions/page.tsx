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
  UserCog
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { db } from "@/lib/db"
import { authService } from "@/lib/db"
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

export default function AdminTransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState("all")
  const [riskFilter, setRiskFilter] = useState("all")
  const [transactions, setTransactions] = useState<any[]>([])
  const [userMap, setUserMap] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [users, setUsers] = useState<any[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string>("all")
  const { refreshUser } = useUser()

  useEffect(() => {
    // Fetch data on component mount
    const fetchData = () => {
      try {
        setIsLoading(true)
        
        // Get all transactions
        let allTransactions: Transaction[] = []
        if (typeof db.getAllTransactions === 'function') {
          allTransactions = db.getAllTransactions() as Transaction[];
        } else if (typeof db.getTransactions === 'function') {
          allTransactions = db.getTransactions() as Transaction[];
        } else {
          console.warn("No transaction fetching method found on db object")
          allTransactions = []
        }
        
        // Sort by date (newest first)
        const sortedTransactions = [...allTransactions].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        
        setTransactions(sortedTransactions)
        
        // Create a map of users for quick lookup
        const users = db.getUsers ? db.getUsers() : []
        const usersById: Record<string, any> = {}
        users.forEach(user => {
          usersById[user.id] = user
        })
        
        setUserMap(usersById)
        setUsers(users.filter(user => !user.isAdmin))
        setError(null)
      } catch (err) {
        console.error("Error fetching transaction data:", err)
        setError("Failed to load transaction data. Please try again.")
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

  // Format transaction for display
  const formatTransaction = (transaction: any) => {
    const sender = userMap[transaction.senderId]
    const receiver = userMap[transaction.receiverId]
    
    const senderName = sender ? `${sender.firstName} ${sender.lastName}` : "Unknown"
    const receiverName = receiver ? `${receiver.firstName} ${receiver.lastName}` : "Unknown"
    
    return {
      ...transaction,
      senderName,
      receiverName,
    }
  }

  // Filter transactions based on search, filters, and selected user
  const filteredTransactions = transactions.filter((transaction) => {
    const sender = userMap[transaction.senderId]
    const receiver = userMap[transaction.receiverId]
    const senderName = sender ? `${sender.firstName} ${sender.lastName}` : "Unknown"
    const receiverName = receiver ? `${receiver.firstName} ${receiver.lastName}` : "Unknown"
    
    const matchesSearch =
      senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receiverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
      
    const matchesStatus = statusFilter === "all" || transaction.status.toLowerCase() === statusFilter.toLowerCase()
    const matchesRisk = riskFilter === "all" || transaction.riskScore.toLowerCase() === riskFilter.toLowerCase()
    const matchesUser = selectedUserId === "all" || 
                       transaction.senderId === selectedUserId || 
                       transaction.receiverId === selectedUserId
    
    return matchesSearch && matchesStatus && matchesRisk && matchesUser
  })

  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  )

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
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">All Transactions</h1>
        
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
      
      <Card>
        <CardHeader>
          <CardTitle>Transaction Monitor</CardTitle>
          <CardDescription>View and analyze all transactions in the system</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p>Loading transaction data...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center text-destructive py-8">
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
          ) : (
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
                      <TableHead>Sender</TableHead>
                      <TableHead>Receiver</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Risk Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTransactions.length > 0 ? (
                      paginatedTransactions.map((transaction) => {
                        const formattedTransaction = formatTransaction(transaction)
                        return (
                          <TableRow key={transaction.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{formattedTransaction.senderName}</p>
                                <p className="text-sm text-muted-foreground">{transaction.description}</p>
                              </div>
                            </TableCell>
                            <TableCell>{formattedTransaction.receiverName}</TableCell>
                            <TableCell>{transaction.category}</TableCell>
                            <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                            <TableCell>
                              {transaction.amount.toLocaleString("en-US", {
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
                        )
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}
