"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Bot, User, ArrowLeft, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import UserSelector from "../user-selector"
import { useUser } from "@/contexts/user-context"

// Define FAQ data types
type FAQData = {
  [category: string]: {
    [question: string]: string;
  };
};

// FAQ data structure similar to the Python version
const faqData: FAQData = {
  "Account Services": {
    "How to open a savings account?": "You can open a savings account online through the PayKrypt app or by visiting any of our partner branches with valid KYC documents.",
    "What documents are needed for account opening?": "You need to submit a valid ID proof (government-issued ID), address proof, and complete our secure biometric verification process.",
    "How do I check my account balance?": "You can check your balance by logging into the dashboard, using the PayKrypt mobile app, or setting up balance alerts to your email or phone."
  },
  "Cards & Payments": {
    "How to apply for a digital card?": "Log in to your dashboard, go to the 'Cards' section, and select 'Apply for Digital Card'. Our quantum-secure verification will process your request.",
    "How to block a lost card?": "You can instantly freeze your card from the dashboard or mobile app. Additionally, our AI system may proactively detect and flag suspicious activities.",
    "What payment methods do you support?": "We support all major payment methods including bank transfers, credit/debit cards, UPI, and selected cryptocurrencies with our quantum-secure protection."
  },
  "Security & Protection": {
    "How does your fraud detection work?": "Our AI-powered fraud detection uses CNN and LSTM models to analyze transaction patterns in real-time, flagging unusual activities before they become problematic.",
    "What is quantum-secure encryption?": "Quantum-secure encryption uses post-quantum cryptographic algorithms that protect your data against attacks from both conventional and quantum computers.",
    "How do I enable two-factor authentication?": "Go to your profile settings and select 'Security'. You can enable biometric verification, authenticator apps, or SMS verification for an additional layer of security."
  },
  "Transactions": {
    "Why was my transaction flagged?": "Transactions are flagged when our AI system detects unusual patterns or potential fraud risks. This is a protective measure to keep your account secure.",
    "How long do transfers take to process?": "Most transfers are processed instantly. International transfers may take 1-2 business days, though our AI system continuously works to optimize transfer speeds.",
    "Are there any transaction limits?": "Default daily limits are set for security. You can view and request changes to your limits from the 'Profile' section of your dashboard."
  },
  "AI Assistant Help": {
    "What can the AI Assistant help with?": "I can help with account information, transaction insights, security recommendations, and general banking questions using my sophisticated understanding of financial patterns.",
    "Is my conversation with the AI secure?": "Yes, all conversations are encrypted end-to-end and processed through our secure federated learning system that never exposes your personal data.",
    "How accurate is the AI's information?": "Our AI system is regularly updated with the latest information and has a 98.7% accuracy rate. For critical financial decisions, we always recommend confirming with a human specialist."
  }
}

export default function AIAssistantPage() {
  const { currentUser, loading } = useUser()
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string; isOption?: boolean }>>([])
  const [currentMenu, setCurrentMenu] = useState<"main" | "category" | "answer">("main")
  const [currentCategory, setCurrentCategory] = useState<string>("")
  const [currentQuestion, setCurrentQuestion] = useState<string>("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize the chatbot with a welcome message
  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: `Hello${currentUser ? ` ${currentUser.firstName}` : ""}! I'm your AI banking assistant for PayKrypt. How can I help you today?`,
      },
      {
        role: "assistant",
        content: "Please select a category:",
        isOption: true,
      },
    ])
    setCurrentMenu("main")
  }, [currentUser])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Generate options based on current menu level
  const renderOptions = () => {
    if (currentMenu === "main") {
      return Object.keys(faqData).map((category) => ({
        text: category,
        action: () => selectCategory(category),
      }));
    } else if (currentMenu === "category" && currentCategory) {
      return Object.keys(faqData[currentCategory]).map((question) => ({
        text: question,
        action: () => selectQuestion(question),
      }));
    }
    return [];
  };

  // Handle category selection
  const selectCategory = (category: string) => {
    setMessages((prev) => [
      ...prev,
      { role: "user", content: category },
      { 
        role: "assistant", 
        content: `You selected: ${category}. What would you like to know about this topic?`,
      },
      {
        role: "assistant",
        content: "Please select a question:",
        isOption: true,
      }
    ]);
    setCurrentCategory(category);
    setCurrentMenu("category");
  };

  // Handle question selection
  const selectQuestion = (question: string) => {
    const answer = faqData[currentCategory][question];
    setMessages((prev) => [
      ...prev,
      { role: "user", content: question },
      { 
        role: "assistant", 
        content: answer,
      },
      {
        role: "assistant",
        content: "Would you like to know anything else?",
        isOption: true,
      }
    ]);
    setCurrentQuestion(question);
    setCurrentMenu("answer");
  };

  // Go back to the main menu
  const goToMainMenu = () => {
    setMessages((prev) => [
      ...prev,
      { 
        role: "assistant", 
        content: "What else would you like to know about?",
      },
      {
        role: "assistant",
        content: "Please select a category:",
        isOption: true,
      }
    ]);
    setCurrentCategory("");
    setCurrentQuestion("");
    setCurrentMenu("main");
  };

  // Go back to the category menu
  const goToCategoryMenu = () => {
    setMessages((prev) => [
      ...prev,
      { 
        role: "assistant", 
        content: `Back to ${currentCategory} options.`,
      },
      {
        role: "assistant",
        content: "Please select a question:",
        isOption: true,
      }
    ]);
    setCurrentQuestion("");
    setCurrentMenu("category");
  };

  if (loading || !currentUser) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto max-w-4xl py-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">AI Banking Assistant</h1>
        <UserSelector />
      </div>

      <Card className="h-[calc(100vh-12rem)]">
        <CardHeader>
          <CardTitle>PayKrypt AI Assistant</CardTitle>
          <CardDescription>Interactive menu-based support with quantum-secure encryption</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-20rem)] px-4">
            <div className="space-y-4 pt-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                    <Avatar className="h-8 w-8">
                      {message.role === "assistant" ? (
                        <>
                          <AvatarImage src="/placeholder.svg?height=32&width=32" />
                          <AvatarFallback>
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </>
                      ) : (
                        <>
                          <AvatarImage src="/placeholder.svg?height=32&width=32" />
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </>
                      )}
                    </Avatar>
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <p className="whitespace-pre-line">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              {currentMenu !== "answer" && (
                <div className="grid grid-cols-1 gap-2 py-2">
                  {renderOptions().map((option, idx) => (
                    <Button 
                      key={idx} 
                      variant="outline" 
                      className="justify-start text-left h-auto py-3 px-4" 
                      onClick={option.action}
                    >
                      <span className="mr-2">{idx + 1}.</span> {option.text}
                    </Button>
                  ))}
                </div>
              )}
              {currentMenu === "answer" && (
                <div className="flex gap-2 py-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={goToCategoryMenu}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to questions
                  </Button>
                  <Button 
                    variant="default" 
                    className="flex-1"
                    onClick={goToMainMenu}
                  >
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Main menu
                  </Button>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="border-t p-4">
          <div className="w-full text-center text-sm text-muted-foreground">
            {currentMenu === "main" ? (
              "Select a category to get started"
            ) : currentMenu === "category" ? (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={goToMainMenu}
                  className="text-xs"
                >
                  <ArrowLeft className="mr-1 h-3 w-3" />
                  Back to main menu
                </Button>
              </>
            ) : (
              "Select an option to continue"
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
