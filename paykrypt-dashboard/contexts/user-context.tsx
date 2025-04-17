"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { authService, db, type User } from "@/lib/db"

interface UserContextType {
  currentUser: User | null
  setCurrentUser: (userId: string) => void
  loading: boolean
}

const UserContext = createContext<UserContextType>({
  currentUser: null,
  setCurrentUser: () => {},
  loading: true
})

export const useUser = () => useContext(UserContext)

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize with current user from auth service
    const user = authService.getCurrentUser()
    setCurrentUser(user)
    setLoading(false)
  }, [])

  const handleSetCurrentUser = (userId: string) => {
    // Update auth service
    authService.setCurrentUser(userId)
    
    // Update context state
    const user = db.getUserById(userId)
    setCurrentUser(user)
  }

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser: handleSetCurrentUser, loading }}>
      {children}
    </UserContext.Provider>
  )
}
