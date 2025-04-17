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

export default function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <div className="h-screen">
      <SidebarProvider defaultOpen={true}>
        <Sidebar>
          <SidebarHeader className="flex h-14 items-center px-4">
            <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                <Shield className="h-4 w-4" />
              </div>
              PayKrypt
            </Link>
          </SidebarHeader>
          <SidebarSeparator />
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
          <SidebarSeparator />
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/dashboard/settings" className={pathname === "/dashboard/settings" ? "text-primary font-medium" : ""}>
                  <SidebarMenuButton>
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/dashboard/profile" className={pathname === "/dashboard/profile" ? "text-primary font-medium" : ""}>
                  <SidebarMenuButton>
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/">
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
