"use client"

import { UserProvider } from "@/contexts/user-context"
import DashboardSidebar from "@/components/dashboard-sidebar"
import { UserAccountMenu } from "@/components/user-account-menu"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <div className="flex-1 overflow-auto p-8">
          <div className="flex items-center gap-4">
            <UserAccountMenu />
          </div>
          {children}
        </div>
      </div>
    </UserProvider>
  )
}
