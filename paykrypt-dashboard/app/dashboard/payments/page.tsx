"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { PaymentConfirmation } from "@/components/payment-confirmation"
import UserSelector from "../user-selector"
import { db, type User } from "@/lib/db"
import { sendTransactionForAnalysis } from "@/lib/fraud-detection"
import { useUser } from "@/contexts/user-context"

export default function PaymentsPage() {
  const { currentUser, loading } = useUser()
  const [amount, setAmount] = useState("")
  const [recipient, setRecipient] = useState("")
  const [recipientId, setRecipientId] = useState("")
  const [recipientAccount, setRecipientAccount] = useState("")
  const [paymentType, setPaymentType] = useState("transfer")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [riskScore, setRiskScore] = useState<"LOW" | "MEDIUM" | "HIGH" | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [selectedFromAccount, setSelectedFromAccount] = useState("")
  const [memo, setMemo] = useState("")

  useEffect(() => {
    if (currentUser) {
      // Set default from account to first checking account or first account
      const checkingAccount = currentUser.accounts.find((acc) => acc.type === "CHECKING")
      if (checkingAccount) {
        setSelectedFromAccount(checkingAccount.id)
      } else if (currentUser.accounts.length > 0) {
        setSelectedFromAccount(currentUser.accounts[0].id)
      }

      // Get all users for recipient selection
      const allUsers = db.getUsers().filter((u) => u.id !== currentUser.id)
      setUsers(allUsers)
    }
  }, [currentUser])

  // Reset form when user changes
  useEffect(() => {
    resetForm()
  }, [currentUser])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser || !selectedFromAccount) return

    setIsProcessing(true)

    // Create transaction object
    const newTransaction = {
      id: Math.random().toString(36).substring(2, 15),
      senderId: currentUser.id,
      receiverId: recipientId || null,
      senderAccountId: selectedFromAccount,
      receiverAccountId: recipientAccount || null,
      amount: Number.parseFloat(amount),
      description: memo || paymentType,
      category: paymentType.charAt(0).toUpperCase() + paymentType.slice(1),
      status: "PENDING" as "PENDING" | "COMPLETED" | "FLAGGED",
      riskScore: "LOW" as "LOW" | "MEDIUM" | "HIGH",
      createdAt: new Date(),
    }

    // Send to Gemini AI for fraud detection analysis
    try {
      const analysisResult = await sendTransactionForAnalysis(newTransaction)

      // Update with analysis result
      setRiskScore(analysisResult.riskScore)

      // Proceed with the transaction based on risk score
      if (analysisResult.riskScore !== "HIGH") {
        // In a real app, you would save the transaction to the database here
        // with the updated risk score and status from the AI
        setTimeout(() => {
          setIsComplete(true)
          setIsProcessing(false)
        }, 1000)
      } else {
        setIsProcessing(false)
        // Transaction is blocked due to high risk
      }
    } catch (error) {
      console.error("Error analyzing transaction:", error)
      setRiskScore("MEDIUM")
      setIsProcessing(false)
    }
  }

  const resetForm = () => {
    setAmount("")
    setRecipient("")
    setRecipientId("")
    setRecipientAccount("")
    setPaymentType("transfer")
    setMemo("")
    setIsComplete(false)
    setRiskScore(null)
  }

  const handleRecipientChange = (userId: string) => {
    setRecipientId(userId)
    const user = users.find((u) => u.id === userId)
    if (user) {
      setRecipient(`${user.firstName} ${user.lastName}`)

      // Set default recipient account to first checking account or first account
      const checkingAccount = user.accounts.find((acc) => acc.type === "CHECKING")
      if (checkingAccount) {
        setRecipientAccount(checkingAccount.id)
      } else if (user.accounts.length > 0) {
        setRecipientAccount(user.accounts[0].id)
      }
    }
  }

  if (loading || !currentUser) {
    return <div>Loading...</div>
  }

  if (isComplete) {
    return (
      <div className="container mx-auto max-w-4xl py-6">
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold">Make a Payment</h1>
          <UserSelector />
        </div>
        <PaymentConfirmation
          amount={amount}
          recipient={recipient}
          onDone={resetForm}
          senderAccount={currentUser.accounts.find((acc) => acc.id === selectedFromAccount)?.name || ""}
          memo={memo}
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl py-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Make a Payment</h1>
        <UserSelector />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
          <CardDescription>
            Enter the details for your payment. Our AI system will analyze the transaction for potential fraud.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="from-account">From Account</Label>
                  <Select value={selectedFromAccount} onValueChange={setSelectedFromAccount}>
                    <SelectTrigger id="from-account">
                      <SelectValue placeholder="Select your account" />
                    </SelectTrigger>
                    <SelectContent>
                      {currentUser.accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name} (${account.balance.toFixed(2)})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment-type">Payment Type</Label>
                  <Select value={paymentType} onValueChange={setPaymentType}>
                    <SelectTrigger id="payment-type">
                      <SelectValue placeholder="Select payment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="transfer">Bank Transfer</SelectItem>
                      <SelectItem value="bill">Bill Payment</SelectItem>
                      <SelectItem value="international">International Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipient</Label>
                  <Select value={recipientId} onValueChange={handleRecipientChange}>
                    <SelectTrigger id="recipient">
                      <SelectValue placeholder="Select recipient" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.firstName} {user.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recipient-account">Recipient Account</Label>
                  <Select value={recipientAccount} onValueChange={setRecipientAccount} disabled={!recipientId}>
                    <SelectTrigger id="recipient-account">
                      <SelectValue placeholder="Select recipient account" />
                    </SelectTrigger>
                    <SelectContent>
                      {users
                        .find((u) => u.id === recipientId)
                        ?.accounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <Input
                    id="amount"
                    type="text"
                    placeholder="0.00"
                    className="pl-8"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="memo">Memo (Optional)</Label>
                <Input
                  id="memo"
                  placeholder="What's this payment for?"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                />
              </div>
            </div>

            {riskScore && (
              <Alert 
                className={
                  riskScore === "HIGH" 
                    ? "border-destructive text-destructive" 
                    : riskScore === "MEDIUM" 
                      ? "border-yellow-500 text-yellow-600 dark:text-yellow-400" 
                      : ""
                }
              >
                {riskScore === "HIGH" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                <AlertTitle>
                  {riskScore === "HIGH"
                    ? "High Risk Transaction Detected"
                    : riskScore === "MEDIUM"
                      ? "Medium Risk Transaction"
                      : "Low Risk Transaction"}
                </AlertTitle>
                <AlertDescription>
                  {riskScore === "HIGH"
                    ? "Our AI system has flagged this transaction as potentially fraudulent. Please verify the recipient details or contact support."
                    : riskScore === "MEDIUM"
                      ? "This transaction has some unusual patterns. Please verify the details before proceeding."
                      : "This transaction appears to be legitimate based on your transaction history."}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isProcessing || riskScore === "HIGH" || !amount || !recipientId}
            >
              {isProcessing ? (
                "Analyzing transaction..."
              ) : riskScore === "HIGH" ? (
                "Transaction blocked"
              ) : (
                <>
                  Continue to confirmation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between border-t px-6 py-4">
          <p className="text-xs text-muted-foreground">Protected by quantum-secure encryption and AI fraud detection</p>
        </CardFooter>
      </Card>
    </div>
  )
}
