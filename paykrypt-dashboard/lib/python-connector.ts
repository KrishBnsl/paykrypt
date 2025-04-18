import { Transaction } from "./db";

/**
 * Sends a transaction to the Gemini API for fraud analysis.
 * 
 * @param transaction The transaction to analyze
 * @returns The analyzed transaction with fraud detection info
 */
export async function sendTransactionForAnalysis(
  transaction: Partial<Transaction>
): Promise<{
  transactionId: string;
  riskScore: "LOW" | "MEDIUM" | "HIGH";
  riskFactors: string[];
  status: "COMPLETED" | "PENDING" | "FLAGGED";
  recommendation: string;
}> {
  try {
    // Get recent transactions to provide context for the AI
    const response = await fetch("/api/python-interface", {
      method: "GET",
    });
    
    const transactionHistory = await response.json();
    
    // Send the current transaction along with history to the Gemini API
    const analysisResponse = await fetch("/api/python-interface", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currentTransaction: transaction,
        transactionHistory,
      }),
    });
    
    if (!analysisResponse.ok) {
      throw new Error(`Failed to analyze transaction: ${analysisResponse.statusText}`);
    }
    
    const result = await analysisResponse.json();
    
    if (!result.success || !result.updatedTransaction) {
      throw new Error("Invalid response from fraud detection service");
    }
    
    return result.updatedTransaction;
  } catch (error) {
    console.error("Error analyzing transaction:", error);
    
    // Provide a fallback response if the AI service fails
    // In a real-world scenario, you might want to retry or handle this differently
    return {
      transactionId: transaction.id || "",
      // Default to MEDIUM as a cautious approach when AI fails
      riskScore: "MEDIUM",
      riskFactors: ["Could not analyze transaction due to service error"],
      status: "PENDING",
      recommendation: "Please verify transaction details manually",
    };
  }
}

// Python backend integration example
/*
Python code example for reference:

import requests
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
import json

# Fetch transactions from Next.js API
def fetch_transactions():
    response = requests.get('https://your-next-app.com/api/python-interface')
    return response.json()

# Analyze transaction for fraud
def analyze_transaction(transaction_data):
    # Convert to dataframe for analysis
    df = pd.DataFrame([transaction_data])
    
    # Feature engineering
    # ... code to prepare features ...
    
    # Apply ML model
    model = IsolationForest(contamination=0.1)
    # ... code to fit and predict ...
    
    # Determine risk score
    anomaly_score = model.decision_function([features])[0]
    if anomaly_score < -0.5:
        risk_score = 'HIGH'
    elif anomaly_score < 0:
        risk_score = 'MEDIUM'
    else:
        risk_score = 'LOW'
    
    # Send result back to Next.js API
    result = {
        'transactionId': transaction_data['id'],
        'riskScore': risk_score,
        'status': 'FLAGGED' if risk_score == 'HIGH' else 'COMPLETED'
    }
    
    response = requests.post(
        'https://your-next-app.com/api/python-interface',
        json=result
    )
    
    return response.json()
*/
