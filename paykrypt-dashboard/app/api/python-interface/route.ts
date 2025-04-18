// API endpoint for transaction risk analysis using hardcoded rules
import { NextResponse } from "next/server"
import { db, sampleTransactions } from "@/lib/db"

export async function GET(request: Request) {
  // Get all transactions for analysis
  return NextResponse.json(sampleTransactions)
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { currentTransaction, transactionHistory } = body;
    
    if (!currentTransaction) {
      return NextResponse.json({ error: "Current transaction data is required" }, { status: 400 });
    }
    
    // Use provided transaction history or fall back to sample transactions
    const history = transactionHistory || sampleTransactions;
    
    // Analyze the transaction using our hardcoded algorithm
    const fraudAnalysis = analyzeTransactionRisk(currentTransaction, history);
    
    return NextResponse.json({ 
      success: true, 
      updatedTransaction: fraudAnalysis 
    });
      
  } catch (error: any) {
    console.error("Error in transaction analysis:", error);
    
    return NextResponse.json({ 
      success: true, 
      updatedTransaction: {
        transactionId: error.transactionId || "",
        riskScore: "MEDIUM", // Default to medium as a cautious approach
        riskFactors: ["Error analyzing transaction", "Manual review recommended"],
        status: "PENDING",
        recommendation: "Please verify transaction details manually"
      } 
    });
  }
}

/**
 * Analyzes a transaction's risk level based on user history
 * 
 * @param currentTransaction The transaction to analyze
 * @param transactionHistory Previous transactions for context
 * @returns Analysis with risk score and recommendations
 */
