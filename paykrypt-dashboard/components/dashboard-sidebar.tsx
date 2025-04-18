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
  AlertTriangle
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
import { db } from "@/lib/db"
import { Badge } from "@/components/ui/badge"

export default function DashboardSidebar() {
  const pathname = usePathname()
  const { currentUser, isAdmin } = useUser()
  const [isAdminRoute, setIsAdminRoute] = useState(false)
  const [flaggedCount, setFlaggedCount] = useState(0)
  
  // Detect if we're in an admin route and update state
  useEffect(() => {
    setIsAdminRoute(pathname?.startsWith('/admin') || false)
  }, [pathname])
  
  // Get count of flagged transactions in real-time
  useEffect(() => {
    // Only fetch flagged count for admin users
    if (!isAdmin) return
    
    const getFlaggedCount = () => {
      try {
        let transactions: { riskScore: string; status: string }[] = []
        if (typeof db.getAllTransactions === 'function') {
          transactions = db.getAllTransactions()
        } else if (typeof db.getTransactions === 'function') {
          transactions = db.getTransactions()
        }
        
        const flagged = transactions.filter(t => 
          t.riskScore === "HIGH" && t.status === "FLAGGED"
        ).length

        setFlaggedCount(flagged)
      } catch (error) {
        console.error("Error getting flagged count:", error)
      }
    }

    // Initial count
    getFlaggedCount()
    
    // Set up polling for real-time updates
    const interval = setInterval(getFlaggedCount, 3000)
    return () => clearInterval(interval)
  }, [isAdmin])
  
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
                      <CreditCard className="h-4 w-4" />
                      <span>All Transactions</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link 
                    href="/admin/flagged-transactions" 
                    className={pathname === "/admin/flagged-transactions" ? "text-primary font-medium" : ""}
                  >
                    <SidebarMenuButton>
                      <AlertTriangle className="h-4 w-4" />
                      <span>Flagged Transactions</span>
                      {flaggedCount > 0 && (
                        <Badge variant="destructive" className="ml-auto">
                          {flaggedCount}
                        </Badge>
                      )}
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link href="/admin/users" className={pathname === "/admin/users" ? "text-primary font-medium" : ""}>
                    <SidebarMenuButton>
                      <User className="h-4 w-4" />
                      <span>Users</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link href="/admin/analytics" className={pathname === "/admin/analytics" ? "text-primary font-medium" : ""}>
                    <SidebarMenuButton>
                      <BarChart3 className="h-4 w-4" />
                      <span>Analytics</span>
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
                <Link href="/admin/settings" className={pathname === "/admin/settings" ? "text-primary font-medium" : ""}>
                  <SidebarMenuButton>
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
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
