// This file would connect to a real database in production
// For demonstration, we'll use a simulated database with localStorage
"use client"

import { v4 as uuidv4 } from "uuid"

// Define types
export type User = {
  id: string
  email: string
  firstName: string
  lastName: string
  balance: number
  accounts: Account[]
  createdAt: Date
  updatedAt: Date
}

export type Account = {
  id: string
  userId: string
  type: "CHECKING" | "SAVINGS" | "INVESTMENT"
  name: string
  balance: number
  createdAt: Date
  updatedAt: Date
}

export type Transaction = {
  id: string
  senderId: string
  receiverId: string | null
  senderAccountId: string
  receiverAccountId: string | null
  amount: number
  description: string
  category: string
  status: "COMPLETED" | "PENDING" | "FLAGGED"
  riskScore: "LOW" | "MEDIUM" | "HIGH"
  createdAt: Date
}

// Sample users for demonstration
export const sampleUsers: User[] = [
  {
    id: "1",
    email: "john.doe@example.com",
    firstName: "John",
    lastName: "Doe",
    balance: 12500.75,
    accounts: [
      {
        id: "101",
        userId: "1",
        type: "CHECKING",
        name: "Main Account",
        balance: 7500.5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "102",
        userId: "1",
        type: "SAVINGS",
        name: "Emergency Fund",
        balance: 5000.25,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    email: "jane.smith@example.com",
    firstName: "Jane",
    lastName: "Smith",
    balance: 18750.4,
    accounts: [
      {
        id: "201",
        userId: "2",
        type: "CHECKING",
        name: "Personal Account",
        balance: 8750.4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "202",
        userId: "2",
        type: "SAVINGS",
        name: "Vacation Fund",
        balance: 5000.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "203",
        userId: "2",
        type: "INVESTMENT",
        name: "Retirement Fund",
        balance: 5000.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    email: "robert.johnson@example.com",
    firstName: "Robert",
    lastName: "Johnson",
    balance: 9820.3,
    accounts: [
      {
        id: "301",
        userId: "3",
        type: "CHECKING",
        name: "Main Account",
        balance: 4820.3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "302",
        userId: "3",
        type: "SAVINGS",
        name: "Home Fund",
        balance: 5000.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    email: "sarah.williams@example.com",
    firstName: "Sarah",
    lastName: "Williams",
    balance: 6430.55,
    accounts: [
      {
        id: "401",
        userId: "4",
        type: "CHECKING",
        name: "Personal Account",
        balance: 3430.55,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "402",
        userId: "4",
        type: "SAVINGS",
        name: "Travel Fund",
        balance: 3000.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "5",
    email: "michael.brown@example.com",
    firstName: "Michael",
    lastName: "Brown",
    balance: 21075.9,
    accounts: [
      {
        id: "501",
        userId: "5",
        type: "CHECKING",
        name: "Business Account",
        balance: 11075.9,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "502",
        userId: "5",
        type: "SAVINGS",
        name: "Emergency Fund",
        balance: 10000.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "6",
    email: "emily.davis@example.com",
    firstName: "Emily",
    lastName: "Davis",
    balance: 8300.25,
    accounts: [
      {
        id: "601",
        userId: "6",
        type: "CHECKING",
        name: "Main Account",
        balance: 5300.25,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "602",
        userId: "6",
        type: "SAVINGS",
        name: "Wedding Fund",
        balance: 3000.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "7",
    email: "david.miller@example.com",
    firstName: "David",
    lastName: "Miller",
    balance: 15640.85,
    accounts: [
      {
        id: "701",
        userId: "7",
        type: "CHECKING",
        name: "Personal Account",
        balance: 8640.85,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "702",
        userId: "7",
        type: "SAVINGS",
        name: "Rainy Day Fund",
        balance: 7000.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "8",
    email: "olivia.wilson@example.com",
    firstName: "Olivia",
    lastName: "Wilson",
    balance: 11200.45,
    accounts: [
      {
        id: "801",
        userId: "8",
        type: "CHECKING",
        name: "Main Account",
        balance: 6200.45,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "802",
        userId: "8",
        type: "SAVINGS",
        name: "Education Fund",
        balance: 5000.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

// Sample transactions for demonstration
export const sampleTransactions: Transaction[] = [
  {
    id: uuidv4(),
    senderId: "1",
    receiverId: "2",
    senderAccountId: "101",
    receiverAccountId: "201",
    amount: 250.0,
    description: "Rent payment",
    category: "Housing",
    status: "COMPLETED",
    riskScore: "LOW",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 2)),
  },
  {
    id: uuidv4(),
    senderId: "2",
    receiverId: "3",
    senderAccountId: "201",
    receiverAccountId: "301",
    amount: 75.5,
    description: "Dinner split",
    category: "Food",
    status: "COMPLETED",
    riskScore: "LOW",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 3)),
  },
  {
    id: uuidv4(),
    senderId: "3",
    receiverId: "1",
    senderAccountId: "301",
    receiverAccountId: "101",
    amount: 120.0,
    description: "Concert tickets",
    category: "Entertainment",
    status: "COMPLETED",
    riskScore: "LOW",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 5)),
  },
  {
    id: uuidv4(),
    senderId: "4",
    receiverId: "5",
    senderAccountId: "401",
    receiverAccountId: "501",
    amount: 450.0,
    description: "Freelance work payment",
    category: "Income",
    status: "COMPLETED",
    riskScore: "LOW",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
  },
  {
    id: uuidv4(),
    senderId: "5",
    receiverId: "6",
    senderAccountId: "501",
    receiverAccountId: "601",
    amount: 1250.0,
    description: "Business investment",
    category: "Investment",
    status: "PENDING",
    riskScore: "MEDIUM",
    createdAt: new Date(),
  },
  {
    id: uuidv4(),
    senderId: "6",
    receiverId: "7",
    senderAccountId: "601",
    receiverAccountId: "701",
    amount: 85.25,
    description: "Group gift",
    category: "Gifts",
    status: "COMPLETED",
    riskScore: "LOW",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 4)),
  },
  {
    id: uuidv4(),
    senderId: "7",
    receiverId: "8",
    senderAccountId: "701",
    receiverAccountId: "801",
    amount: 320.75,
    description: "Car repair reimbursement",
    category: "Transportation",
    status: "COMPLETED",
    riskScore: "LOW",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 7)),
  },
  {
    id: uuidv4(),
    senderId: "8",
    receiverId: "1",
    senderAccountId: "801",
    receiverAccountId: "101",
    amount: 180.0,
    description: "Shared utility bill",
    category: "Utilities",
    status: "COMPLETED",
    riskScore: "LOW",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 6)),
  },
  {
    id: uuidv4(),
    senderId: "1",
    receiverId: "3",
    senderAccountId: "101",
    receiverAccountId: "301",
    amount: 95.5,
    description: "Sports event tickets",
    category: "Entertainment",
    status: "FLAGGED",
    riskScore: "HIGH",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
  },
  {
    id: uuidv4(),
    senderId: "2",
    receiverId: "4",
    senderAccountId: "201",
    receiverAccountId: "401",
    amount: 540.0,
    description: "Rent share",
    category: "Housing",
    status: "COMPLETED",
    riskScore: "LOW",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 3)),
  },
  {
    id: uuidv4(),
    senderId: "3",
    receiverId: null,
    senderAccountId: "301",
    receiverAccountId: null,
    amount: 65.99,
    description: "Monthly streaming subscription",
    category: "Entertainment",
    status: "COMPLETED",
    riskScore: "LOW",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 10)),
  },
  {
    id: uuidv4(),
    senderId: "4",
    receiverId: null,
    senderAccountId: "401",
    receiverAccountId: null,
    amount: 120.5,
    description: "Grocery shopping",
    category: "Food",
    status: "COMPLETED",
    riskScore: "LOW",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 2)),
  },
  {
    id: uuidv4(),
    senderId: "5",
    receiverId: null,
    senderAccountId: "501",
    receiverAccountId: null,
    amount: 850.0,
    description: "Office equipment",
    category: "Business",
    status: "COMPLETED",
    riskScore: "LOW",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 8)),
  },
  {
    id: uuidv4(),
    senderId: "6",
    receiverId: null,
    senderAccountId: "601",
    receiverAccountId: null,
    amount: 75.25,
    description: "Phone bill payment",
    category: "Utilities",
    status: "COMPLETED",
    riskScore: "LOW",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 5)),
  },
  {
    id: uuidv4(),
    senderId: "7",
    receiverId: null,
    senderAccountId: "701",
    receiverAccountId: null,
    amount: 1250.0,
    description: "International transfer",
    category: "Transfer",
    status: "FLAGGED",
    riskScore: "HIGH",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
  },
]

