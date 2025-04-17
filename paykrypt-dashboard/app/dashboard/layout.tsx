"use client"

import { UserProvider } from "@/contexts/user-context"
import DashboardSidebar from "@/components/dashboard-sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </div>
    </UserProvider>
  )
}