function analyzeTransactionRisk(currentTransaction: any, transactionHistory: any[]) {
  // Get user's transaction history (only their outgoing transactions)
  const userId = currentTransaction.senderId;
  const userOutgoingTransactions = transactionHistory.filter(t => 
    t.senderId === userId && t.id !== currentTransaction.id
  );
  
  // Return default low risk if no history or error occurs
  if (userOutgoingTransactions.length === 0) {
    return {
      transactionId: currentTransaction.id || "",
      riskScore: "MEDIUM", // New users with no history get medium risk
      riskFactors: ["No transaction history available", "New user"],
      status: "PENDING",
      recommendation: "Review first-time transaction"
    };
  }
  
  try {
    // Calculate average transaction amount for this user
    const totalAmount = userOutgoingTransactions.reduce((sum, t) => sum + t.amount, 0);
    const averageAmount = totalAmount / userOutgoingTransactions.length;
    
    // Define thresholds based on average
    const lowThreshold = Math.max(averageAmount * 1.5, 100); // 1.5x average or $100, whichever is higher
    const mediumThreshold = averageAmount * 3; // 3x average
    
    // Get the current transaction amount
    const currentAmount = currentTransaction.amount;
    
    // Check if recipient is new
    const isNewRecipient = currentTransaction.receiverId && 
      !userOutgoingTransactions.some(t => t.receiverId === currentTransaction.receiverId);
    
    // Calculate the largest previous transaction amount
    const largestPreviousAmount = userOutgoingTransactions.length > 0 
      ? Math.max(...userOutgoingTransactions.map(t => t.amount))
      : 0;
    
    // Initialize risk assessment
    let riskScore: "LOW" | "MEDIUM" | "HIGH" = "LOW";
    const riskFactors: string[] = [];
    let status: "COMPLETED" | "PENDING" | "FLAGGED" = "COMPLETED";
    let recommendation = "Transaction appears normal based on history";
    
    // Apply thresholding algorithm
    if (currentAmount <= 100) {
      // Small transactions are generally low risk
      riskScore = "LOW";
      status = "COMPLETED";
    } else if (currentAmount > mediumThreshold) {
      // Amount significantly higher than user average
      riskScore = "HIGH";
      riskFactors.push(`Amount ${(currentAmount / averageAmount).toFixed(1)}x higher than user average`);
      status = "FLAGGED";
      recommendation = "Transaction amount significantly exceeds user's typical spending pattern";
      
      // Check if it's also higher than their largest transaction
      if (currentAmount > largestPreviousAmount * 1.5) {
        riskFactors.push("Exceeds largest previous transaction by significant margin");
      }
    } else if (currentAmount > lowThreshold) {
      // Amount moderately higher than user average
      riskScore = "MEDIUM";
      riskFactors.push(`Amount ${(currentAmount / averageAmount).toFixed(1)}x higher than user average`);
      status = "PENDING";
      recommendation = "Verify transaction details before processing";
    } else {
      // Amount within normal range
      riskScore = "LOW";
      status = "COMPLETED";
    }
    
    // Additional risk factors
    
    // New recipient risk (increase risk level if recipient is new AND amount is significant)
    if (isNewRecipient) {
      if (currentAmount > averageAmount * 1.2) {
        riskFactors.push("First transaction with this recipient with above-average amount");
        
        // Escalate risk for new recipients with high amounts
        if (riskScore === "LOW" && currentAmount > averageAmount) {
          riskScore = "MEDIUM";
          status = "PENDING";
          recommendation = "New recipient with significant amount - verify details";
        } else if (riskScore === "MEDIUM" && currentAmount > largestPreviousAmount) {
          riskScore = "HIGH";
          status = "FLAGGED";
          recommendation = "Large transaction with new recipient - potential fraud risk";
        }
      } else {
        riskFactors.push("First transaction with this recipient");
      }
    }
    
    // Check unusual location if available
    if (currentTransaction.location && userOutgoingTransactions.length > 0) {
      const commonLocations = userOutgoingTransactions
        .filter(t => t.location)
        .map(t => t.location);
      
      if (commonLocations.length > 0 && !commonLocations.includes(currentTransaction.location)) {
        riskFactors.push("Transaction from unusual location");
        
        // Increase risk for unusual locations with significant amounts
        if (riskScore === "LOW" && currentAmount > averageAmount) {
          riskScore = "MEDIUM";
          status = "PENDING";
          recommendation = "Unusual location - verify transaction";
        }
      }
    }
    
    // Check unusual device if available
    if (currentTransaction.deviceId && userOutgoingTransactions.length > 0) {
      const commonDevices = userOutgoingTransactions
        .filter(t => t.deviceId)
        .map(t => t.deviceId);
      
      if (commonDevices.length > 0 && !commonDevices.includes(currentTransaction.deviceId)) {
        // Particularly suspicious if device is "Unknown"
        if (currentTransaction.deviceId === "Unknown Device") {
          riskFactors.push("Transaction from unknown device");
          
          if (riskScore !== "HIGH") {
            riskScore = "HIGH";
            status = "FLAGGED";
            recommendation = "Transaction from unknown device - potential account compromise";
          }
        } else {
          riskFactors.push("Transaction from new device");
          
          // Only increase risk if already suspicious
          if (riskScore === "MEDIUM" && currentAmount > averageAmount) {
            riskScore = "HIGH";
            status = "FLAGGED";
            recommendation = "Multiple risk factors detected - review carefully";
          }
        }
      }
    }
    
    // If no risk factors were identified but we assigned a risk, add a generic one
    if (riskFactors.length === 0 && riskScore !== "LOW") {
      riskFactors.push("Transaction deviates from typical pattern");
    }
    
    // For truly low-risk transactions with no flags
    if (riskFactors.length === 0) {
      riskFactors.push("No risk factors identified");
    }
    
    // Return the final analysis
    return {
      transactionId: currentTransaction.id || "",
      riskScore,
      riskFactors,
      status,
      recommendation
    };
    
  } catch (error) {
    console.error("Error in risk analysis algorithm:", error);
    // Fallback to medium risk if there's an error in our algorithm
    return {
      transactionId: currentTransaction.id || "",
      riskScore: "MEDIUM",
      riskFactors: ["Error in risk assessment", "Default to cautious approach"],
      status: "PENDING",
      recommendation: "Manual verification recommended due to assessment error"
    };
  }
}
