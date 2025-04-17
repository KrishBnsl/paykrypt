"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { db } from "@/lib/db"
import { useUser } from "@/contexts/user-context"

export default function UserSelector() {
  const [users, setUsers] = useState<any[]>([])
  const { currentUser, setCurrentUser } = useUser()

  useEffect(() => {
    // Fetch all users
    const allUsers = db.getUsers()
    setUsers(allUsers)
  }, [])

  const handleUserChange = (userId: string) => {
    // Update the user in context which will propagate to all components
    setCurrentUser(userId)
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
            <SelectItem key={user.id} value={user.id}>
              {user.firstName} {user.lastName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
