"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { authService, db } from "@/lib/db"

export default function UserSelector() {
  const [users, setUsers] = useState<any[]>([])
  const [currentUserId, setCurrentUserId] = useState<string>("")
  const router = useRouter()

  useEffect(() => {
    // Fetch all users
    const allUsers = db.getUsers()
    setUsers(allUsers)

    // Set current user
    const currentUser = authService.getCurrentUser()
    if (currentUser) {
      setCurrentUserId(currentUser.id)
    }
  }, [])

  const handleUserChange = (userId: string) => {
    // Set the current user in the auth service
    authService.setCurrentUser(userId)
    setCurrentUserId(userId)

    // Refresh the page to reflect the new user's data
    router.refresh()
  }

  return (
    <div className="flex items-center gap-2 py-2">
      <span className="text-sm font-medium">Demo User:</span>
      <Select value={currentUserId} onValueChange={handleUserChange}>
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