// Generate spending categories for each user
export const userSpendingCategories = [
  { id: "1", name: "Housing", percentage: 35 },
  { id: "2", name: "Food", percentage: 15 },
  { id: "3", name: "Transportation", percentage: 10 },
  { id: "4", name: "Entertainment", percentage: 8 },
  { id: "5", name: "Healthcare", percentage: 10 },
  { id: "6", name: "Utilities", percentage: 7 },
  { id: "7", name: "Shopping", percentage: 10 },
  { id: "8", name: "Others", percentage: 5 },
]

// Mock DB functions
export const db = {
  // User management
  getUsers: (): User[] => {
    return sampleUsers
  },

  getUserById: (id: string): User | undefined => {
    return sampleUsers.find((user) => user.id === id)
  },

  createUser: (userData: Omit<User, "id" | "createdAt" | "updatedAt">): User => {
    // In a real implementation, this would insert into a database
    const newUser: User = {
      id: uuidv4(),
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return newUser
  },

  // Transaction management
  getTransactions: (): Transaction[] => {
    return sampleTransactions
  },

  getTransactionsByUserId: (userId: string): Transaction[] => {
    return sampleTransactions.filter(
      (transaction) => transaction.senderId === userId || transaction.receiverId === userId,
    )
  },

  createTransaction: (transactionData: Omit<Transaction, "id" | "createdAt">): Transaction => {
    // In a real implementation, this would insert into a database
    const newTransaction: Transaction = {
      id: uuidv4(),
      ...transactionData,
      createdAt: new Date(),
    }

    return newTransaction
  },

  // Get spending categories for a user
  getUserSpendingCategories: (userId: string) => {
    // In a real implementation, this would retrieve from a database
    // For now, return the same categories for all users
    return userSpendingCategories
  },
}

// Mock auth service
export const authService = {
  currentUserId: "1", // Default to first user

  login: (email: string, password: string): User | null => {
    // In a real implementation, this would verify credentials
    const user = sampleUsers.find((user) => user.email === email)
    if (user) {
      authService.currentUserId = user.id
      return user
    }
    return null
  },

  getCurrentUser: (): User | null => {
    const user = sampleUsers.find((user) => user.id === authService.currentUserId)
    return user || null
  },

  setCurrentUser: (userId: string) => {
    authService.currentUserId = userId
  },
}
