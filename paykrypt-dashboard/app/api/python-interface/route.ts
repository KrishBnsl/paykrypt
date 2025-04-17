// API endpoint for interfacing with a Python backend for fraud detection
import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: Request) {
  // Get all transactions for Python backend to analyze
  const transactions = db.getTransactions()

  return NextResponse.json(transactions)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Expected format from Python backend:
    // { transactionId: string, riskScore: 'LOW' | 'MEDIUM' | 'HIGH', status: 'COMPLETED' | 'PENDING' | 'FLAGGED' }

    // In a real implementation, this would update the transaction in the database
    // For now, just return a success response

    return NextResponse.json({ success: true, updatedTransaction: body })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
