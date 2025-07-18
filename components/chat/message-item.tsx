"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { format } from "date-fns"
import { useTranslations } from "next-intl"
import { Copy, Share, RotateCcw, ThumbsUp, ThumbsDown } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import { Light as SyntaxHighlighter } from "react-syntax-highlighter"
import js from "react-syntax-highlighter/dist/esm/languages/hljs/javascript"
import python from "react-syntax-highlighter/dist/esm/languages/hljs/python"
import bash from "react-syntax-highlighter/dist/esm/languages/hljs/bash"
import typescript from "react-syntax-highlighter/dist/esm/languages/hljs/typescript"
import jsx from "react-syntax-highlighter/dist/esm/languages/hljs/jsx"
import tsx from "react-syntax-highlighter/dist/esm/languages/hljs/tsx"
import css from "react-syntax-highlighter/dist/esm/languages/hljs/css"
import json from "react-syntax-highlighter/dist/esm/languages/hljs/json"
import sql from "react-syntax-highlighter/dist/esm/languages/hljs/sql"
import yaml from "react-syntax-highlighter/dist/esm/languages/hljs/yaml"
import markdown from "react-syntax-highlighter/dist/esm/languages/hljs/markdown"
import "react-syntax-highlighter/dist/esm/styles/hljs/github-light.js"
import "react-syntax-highlighter/dist/esm/styles/hljs/github-dark.js"
import { useTheme } from "next-themes"
import { Flame, Check } from "lucide-react"

SyntaxHighlighter.registerLanguage("javascript", js)
SyntaxHighlighter.registerLanguage("python", python)
SyntaxHighlighter.registerLanguage("bash", bash)
SyntaxHighlighter.registerLanguage("typescript", typescript)
SyntaxHighlighter.registerLanguage("jsx", jsx)
SyntaxHighlighter.registerLanguage("tsx", tsx)
SyntaxHighlighter.registerLanguage("css", css)
SyntaxHighlighter.registerLanguage("json", json)
SyntaxHighlighter.registerLanguage("sql", sql)
SyntaxHighlighter.registerLanguage("yaml", yaml)
SyntaxHighlighter.registerLanguage("markdown", markdown)

interface MessageItemProps {
  message: {
    id: string
    role: "user" | "assistant" | "system"
    content: string
    createdAt: Date
    isLiked?: boolean
    isDisliked?: boolean
    aiMessageType?: string
  }
  onLike?: (messageId: string) => void
  onDislike?: (messageId: string) => void
  onRegenerate?: (messageId: string) => void
}

const MessageItem: React.FC<MessageItemProps> = ({ message, onLike, onDislike, onRegenerate }) => {
  const t = useTranslations("Chat")
  const [isLiked, setIsLiked] = useState(message.isLiked || false)
  const [isDisliked, setIsDisliked] = useState(message.isDisliked || false)
  const messageRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const { theme } = useTheme()

  useEffect(() => {
    setIsLiked(message.isLiked || false)
    setIsDisliked(message.isDisliked || false)
  }, [message.isLiked, message.isDisliked])

  const handleCopy = () => {
    if (messageRef.current) {
      navigator.clipboard.writeText(messageRef.current.textContent || "")
      toast({
        title: t("messageCopied"),
      })
    }
  }

  const handleShare = () => {
    if (navigator.share && messageRef.current) {
      navigator
        .share({
          text: messageRef.current.textContent || "",
        })
        .then(() => {
          // console.log('Successful share');
        })
        .catch((error) => {
          console.log("Error sharing", error)
        })
    } else {
      toast({
        title: t("shareApiNotSupported"),
        description: t("copyInstead"),
      })
    }
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    setIsDisliked(false)
    if (onLike) {
      onLike(message.id)
    }
  }

  const handleDislike = () => {
    setIsDisliked(!isDisliked)
    setIsLiked(false)
    if (onDislike) {
      onDislike(message.id)
    }
  }

  const handleRegenerate = () => {
    if (onRegenerate) {
      onRegenerate(message.id)
    }
  }

  return (
    <div className="group relative flex items-start gap-3 py-6 first:pt-0 last:pb-0">
      <div className="relative">
        {message.role === "assistant" ? (
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary">
            <span className="text-sm font-semibold text-muted-foreground">AI</span>
          </div>
        ) : (
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary">
            <span className="text-sm font-semibold text-muted-foreground">
              {message.role === "user" ? "Вы" : message.role}
            </span>
          </div>
        )}
        <span className="absolute bottom-0 right-0 inline-flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
      </div>
      <div className="grid w-full gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold">{message.role === "assistant" ? "AI Ассистент" : "Вы"}</span>
            <span className="text-muted-foreground">{format(message.createdAt, "yyyy-MM-dd HH:mm:ss")}</span>
          </div>
        </div>
        <div ref={messageRef} className="prose dark:prose-invert w-full break-words">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "")
                return !inline && match ? (
                  <SyntaxHighlighter
                    language={match[1]}
                    PreTag="div"
                    style={
                      theme === "dark"
                        ? { 'code[class*="language-"]': { background: "#282c34 !important" } }
                        : undefined
                    }
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code {...props} className={className}>
                    {children}
                  </code>
                )
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {/* Action buttons - conditional based on message type */}
        {message.aiMessageType === "service" ? (
          <div className="flex items-center gap-3 mt-3">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300 rounded-lg px-4 py-2"
              onClick={() => {
                // Handle burn action
                console.log("Burn service clicked")
              }}
            >
              <Flame className="w-4 h-4" />
              Сжечь
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300 rounded-lg px-4 py-2"
              onClick={() => {
                // Handle confirm action
                console.log("Confirm service clicked")
              }}
            >
              <Check className="w-4 h-4" />
              Подтвердить
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Copy className="h-4 w-4" />
              <span className="sr-only">Копировать</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Share className="h-4 w-4" />
              <span className="sr-only">Поделиться</span>
            </Button>

            {message.role === "assistant" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRegenerate}
                className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <RotateCcw className="h-4 w-4" />
                <span className="sr-only">Регенерировать</span>
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ThumbsUp className={`h-4 w-4 ${isLiked ? "fill-current text-blue-500" : ""}`} />
              <span className="sr-only">Нравится</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleDislike}
              className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ThumbsDown className={`h-4 w-4 ${isDisliked ? "fill-current text-red-500" : ""}`} />
              <span className="sr-only">Не нравится</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default MessageItem
