"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/contexts/user-context"
import DashboardSidebar from "@/components/dashboard-sidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, isAdmin, loading } = useUser()
  const router = useRouter()

  useEffect(() => {
    // Only redirect if we're certain the user isn't an admin
    if (!loading && currentUser && !isAdmin) {
      router.push("/dashboard")
    }
  }, [currentUser, loading, router, isAdmin])

  // Always render children without blocking on loading state
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}
