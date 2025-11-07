import { useChatHistory } from "@/lib/hooks"
import { useEffect, useRef } from "react"
import { Skeleton } from "./ui/skeleton"
import { motion } from "framer-motion"
import { Bot, User } from "lucide-react"

export default function ChatMessages() {
  // ✅ Ensure hook returns messages array only
  const { data: messages, isLoading, isError, refetch } = useChatHistory()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-20 flex-1 rounded-2xl" />
          </div>
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-center text-muted-foreground py-8">
        ⚠️ Couldn’t load chat.{" "}
        <button
          onClick={() => refetch()}
          className="underline hover:text-primary"
        >
          Try again
        </button>
      </div>
    )
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <p>No messages yet 🪄</p>
        <p className="text-sm">Start a conversation below 👇</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 pb-4">
      {messages.map((msg, idx) => (
        <motion.div
          key={msg._id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.03 }}
          className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
        >
          {msg.role === "assistant" && (
            <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
              <Bot className="h-5 w-5 text-white" />
            </div>
          )}

          <div
            className={`max-w-[70%] rounded-2xl px-4 py-3 ${
              msg.role === "user"
                ? "bg-primary text-primary-foreground"
                : "glass-card"
            }`}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              {msg.message}
            </p>
            <span className="text-xs opacity-70 mt-2 block text-right">
              {new Date(msg.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          {msg.role === "user" && (
            <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
              <User className="h-5 w-5 text-white" />
            </div>
          )}
        </motion.div>
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
