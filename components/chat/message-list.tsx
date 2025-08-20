import { MessageItem } from "./message-item"
import type { Chat, Message } from "@/types/chats"
import { Skeleton } from "@/components/ui/skeleton"

interface MessageListProps {
  chat: Chat | null
  onSpecialistClick: (id: string) => void
  onServiceClick: (id: string) => void
  onShare: (message: Message) => void
  onRegenerate: (message: Message) => void
  specialistId: string
  onTagSelection?: (tags: string[]) => void
  onPolicyAcceptance?: (accepted: boolean) => void
  onPersonalityAnswer?: (questionId: string, answer: string) => void
  onVersionAnswer: (questionId: string, answer: number) => void
  isMobile: boolean
}

export function MessageList({
  chat,
  onSpecialistClick,
  onServiceClick,
  onShare,
  onRegenerate,
  specialistId,
  onTagSelection,
  onPolicyAcceptance,
  onPersonalityAnswer,
  onVersionAnswer,
  isMobile,
}: MessageListProps) {
  if (!chat) return null

  return (
    <div>
      {chat.messages.map((message) => (
        <MessageItem
          key={message.id}
          specialistId={specialistId}
          message={message}
          onSpecialistClick={onSpecialistClick}
          onServiceClick={onServiceClick}
          onShare={onShare}
          onRegenerate={onRegenerate}
          isAI={chat.isAI || false}
          onTagSelection={onTagSelection}
          onPolicyAcceptance={onPolicyAcceptance}
          onPersonalityAnswer={onPersonalityAnswer}
          onVersionAnswer={onVersionAnswer}
          isMobile={isMobile}
        />
      ))}
    </div>
  )
}
