"use client"

import { AdminSidebar } from "@/components/admin-sidebar"
import { Shield } from "lucide-react"
import Link from "next/link"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r border-sidebar-border bg-sidebar-background lg:block">
          <div className="sticky top-0 h-screen flex flex-col overflow-hidden">
            <div className="flex h-14 items-center border-b border-sidebar-border px-4">
              <Link href="/admin/dashboard" className="flex items-center gap-2 font-bold text-xl">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  <Shield className="h-4 w-4" />
                </div>
                PayKrypt Admin
              </Link>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <AdminSidebar />
            </div>
          </div>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
