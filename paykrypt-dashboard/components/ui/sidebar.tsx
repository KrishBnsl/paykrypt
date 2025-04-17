"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Sidebar context for managing state
const SidebarContext = React.createContext<{
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  mobile: boolean
}>({
  open: true,
  setOpen: () => undefined,
  mobile: false,
})

export function useSidebar() {
  return React.useContext(SidebarContext)
}

export const SidebarProvider = ({ 
  children,
  defaultOpen = true,
  mobileBreakpoint = 768 
}: { 
  children: React.ReactNode
  defaultOpen?: boolean
  mobileBreakpoint?: number
}) => {
  const [open, setOpen] = React.useState(defaultOpen)
  const [mobile, setMobile] = React.useState(false)
  
  React.useEffect(() => {
    const checkMobile = () => {
      setMobile(window.innerWidth < mobileBreakpoint)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [mobileBreakpoint])
  
  return (
    <SidebarContext.Provider value={{ open, setOpen, mobile }}>
      {children}
    </SidebarContext.Provider>
  )
}

const sidebarVariants = cva(
  "flex flex-col border-r bg-background transition-all duration-300",
  {
    variants: {
      variant: {
        default: "w-64",
        narrow: "w-16",
        inset: "flex-1 border-r-0",
      },
      open: {
        true: "translate-x-0",
        false: "-translate-x-full"
      }
    },
    defaultVariants: {
      variant: "default",
      open: true
    },
  }
)

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof sidebarVariants> {
  variant?: "default" | "narrow" | "inset"
}

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, variant, open, ...props }, ref) => {
    const { open: contextOpen } = useSidebar()
    const isOpen = open !== undefined ? open : contextOpen
    
    return (
      <div
        ref={ref}
        className={cn(sidebarVariants({ variant, open: isOpen }), className)}
        {...props}
      />
    )
  }
)
Sidebar.displayName = "Sidebar"

export const SidebarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex h-14 items-center border-b px-4", className)}
      {...props}
    />
  )
)
SidebarHeader.displayName = "SidebarHeader"

export const SidebarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex-1 overflow-auto", className)}
      {...props}
    />
  )
)
SidebarContent.displayName = "SidebarContent"

export const SidebarFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center border-t p-4", className)}
      {...props}
    />
  )
)
SidebarFooter.displayName = "SidebarFooter"

export const SidebarInset = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex-1 overflow-auto", className)}
      {...props}
    />
  )
)
SidebarInset.displayName = "SidebarInset"

export const SidebarTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    const { setOpen } = useSidebar()
    
    return (
      <button
        ref={ref}
        onClick={() => setOpen(prev => !prev)}
        className={cn("inline-flex items-center justify-center rounded-md p-2 text-muted-foreground", className)}
        {...props}
      />
    )
  }
)
SidebarTrigger.displayName = "SidebarTrigger"

// Additional components with simpler implementations
export const SidebarMenu = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-1 px-2 py-1", className)} {...props} />
)

export const SidebarMenuItem = ({ className, active, ...props }: React.HTMLAttributes<HTMLDivElement> & { active?: boolean }) => (
  <div 
    className={cn(
      "flex cursor-pointer items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
      active ? "bg-accent text-accent-foreground" : "hover:bg-accent/50", 
      className
    )} 
    {...props} 
  />
)

export const SidebarMenuButton = ({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button 
    className={cn(
      "flex w-full cursor-pointer items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent/50", 
      className
    )} 
    {...props} 
  />
)

export const SidebarSeparator = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mx-2 my-1 h-px bg-border", className)} {...props} />
)

export const SidebarGroup = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("px-2 py-1", className)} {...props} />
)

export const SidebarGroupLabel = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("px-3 py-1 text-xs font-medium text-muted-foreground", className)} {...props} />
)

export const SidebarRail = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("w-16 border-r bg-background", className)} {...props} />
)

// Export the remaining components with simple implementations
export const SidebarGroupContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("space-y-1", className)} {...props} />
)

export const SidebarGroupAction = ({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button className={cn("inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent", className)} {...props} />
)

export const SidebarInput = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input className={cn("h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm", className)} {...props} />
)

export const SidebarMenuAction = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("ml-auto flex items-center", className)} {...props} />
)

export const SidebarMenuBadge = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("ml-auto flex h-6 items-center rounded-full bg-primary px-2 text-xs text-primary-foreground", className)} {...props} />
)

export const SidebarMenuSkeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("h-9 w-full animate-pulse rounded-md bg-muted", className)} {...props} />
)

export const SidebarMenuSub = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("ml-4 space-y-1", className)} {...props} />
)

export const SidebarMenuSubButton = ({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button className={cn("flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent/50", className)} {...props} />
)

export const SidebarMenuSubItem = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex cursor-pointer items-center rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent/50", className)} {...props} />
)
