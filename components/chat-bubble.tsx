"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle, X } from "lucide-react"
import Link from "next/link"

export function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false)

  if (isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <div className="rounded-lg border border-border bg-card p-4 shadow-lg">
          <div className="flex items-center justify-between gap-4 mb-3">
            <p className="text-sm font-medium text-card-foreground">Need insights?</p>
            <Button size="icon" variant="ghost" onClick={() => setIsOpen(false)} className="h-6 w-6">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Visit our AI Hub for predictive analytics and intelligent assistance.
          </p>
          <Link href="/ai-hub">
            <Button className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90">Open AI Hub</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <Button
      size="icon"
      onClick={() => setIsOpen(true)}
      className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-br from-primary to-accent shadow-lg hover:opacity-90"
    >
      <MessageCircle className="h-6 w-6 text-primary-foreground" />
    </Button>
  )
}
