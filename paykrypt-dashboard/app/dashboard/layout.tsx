import type { ReactNode } from "react"
import DashboardSidebar from "@/components/dashboard-sidebar"
import { SidebarInset } from "@/components/ui/sidebar"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full overflow-hidden">
      <DashboardSidebar />
      <SidebarInset className="p-4 sm:p-6 overflow-x-auto min-w-0">
        {children}
      </SidebarInset>
    </div>
  )
}
