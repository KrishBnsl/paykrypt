"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Ban, CheckCircle, UserCog, AlertTriangle, Clock } from "lucide-react"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { db, authService, type Transaction } from "@/lib/db"
import { useUser } from "@/contexts/user-context"

export default function FlaggedTransactionsPage() {
  const [flaggedTransactions, setFlaggedTransactions] = useState<any[]>([])
  const [userMap, setUserMap] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [users, setUsers] = useState<any[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string>("all")
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)
  const [adminNotes, setAdminNotes] = useState("")
  const [actionType, setActionType] = useState<"approve" | "cancel" | "freeze" | null>(null)
  const { refreshUser } = useUser()
  const [noTransactions, setNoTransactions] = useState(false)

  // Fetch data on component mount and at regular intervals for real-time updates
  useEffect(() => {
    const fetchData = () => {
      try {
        setIsLoading(true)
        
        // Get transactions with HIGH risk and FLAGGED status
        let allTransactions: Transaction[] = []
        if (typeof db.getAllTransactions === 'function') {
          allTransactions = db.getAllTransactions() as Transaction[];
        } else if (typeof db.getTransactions === 'function') {
          allTransactions = db.getTransactions() as Transaction[];
        }
        
        console.log("All transactions:", allTransactions.length);
        
        // Fix: More robust filtering for high-risk transactions
        const flagged = allTransactions.filter(t => {
          // Debug log to see what's filtering out
          if (t.riskScore === "HIGH") {
            console.log("Found HIGH risk transaction:", t.id, t.status, t.description);
          }
          
          // Accept either HIGH risk score OR FLAGGED status
          return (t.riskScore === "HIGH" || t.status === "FLAGGED");
        });
        
        console.log("Flagged transactions found:", flagged.length);
        
        // Set no transactions flag
        setNoTransactions(flagged.length === 0)
        
        // Sort by date (newest first)
        const sortedTransactions = [...flagged].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        setFlaggedTransactions(sortedTransactions)
        
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
        console.error("Error fetching flagged transactions:", err)
        setError("Failed to load flagged transactions. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
    
    // Set interval to refresh data regularly for real-time updates (faster refresh for demo)
    const intervalId = setInterval(fetchData, 1000)
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
    }
  }

  // Format transaction for display
  const formatTransaction = (transaction: any) => {
    const sender = userMap[transaction.senderId] || { firstName: "Unknown", lastName: "Sender" }
    const receiver = userMap[transaction.receiverId] || { firstName: "Unknown", lastName: "Recipient" }
    
    const senderName = `${sender.firstName} ${sender.lastName}`
    const receiverName = receiver ? `${receiver.firstName} ${receiver.lastName}` : "Unknown"
    
    // Format risk factors to be more readable
    const riskFactors = transaction.riskFactors || ["High-risk transaction"]
    
    return {
      ...transaction,
      senderName,
      receiverName,
      riskFactors
    }
  }

  // Handle transaction action confirmation (approve, cancel, freeze)
  const handleActionConfirm = () => {
    if (!selectedTransaction || !actionType) return

    // Create a copy of the transaction to update
    const updatedTransaction = { ...selectedTransaction }
    
    // Update the transaction based on admin action
    switch (actionType) {
      case "approve":
        updatedTransaction.status = "COMPLETED"
        updatedTransaction.adminReview = {
          action: "APPROVED",
          notes: adminNotes,
          timestamp: new Date(),
          adminId: "admin" // In a real app, this would be the actual admin ID
        }
        break
      case "cancel":
        updatedTransaction.status = "CANCELLED"
        updatedTransaction.adminReview = {
          action: "CANCELLED",
          notes: adminNotes,
          timestamp: new Date(),
          adminId: "admin"
        }
        break
      case "freeze":
        updatedTransaction.status = "FROZEN"
        updatedTransaction.adminReview = {
          action: "FROZEN",
          notes: adminNotes,
          timestamp: new Date(),
          adminId: "admin"
        }
        break
    }
    
    // Update the transaction in localStorage for persistence
    if (typeof window !== 'undefined') {
      try {
        // Get existing transactions from localStorage
        const storedTransactionsString = localStorage.getItem('paykrypt_transactions')
        if (storedTransactionsString) {
          const storedTransactions = JSON.parse(storedTransactionsString)
          
          // Update the transaction
          const updatedTransactions = storedTransactions.map((t: any) => 
            t.id === updatedTransaction.id ? updatedTransaction : t
          )
          
          // Save back to localStorage
          localStorage.setItem('paykrypt_transactions', JSON.stringify(updatedTransactions))
          
          // Update the db
          if (typeof db.updateTransaction === 'function') {
            db.updateTransaction(updatedTransaction)
          }
        }
      } catch (err) {
        console.error("Error updating transaction in localStorage:", err)
      }
    }
    
    // Remove the transaction from the list of flagged transactions
    const updatedTransactions = flaggedTransactions.filter(
      t => t.id !== selectedTransaction.id
    )
    
    setFlaggedTransactions(updatedTransactions)
    setNoTransactions(updatedTransactions.length === 0)
    setSelectedTransaction(null)
    setAdminNotes("")
    setActionType(null)
  }

  // Show action dialog
  const showActionDialog = (transaction: any, action: "approve" | "cancel" | "freeze") => {
    setSelectedTransaction(transaction)
    setActionType(action)
    setAdminNotes("")
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading flagged transactions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-6 w-6 text-destructive" />
          <h1 className="text-3xl font-bold tracking-tight">Flagged Transactions</h1>
          <Badge variant="destructive" className="ml-2">
            {flaggedTransactions.length} Pending Review
          </Badge>
        </div>
        
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
          <CardTitle>High-Risk Transactions Requiring Review</CardTitle>
          <CardDescription>
            Review and take action on transactions flagged by the AI fraud detection system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
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
          ) : noTransactions ? (
            <div className="text-center py-12 space-y-3">
              <CheckCircle className="h-12 w-12 mx-auto text-green-500" />
              <h3 className="text-xl font-medium">No Flagged Transactions</h3>
              <p className="text-muted-foreground">
                There are currently no high-risk transactions requiring review.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {flaggedTransactions.map(transaction => {
                const formatted = formatTransaction(transaction);
                return (
                  <Card key={transaction.id} className="border-destructive/30">
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-1">
                          <h3 className="font-semibold text-lg flex items-center space-x-2">
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                            <span>High Risk Transaction</span>
                          </h3>
                          <p className="text-sm text-muted-foreground">ID: {transaction.id}</p>
                          <p className="text-sm font-medium">Amount: {formatAmount(transaction.amount)}</p>
                          <p className="text-sm text-muted-foreground">
                            Date: {formatDate(transaction.createdAt)}
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm font-semibold">From:</p>
                            <p>{formatted.senderName}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold">To:</p>
                            <p>{formatted.receiverName}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold">Description:</p>
                            <p>{transaction.description}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm font-semibold">Risk Factors:</p>
                          <ul className="text-sm space-y-1">
                            {formatted.riskFactors.map((factor: string, idx: number) => (
                              <li key={idx} className="flex items-start">
                                <AlertCircle className="h-4 w-4 text-destructive mr-2 mt-0.5 flex-shrink-0" />
                                <span>{factor}</span>
                              </li>
                            ))}
                          </ul>
                          
                          <div className="flex justify-between mt-4 gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm"
                                  variant="destructive" 
                                  onClick={() => showActionDialog(transaction, "cancel")}
                                >
                                  <Ban className="h-4 w-4 mr-1" />
                                  Cancel
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Cancel Transaction</DialogTitle>
                                  <DialogDescription>
                                    This will cancel the transaction and notify the sender.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                  <Label htmlFor="admin-notes">Admin Notes (optional)</Label>
                                  <Textarea 
                                    id="admin-notes"
                                    placeholder="Add notes about why this transaction was cancelled..."
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    className="mt-2"
                                  />
                                </div>
                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                  </DialogClose>
                                  <DialogClose asChild>
                                    <Button 
                                      variant="destructive"
                                      onClick={handleActionConfirm}
                                    >
                                      Confirm Cancellation
                                    </Button>
                                  </DialogClose>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm"
                                  variant="outline" 
                                  onClick={() => showActionDialog(transaction, "freeze")}
                                >
                                  <Clock className="h-4 w-4 mr-1" />
                                  Freeze
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Freeze Transaction</DialogTitle>
                                  <DialogDescription>
                                    This will freeze the transaction for further investigation.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                  <Label htmlFor="admin-notes">Admin Notes (required)</Label>
                                  <Textarea 
                                    id="admin-notes"
                                    placeholder="Add notes about why this transaction was frozen and what additional information is needed..."
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    className="mt-2"
                                    required
                                  />
                                </div>
                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                  </DialogClose>
                                  <DialogClose asChild>
                                    <Button 
                                      variant="secondary"
                                      onClick={handleActionConfirm}
                                      disabled={!adminNotes.trim()}
                                    >
                                      Confirm Freeze
                                    </Button>
                                  </DialogClose>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm"
                                  variant="default" 
                                  onClick={() => showActionDialog(transaction, "approve")}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Approve Transaction</DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to approve this high-risk transaction?
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                  <Label htmlFor="admin-notes">Admin Notes (optional)</Label>
                                  <Textarea 
                                    id="admin-notes"
                                    placeholder="Add notes about why this transaction was approved despite the high risk..."
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    className="mt-2"
                                  />
                                </div>
                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                  </DialogClose>
                                  <DialogClose asChild>
                                    <Button 
                                      variant="default"
                                      onClick={handleActionConfirm}
                                    >
                                      Confirm Approval
                                    </Button>
                                  </DialogClose>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
