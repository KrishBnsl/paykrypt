import { sampleTransactions } from "@/lib/db";

// Define the Transaction type if it's not already defined elsewhere
interface Transaction {
  id?: string;
  amount?: number;
  recipient?: string;
  timestamp?: string;
  status?: string;
  [key: string]: any;
}

/**
 * Sends a transaction to the Gemini AI for fraud risk analysis.
 * 
 * @param transaction The transaction to analyze
 * @returns The analyzed transaction with fraud detection results
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
  // Ensure transaction has an ID
  if (!transaction.id) {
    transaction.id = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  // Maximum number of retries for API calls
  const MAX_RETRIES = 2;
  
  // Function to retry API calls with exponential backoff
  async function fetchWithRetry(url: string, options: RequestInit, retries: number = 0): Promise<Response> {
    try {
      const response = await fetch(url, options);
      if (!response.ok && retries < MAX_RETRIES) {
        // Exponential backoff: wait 2^retries * 500ms before retrying
        const delay = Math.pow(2, retries) * 500;
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithRetry(url, options, retries + 1);
      }
      return response;
    } catch (error) {
      if (retries < MAX_RETRIES) {
        const delay = Math.pow(2, retries) * 500;
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithRetry(url, options, retries + 1);
      }
      throw error;
    }
  }

  try {
    // Get transaction history for context
    let transactionHistory = sampleTransactions;
    try {
      const historyResponse = await fetchWithRetry("/api/python-interface", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }, 0);
      
      if (historyResponse.ok) {
        transactionHistory = await historyResponse.json();
      }
    } catch (historyError) {
      console.warn("Failed to fetch transaction history, using sample data", historyError);
      // We'll continue with sampleTransactions as fallback
    }
    
    // Analyze the transaction
    try {
      const analysisResponse = await fetchWithRetry("/api/python-interface", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentTransaction: transaction,
          transactionHistory,
        }),
      }, 0);
      
      if (!analysisResponse.ok) {
        console.error(`API error: ${analysisResponse.status} ${analysisResponse.statusText}`);
        throw new Error(`Failed to analyze transaction: ${analysisResponse.statusText}`);
      }
      
      const result = await analysisResponse.json();
      
      if (!result.success || !result.updatedTransaction) {
        throw new Error("Invalid response format from fraud detection service");
      }
      
      return result.updatedTransaction;
    } catch (error) {
      console.error("Analysis error:", error);
      throw error; // Re-throw to be caught by the outer try-catch
    }
  } catch (error) {
    console.error("Error in fraud detection process:", error);
    
    // Return a fallback response when the service fails
    return {
      transactionId: transaction.id || "",
      riskScore: "MEDIUM", // Default to medium risk when service fails
      riskFactors: ["Service unavailable - manual review recommended"],
      status: "PENDING",
      recommendation: "System could not automatically analyze this transaction. Please manually review or try again later."
    };
  }
}
