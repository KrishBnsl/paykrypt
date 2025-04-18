"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  CreditCard,
  DollarSign,
  Home,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
  Shield,
  User,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { useUser } from "@/contexts/user-context"
import { useEffect, useState } from "react"

export default function DashboardSidebar() {
  const pathname = usePathname()
  const { isAdmin } = useUser()
  const [isAdminRoute, setIsAdminRoute] = useState(false)
  
  // Detect if we're in an admin route and update state
  useEffect(() => {
    setIsAdminRoute(pathname?.startsWith('/admin') || false)
  }, [pathname])
  
  // Force admin sidebar when on admin routes, otherwise follow user role
  const showAdminUI = isAdminRoute || isAdmin
  const showUserUI = !isAdminRoute && !isAdmin

  return (
    <div className="h-screen">
      <SidebarProvider defaultOpen={true}>
        <Sidebar>
          <SidebarHeader className="flex h-14 items-center px-4">
            <Link href={showAdminUI ? "/admin/dashboard" : "/dashboard"} className="flex items-center gap-2 font-bold text-xl">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                <Shield className="h-4 w-4" />
              </div>
              PayKrypt {showAdminUI && "(Admin)"}
            </Link>
          </SidebarHeader>
          <SidebarSeparator />
          
          {/* Regular user navigation */}
          {showUserUI && (
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <Link href="/dashboard" className={pathname === "/dashboard" ? "text-primary font-medium" : ""}>
                    <SidebarMenuButton>
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link href="/dashboard/accounts" className={pathname === "/dashboard/accounts" ? "text-primary font-medium" : ""}>
                    <SidebarMenuButton>
                      <Home className="h-4 w-4" />
                      <span>Accounts</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link href="/dashboard/payments" className={pathname === "/dashboard/payments" ? "text-primary font-medium" : ""}>
                    <SidebarMenuButton>
                      <DollarSign className="h-4 w-4" />
                      <span>Payments</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link href="/dashboard/cards" className={pathname === "/dashboard/cards" ? "text-primary font-medium" : ""}>
                    <SidebarMenuButton>
                      <CreditCard className="h-4 w-4" />
                      <span>Cards</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link href="/dashboard/transactions" className={pathname === "/dashboard/transactions" ? "text-primary font-medium" : ""}>
                    <SidebarMenuButton>
                      <BarChart3 className="h-4 w-4" />
                      <span>Transactions</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link href="/dashboard/ai-assistant" className={pathname === "/dashboard/ai-assistant" ? "text-primary font-medium" : ""}>
                    <SidebarMenuButton>
                      <MessageSquare className="h-4 w-4" />
                      <span>AI Assistant</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          )}

          {/* Admin navigation */}
          {showAdminUI && (
            <SidebarContent>
              <SidebarHeader>
                <div className="px-4 py-2 font-semibold">Admin</div>
              </SidebarHeader>
              <SidebarMenu>
                <SidebarMenuItem>
                  <Link href="/admin/dashboard" className={pathname === "/admin/dashboard" ? "text-primary font-medium" : ""}>
                    <SidebarMenuButton>
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link href="/admin/transactions" className={pathname === "/admin/transactions" ? "text-primary font-medium" : ""}>
                    <SidebarMenuButton>
                      <BarChart3 className="h-4 w-4" />
                      <span>All Transactions</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          )}

          <SidebarSeparator />
          
          {/* Footer is the same for both admin and regular users */}
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/" className="text-muted-foreground hover:text-foreground">
                  <SidebarMenuButton>
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
      </SidebarProvider>
    </div>
  )
}
