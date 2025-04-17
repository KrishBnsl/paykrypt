"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { db, authService } from "@/lib/db"
import { useUser } from "@/contexts/user-context"

export default function UserSelector() {
  const [users, setUsers] = useState<any[]>([])
  const { currentUser, refreshUser } = useUser()

  useEffect(() => {
    // Fetch all users
    const allUsers = db.getUsers()
    setUsers(allUsers)
  }, [])

  const handleUserChange = (userId: string) => {
    // Update the current user in the auth service
    authService.setCurrentUser(userId)
    // Refresh the user context to update all components
    refreshUser()
  }

  return (
    <div className="flex items-center gap-2 py-2">
      <span className="text-sm font-medium">Demo User:</span>
      <Select value={currentUser?.id} onValueChange={handleUserChange}>
        <SelectTrigger className="w-[220px]">
          <SelectValue placeholder="Select user" />
        </SelectTrigger>
        <SelectContent>
          {users.map((user) => (
            // Only include the admin user for demo purposes
            <SelectItem key={user.id} value={user.id}>
              {user.firstName} {user.lastName} {user.isAdmin ? " (Admin)" : ""}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
