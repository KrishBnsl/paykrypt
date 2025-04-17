"use client"

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react"
import { authService, db, type User } from "@/lib/db"

interface UserContextType {
  currentUser: User | null
  loading: boolean
  refreshUser: () => void
}

const UserContext = createContext<UserContextType>({
  currentUser: null,
  loading: true,
  refreshUser: () => {}
})

export function useUser() {
  const context = useContext(UserContext)

  if (!context) {
    throw new Error("useUser must be used within a UserProvider")
  }

  // Add isAdmin flag for easy access
  return {
    ...context,
    isAdmin: context.currentUser?.isAdmin || false
  }
}

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Function to refresh the current user
  const refreshUser = useCallback(() => {
    setLoading(true)
    const user = authService.getCurrentUser()
    setCurrentUser(user)
    setLoading(false)
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  return (
    <UserContext.Provider value={{ currentUser, loading, refreshUser }}>
      {children}
    </UserContext.Provider>
  )
}
