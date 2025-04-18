"use client"

import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface PaymentConfirmationProps {
  amount: string
  recipient: string
  senderAccount: string
  memo?: string
  onDone: () => void
}

export function PaymentConfirmation({ amount, recipient, senderAccount, memo, onDone }: PaymentConfirmationProps) {
  const transactionId = Math.random().toString(36).substring(2, 15)
  const date = new Date().toLocaleString()

  return (
    <div className="container mx-auto max-w-md py-12">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-300" />
          </div>
          <CardTitle className="text-2xl">Payment Successful</CardTitle>
          <CardDescription>Your payment has been processed successfully</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border bg-muted/50 p-6">
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">From</span>
              <span className="font-medium">{senderAccount}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">To</span>
              <span className="font-medium">{recipient}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-medium">₹{amount}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Date</span>
              <span className="font-medium">{date}</span>
            </div>
            {memo && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Memo</span>
                <span className="font-medium">{memo}</span>
              </div>
            )}
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Transaction ID</span>
              <span className="font-medium">{transactionId}</span>
            </div>
          </div>

          <div className="rounded-lg border p-4 bg-green-50 dark:bg-green-950">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-700 dark:text-green-300">Verified by AI Fraud Detection</h4>
                <p className="text-sm text-green-600 dark:text-green-400">
                  This transaction was analyzed and verified as legitimate by our AI system.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={onDone} className="w-full">
            Done
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
