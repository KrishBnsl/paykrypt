"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Shield, Mail, User, LockKeyhole } from "lucide-react"
import UserSelector from "../user-selector"
import { useUser } from "@/contexts/user-context"

export default function ProfilePage() {
  const { currentUser, loading } = useUser()
  const [editing, setEditing] = useState(false)
  
  if (loading || !currentUser) {
    return <div>Loading...</div>
  }

  // Get initials for avatar
  const initials = `${currentUser.firstName?.[0] || ''}${currentUser.lastName?.[0] || ''}`;
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <UserSelector />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Manage your personal details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center mb-6">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{currentUser.firstName} {currentUser.lastName}</h2>
              <p className="text-muted-foreground">{currentUser.email}</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First name</Label>
                  <Input id="first-name" defaultValue={currentUser.firstName} readOnly={!editing} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input id="last-name" defaultValue={currentUser.lastName} readOnly={!editing} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue={currentUser.email} readOnly={!editing} />
              </div>
              <Button onClick={() => setEditing(!editing)}>
                {editing ? "Save Changes" : "Edit Profile"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Account Security</CardTitle>
              <CardDescription>Protect your account with advanced security</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <LockKeyhole className="h-5 w-5 mr-2 text-primary" />
                    <div>
                      <h4 className="text-sm font-medium">Password Protection</h4>
                      <p className="text-xs text-muted-foreground">Last updated 30 days ago</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">Change</Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-primary" />
                    <div>
                      <h4 className="text-sm font-medium">Two-Factor Authentication</h4>
                      <p className="text-xs text-muted-foreground">Enabled</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">Manage</Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-primary" />
                    <div>
                      <h4 className="text-sm font-medium">Email Verification</h4>
                      <p className="text-xs text-muted-foreground">Verified</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">Verify</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Account Status</CardTitle>
              <CardDescription>Your current account information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Member Since</span>
                  <span className="text-sm font-medium">January 2023</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Account Type</span>
                  <span className="text-sm font-medium">Premium</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Account Number</span>
                  <span className="text-sm font-medium">****{currentUser.id.slice(-4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Accounts</span>
                  <span className="text-sm font-medium">{currentUser.accounts.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
