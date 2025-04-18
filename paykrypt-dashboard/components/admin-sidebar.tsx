"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Settings, 
  AlertTriangle, 
  BarChart,
  Shield,
  ClipboardList,
  Bell
} from "lucide-react"
import { cn } from "@/lib/utils"
import { db } from "@/lib/db"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"

export function AdminSidebar() {
  const pathname = usePathname()
  const [flaggedCount, setFlaggedCount] = useState(0)

  // Get count of flagged transactions in real-time
  useEffect(() => {
    interface Transaction {
      riskScore: string;
      status: string;
    }
    
    const getFlaggedCount = () => {
      try {
        let transactions: Transaction[] = []
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
  }, [])

  const navItems = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Transactions",
      href: "/admin/transactions",
      icon: CreditCard,
    },
    {
      title: "Flagged Transactions",
      href: "/admin/flagged-transactions",
      icon: AlertTriangle,
      badge: flaggedCount > 0 ? flaggedCount : null,
      badgeVariant: "destructive" as const
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      title: "Analytics",
      href: "/admin/analytics",
      icon: BarChart,
    },
    {
      title: "Security",
      href: "/admin/security",
      icon: Shield,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ]

  return (
    <div className="group flex flex-col gap-4 py-2">
      <nav className="grid gap-1 px-2">
        {navItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname === item.href ? "bg-accent text-accent-foreground" : "transparent"
            )}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
            {item.badge && (
              <Badge variant={item.badgeVariant} className="ml-auto">
                {item.badge}
              </Badge>
            )}
          </Link>
        ))}
      </nav>
    </div>
  )
}
