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
  isAdmin?: boolean
  reputation: "excellent" | "good" | "average" | "bad" | "very bad" // New reputation field
  loginHistory: LoginEvent[] // Track login patterns
}

export type LoginEvent = {
  id: string
  userId: string
  timestamp: Date
  ipAddress: string
  device: string
  location: string
  successful: boolean
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
  location?: string // Add location for geo-analysis
  deviceId?: string // Add device info
}

// Generate sample login events for a user
const generateLoginHistory = (userId: string, count: number = 10): LoginEvent[] => {
  const devices = ["iPhone 13", "MacBook Pro", "Windows PC", "Android Pixel 6", "iPad Pro", "Samsung Galaxy"];
  const locations = ["New York, USA", "London, UK", "San Francisco, USA", "Tokyo, Japan", "Berlin, Germany", "Sydney, Australia"];
  const ipPrefixes = ["192.168.", "172.16.", "10.0.", "82.45.", "123.45."];
  
  const history: LoginEvent[] = [];
  
  // Generate successful logins (normal pattern)
  for (let i = 0; i < count; i++) {
    // Pick consistent device/location for a user (with occasional changes)
    const preferredDevice = devices[userId.charCodeAt(0) % devices.length];
    const preferredLocation = locations[userId.charCodeAt(0) % locations.length]; 
    const preferredIpPrefix = ipPrefixes[userId.charCodeAt(0) % ipPrefixes.length];
    
    // Calculate a date, spreading logins over the past month
    const daysAgo = Math.floor(Math.random() * 30);
    const hoursAgo = Math.floor(Math.random() * 24);
    const loginDate = new Date();
    loginDate.setDate(loginDate.getDate() - daysAgo);
    loginDate.setHours(loginDate.getHours() - hoursAgo);
    
    // Most logins use the preferred device/location
    const usePreferred = Math.random() > 0.2;
    
    history.push({
      id: uuidv4(),
      userId: userId,
      timestamp: loginDate,
      ipAddress: usePreferred 
        ? `${preferredIpPrefix}${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
        : `${ipPrefixes[Math.floor(Math.random() * ipPrefixes.length)]}${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      device: usePreferred 
        ? preferredDevice 
        : devices[Math.floor(Math.random() * devices.length)],
      location: usePreferred 
        ? preferredLocation 
        : locations[Math.floor(Math.random() * locations.length)],
      successful: Math.random() > 0.05 // 5% failed login attempts
    });
  }
  
  // Sort by timestamp (newest first)
  return history.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

// Expanded sample users with reputation and login history
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
    reputation: "excellent", // Great reputation
    loginHistory: generateLoginHistory("1", 15),
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
    reputation: "good",
    loginHistory: generateLoginHistory("2", 12),
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
    reputation: "average",
    loginHistory: generateLoginHistory("3", 10),
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
    reputation: "good",
    loginHistory: generateLoginHistory("4", 8),
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
    reputation: "excellent",
    loginHistory: generateLoginHistory("5", 15),
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
    reputation: "good",
    loginHistory: generateLoginHistory("6", 10),
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
    reputation: "average",
    loginHistory: generateLoginHistory("7", 12),
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
    reputation: "good", // Good reputation
    loginHistory: generateLoginHistory("8", 12),
  },
  {
    id: "admin",
    email: "admin@paykrypt.com",
    firstName: "System",
    lastName: "Administrator",
    balance: 0, // Admin doesn't have a balance
    accounts: [], // Admin doesn't have accounts
    createdAt: new Date(),
    updatedAt: new Date(),
    isAdmin: true, // Flag to identify admin users
    reputation: "excellent", // Admin has excellent reputation
    loginHistory: generateLoginHistory("admin", 20),
  },
  {
    id: "9",
    email: "marcus.green@example.com",
    firstName: "Marcus",
    lastName: "Green",
    balance: 8750.33,
    accounts: [
      {
        id: "901",
        userId: "9",
        type: "CHECKING",
        name: "Personal Account",
        balance: 4750.33,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "902",
        userId: "9",
        type: "SAVINGS",
        name: "Car Fund",
        balance: 4000.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    reputation: "average", // Average reputation
    loginHistory: generateLoginHistory("9", 8),
  },
  {
    id: "10",
    email: "alicia.rodriguez@example.com",
    firstName: "Alicia",
    lastName: "Rodriguez",
    balance: 14250.78,
    accounts: [
      {
        id: "1001",
        userId: "10",
        type: "CHECKING",
        name: "Primary Account",
        balance: 5250.78,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "1002",
        userId: "10",
        type: "SAVINGS",
        name: "Holiday Fund",
        balance: 4000.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "1003",
        userId: "10",
        type: "INVESTMENT",
        name: "Stock Portfolio",
        balance: 5000.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    reputation: "bad", // Bad reputation - multiple flagged transactions
    loginHistory: generateLoginHistory("10", 7),
  },
  {
    id: "11",
    email: "james.thompson@example.com",
    firstName: "James",
    lastName: "Thompson",
    balance: 22450.90,
    accounts: [
      {
        id: "1101",
        userId: "11",
        type: "CHECKING",
        name: "Business Account",
        balance: 12450.90,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "1102",
        userId: "11",
        type: "SAVINGS",
        name: "Expansion Fund",
        balance: 10000.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    reputation: "very bad", // Very bad reputation - many high-risk transactions
    loginHistory: generateLoginHistory("11", 25), // More logins - suspicious activity
  },
  {
    id: "12",
    email: "sophia.chen@example.com",
    firstName: "Sophia",
    lastName: "Chen",
    balance: 9875.45,
    accounts: [
      {
        id: "1201",
        userId: "12",
        type: "CHECKING",
        name: "Main Account",
        balance: 4875.45,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "1202",
        userId: "12",
        type: "SAVINGS",
        name: "Travel Fund",
        balance: 5000.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    reputation: "excellent", // Excellent reputation
    loginHistory: generateLoginHistory("12", 9),
  },
]

// Sample transactions with expanded dataset and improved flagging
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
    location: "San Francisco, USA",
    deviceId: "MacBook Pro",
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
    location: "Chicago, USA",
    deviceId: "iPhone 13",
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
  {
    id: uuidv4(),
    senderId: "10",
    receiverId: "11",
    senderAccountId: "1001",
    receiverAccountId: "1101",
    amount: 5750.0,
    description: "Investment opportunity",
    category: "Investment",
    status: "FLAGGED",
    riskScore: "HIGH",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 2)),
    location: "Moscow, Russia",
    deviceId: "Unknown Device",
  },
  {
    id: uuidv4(),
    senderId: "10",
    receiverId: "8",
    senderAccountId: "1001",
    receiverAccountId: "801",
    amount: 3250.0,
    description: "Emergency loan",
    category: "Loan",
    status: "FLAGGED",
    riskScore: "MEDIUM",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 4)),
    location: "New York, USA",
    deviceId: "Android Pixel 6",
  },
  {
    id: uuidv4(),
    senderId: "11",
    receiverId: null,
    senderAccountId: "1101",
    receiverAccountId: null,
    amount: 8900.0,
    description: "Consulting services",
    category: "Business",
    status: "FLAGGED",
    riskScore: "HIGH",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
    location: "Singapore",
    deviceId: "Samsung Galaxy",
  },
  {
    id: uuidv4(),
    senderId: "11",
    receiverId: "10",
    senderAccountId: "1101",
    receiverAccountId: "1001",
    amount: 7500.0,
    description: "Partnership agreement",
    category: "Business",
    status: "FLAGGED",
    riskScore: "HIGH",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 3)),
    location: "Hong Kong",
    deviceId: "Windows PC",
  },
  {
    id: uuidv4(),
    senderId: "9",
    receiverId: "11",
    senderAccountId: "901",
    receiverAccountId: "1101",
    amount: 2150.0,
    description: "Contract work",
    category: "Income",
    status: "FLAGGED",
    riskScore: "MEDIUM",
    createdAt: new Date(new Date().setHours(new Date().getHours() - 8)),
    location: "Berlin, Germany",
    deviceId: "iPad Pro",
  },
  {
    id: uuidv4(),
    senderId: "1",
    receiverId: "12",
    senderAccountId: "101",
    receiverAccountId: "1201",
    amount: 95.0,
    description: "Group dinner",
    category: "Food",
    status: "COMPLETED",
    riskScore: "LOW",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 3)),
    location: "New York, USA",
    deviceId: "iPhone 13",
  },
  {
    id: uuidv4(),
    senderId: "12",
    receiverId: "9",
    senderAccountId: "1201",
    receiverAccountId: "901",
    amount: 120.0,
    description: "Concert tickets",
    category: "Entertainment",
    status: "COMPLETED",
    riskScore: "LOW",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 5)),
    location: "San Francisco, USA",
    deviceId: "MacBook Pro",
  },
  {
    id: uuidv4(),
    senderId: "8",
    receiverId: "12",
    senderAccountId: "801",
    receiverAccountId: "1201",
    amount: 345.0,
    description: "Shared vacation expenses",
    category: "Travel",
    status: "COMPLETED",
    riskScore: "LOW",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 7)),
    location: "London, UK",
    deviceId: "iPhone 13",
  },
  {
    id: uuidv4(),
    senderId: "1",
    receiverId: "9",
    senderAccountId: "101",
    receiverAccountId: "901",
    amount: 75.0,
    description: "New merchant payment",
    category: "Shopping",
    status: "COMPLETED",
    riskScore: "LOW",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 2)),
    location: "Chicago, USA",
    deviceId: "iPhone 13",
  },
  {
    id: uuidv4(),
    senderId: "2",
    receiverId: "11",
    senderAccountId: "201",
    receiverAccountId: "1101",
    amount: 4250.0,
    description: "Investment opportunity",
    category: "Investment",
    status: "PENDING",
    riskScore: "MEDIUM",
    createdAt: new Date(),
    location: "New York, USA",
    deviceId: "MacBook Pro",
  },
  {
    id: uuidv4(),
    senderId: "3",
    receiverId: "10",
    senderAccountId: "301",
    receiverAccountId: "1001",
    amount: 3500.0,
    description: "Business partnership",
    category: "Business",
    status: "FLAGGED",
    riskScore: "HIGH",
    createdAt: new Date(new Date().setHours(new Date().getHours() - 3)),
    location: "Tokyo, Japan",
    deviceId: "Unknown Device",
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

// Function to calculate user reputation based on transaction history
const calculateUserReputation = (userId: string): "excellent" | "good" | "average" | "bad" | "very bad" => {
  const userTransactions = sampleTransactions.filter(
    t => t.senderId === userId || t.receiverId === userId
  );
  
  const flaggedCount = userTransactions.filter(t => t.status === "FLAGGED").length;
  const highRiskCount = userTransactions.filter(t => t.riskScore === "HIGH").length;
  const mediumRiskCount = userTransactions.filter(t => t.riskScore === "MEDIUM").length;
  
  // Calculate a reputation score
  const totalTransactions = userTransactions.length;
  if (totalTransactions === 0) return "average";
  
  const flaggedRatio = flaggedCount / totalTransactions;
  const highRiskRatio = highRiskCount / totalTransactions;
  
  if (highRiskRatio > 0.2 || flaggedRatio > 0.3) return "very bad";
  if (highRiskRatio > 0.1 || flaggedRatio > 0.2) return "bad";
  if (mediumRiskCount > 0 || flaggedRatio > 0) return "average";
  if (totalTransactions > 5 && flaggedCount === 0) return "excellent";
  return "good";
};

// Mock DB functions
export const db = {
  // User management
  getUsers: (): User[] => {
    return sampleUsers
  },

  getUserById: (id: string): User | undefined => {
    return sampleUsers.find((user) => user.id === id)
  },

  createUser: (userData: Omit<User, "id" | "createdAt" | "updatedAt" | "reputation" | "loginHistory">): User => {
    // In a real implementation, this would insert into a database
    const newUser: User = {
      id: uuidv4(),
      ...userData,
      reputation: "average", // New users start with average reputation
      loginHistory: [], // Start with empty login history
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

  getAllTransactions: (): Transaction[] => {
    return sampleTransactions
  },

  // Get spending categories for a user
  getUserSpendingCategories: (userId: string) => {
    // In a real implementation, this would retrieve from a database
    // For now, return the same categories for all users
    return userSpendingCategories
  },
  
  // Get user reputation
  getUserReputation: (userId: string) => {
    const user = sampleUsers.find(u => u.id === userId);
    return user?.reputation || "average";
  },
  
  // Record a new login event
  recordLoginEvent: (userId: string, ipAddress: string, device: string, location: string, successful: boolean) => {
    const user = sampleUsers.find(u => u.id === userId);
    if (user) {
      const newLogin: LoginEvent = {
        id: uuidv4(),
        userId,
        timestamp: new Date(),
        ipAddress,
        device,
        location,
        successful
      };
      
      user.loginHistory.unshift(newLogin); // Add to start of array (newest first)
      
      // Limit history size
      if (user.loginHistory.length > 50) {
        user.loginHistory = user.loginHistory.slice(0, 50);
      }
      
      return newLogin;
    }
    return null;
  },
  
  // Get user login history
  getUserLoginHistory: (userId: string) => {
    const user = sampleUsers.find(u => u.id === userId);
    return user?.loginHistory || [];
  }
}

// Mock auth service
export const authService = {
  currentUserId: "1", // Default to first user

  login: (email: string, password: string): User | null => {
    // In a real implementation, this would verify credentials
    const user = sampleUsers.find((user) => user.email === email)
    if (user) {
      authService.currentUserId = user.id
      
      // Record successful login (in a real app, would include more details)
      db.recordLoginEvent(
        user.id, 
        "127.0.0.1", // Sample IP
        "Web Browser", 
        "Unknown", 
        true
      );
      
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
