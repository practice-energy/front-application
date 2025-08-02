import { MessageItem } from "./message-item"
import type { Chat, Message } from "@/types/chats"
import { Skeleton } from "@/components/ui/skeleton"

interface MessageListProps {
  chat: Chat | null
  isLoading: boolean
  onSpecialistClick: (id: string) => void
  onServiceClick: (id: string) => void
  onShare: (message: Message) => void
  onRegenerate: (message: Message) => void
  specialistId: string
  onTagSelection?: (tags: string[]) => void
  onPolicyAcceptance?: (accepted: boolean) => void
  onPersonalityAnswer?: (answer: string) => void
  onAddMessage?: (message: Message) => void
}

export function MessageList({
  chat,
  isLoading,
  onSpecialistClick,
  onServiceClick,
  onShare,
  onRegenerate,
  specialistId,
  onTagSelection,
  onPolicyAcceptance,
  onPersonalityAnswer,
  onAddMessage,
}: MessageListProps) {
  if (!chat) return null

  return (
    <div className="space-y-6">
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
          onAddMessage={onAddMessage}
        />
      ))}

      {isLoading && (
        <div className="flex justify-start">
          <div className="flex flex-col items-start max-w-4xl w-full">
            <div className="flex mb-1">
              <div className="flex ml-1">
                <Skeleton className="w-9 h-9 rounded-sm" />
                <div className="flex flex-col ml-3 justify-end">
                  <Skeleton className="h-4 w-12 mb-1" />
                  <Skeleton className="h-3 w-8" />
                </div>
              </div>
            </div>
            <div className="flex-1 min-w-0 w-full">
              <div className="flex justify-start">
                <div className="bg-white shadow-md shadow-violet-50 px-3 py-3 rounded-sm">
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
