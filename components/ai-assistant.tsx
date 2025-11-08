"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Sparkles, TrendingUp, Activity, AlertCircle, Trash2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useEffect, useRef, useState } from "react"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

const SUGGESTED_PROMPTS = [
  {
    category: "Forecasting",
    icon: TrendingUp,
    prompts: [
      "Predict malaria cases for next month across all LGAs",
      "Which facilities are at risk of high patient volume?",
    ],
  },
  {
    category: "Analysis",
    icon: Activity,
    prompts: ["Compare disease trends between OWO and AKOKO N.E", "What are the top health priorities this quarter?"],
  },
  {
    category: "Recommendations",
    icon: AlertCircle,
    prompts: [
      "Suggest resource allocation for high-burden facilities",
      "Generate policy brief on maternal health improvements",
    ],
  },
]

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm your AfricareAI Health Intelligence Assistant. I can analyze PHC data, forecast disease trends, and provide actionable recommendations. How can I help you today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!response.ok) throw new Error("Failed to get response")

      const data = await response.json()
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("[v0] Chat error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I apologize, but I encountered an error. Please try again.",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handlePromptClick = (prompt: string) => {
    setInput(prompt)
  }

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hello! I'm your AfricareAI Health Intelligence Assistant. I can analyze PHC data, forecast disease trends, and provide actionable recommendations. How can I help you today?",
      },
    ])
  }

  return (
    <Card className="flex h-[700px] flex-col border-border/50 bg-gradient-to-br from-card via-card to-card/80 shadow-xl backdrop-blur-sm">
      <CardHeader className="border-b border-border/50 bg-gradient-to-r from-purple-500/10 via-emerald-500/10 to-amber-500/10">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-emerald-500 shadow-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-foreground">AI Health Assistant</div>
              <div className="text-xs font-normal text-muted-foreground">Powered by GPT-4</div>
            </div>
          </CardTitle>
          {messages.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              className="text-muted-foreground hover:text-foreground"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4 overflow-hidden p-0">
        <ScrollArea className="flex-1 px-6 py-4" ref={scrollRef}>
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500 ${
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-emerald-500 to-teal-600"
                      : "bg-gradient-to-br from-purple-500 to-indigo-600"
                  } shadow-lg`}
                >
                  {message.role === "user" ? (
                    <span className="text-xs font-semibold text-white">You</span>
                  ) : (
                    <Sparkles className="h-4 w-4 text-white" />
                  )}
                </div>

                <div
                  className={`flex max-w-[80%] flex-col gap-2 ${message.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`rounded-2xl px-4 py-3 shadow-md ${
                      message.role === "user"
                        ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white"
                        : "border border-border/50 bg-card/80 backdrop-blur-sm"
                    }`}
                  >
                    <p
                      className={`text-sm leading-relaxed whitespace-pre-wrap ${message.role === "user" ? "text-white" : "text-foreground"}`}
                    >
                      {message.content}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div className="flex max-w-[80%] flex-col gap-2">
                  <div className="rounded-2xl border border-border/50 bg-card/80 px-4 py-3 shadow-md backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-purple-500"
                        style={{ animationDelay: "0ms" }}
                      />
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-emerald-500"
                        style={{ animationDelay: "150ms" }}
                      />
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-amber-500"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {messages.length === 1 && (
          <div className="border-t border-border/50 bg-gradient-to-b from-transparent to-muted/20 px-6 py-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Suggested Questions
            </p>
            <div className="space-y-3">
              {SUGGESTED_PROMPTS.map((category, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <category.icon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground">{category.category}</span>
                  </div>
                  <div className="grid gap-2">
                    {category.prompts.map((prompt, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="justify-start border-border/50 bg-card/50 text-left text-xs hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-foreground"
                        onClick={() => handlePromptClick(prompt)}
                      >
                        {prompt}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="border-t border-border/50 bg-muted/20 p-4">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about disease trends, forecasts, or policy recommendations..."
              className="min-h-[80px] resize-none border-border/50 bg-card/50 backdrop-blur-sm focus:border-emerald-500/50 focus:ring-emerald-500/20"
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !input.trim()}
              className="h-[80px] w-12 shrink-0 bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Press Enter to send, Shift+Enter for new line</p>
        </form>
      </CardContent>
    </Card>
  )
}
