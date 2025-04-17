"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BadgeCheck, CreditCard, Lock, PlusCircle, Shield } from "lucide-react"
import UserSelector from "../user-selector"
import { useUser } from "@/contexts/user-context"

export default function CardsPage() {
  const { currentUser, loading } = useUser()
  const [cards] = useState([
    {
      id: "card1",
      type: "Visa",
      number: "**** **** **** 4567",
      expiry: "05/25",
      status: "active",
      color: "bg-gradient-to-r from-blue-500 to-blue-700",
    },
    {
      id: "card2",
      type: "Mastercard",
      number: "**** **** **** 8901",
      expiry: "11/24",
      status: "active",
      color: "bg-gradient-to-r from-red-500 to-red-700",
    }
  ])

  if (loading || !currentUser) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Payment Cards</h1>
        <UserSelector />
      </div>

      <div className="grid gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Your Cards</h2>
          <Button size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Request New Card
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {cards.map((card) => (
            <Card key={card.id} className={`text-white overflow-hidden ${card.color}`}>
              <CardContent className="p-6">
                <div className="flex flex-col h-48 justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">PayKrypt</h3>
                      <p className="text-sm opacity-90">Premium</p>
                    </div>
                    <div>
                      <CreditCard className="h-8 w-8" />
                    </div>
                  </div>
                  
                  <div className="my-6">
                    <p className="text-lg tracking-wider font-mono">{card.number}</p>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs opacity-90">Card Holder</p>
                      <p className="font-medium">{currentUser.firstName} {currentUser.lastName}</p>
                    </div>
                    <div>
                      <p className="text-xs opacity-90">Expires</p>
                      <p className="font-medium">{card.expiry}</p>
                    </div>
                    <div>
                      <p className="uppercase font-bold">{card.type}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <Card>
            <CardHeader>
              <CardTitle>Request a New Card</CardTitle>
              <CardDescription>Apply for a virtual or physical card with advanced security features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <BadgeCheck className="h-5 w-5 text-primary mr-2" />
                  <p className="text-sm">Contactless payments supported</p>
                </div>
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-primary mr-2" />
                  <p className="text-sm">Enhanced fraud protection</p>
                </div>
                <div className="flex items-center">
                  <Lock className="h-5 w-5 text-primary mr-2" />
                  <p className="text-sm">Freeze/unfreeze anytime</p>
                </div>
              </div>
              <Button className="w-full">Apply Now</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
