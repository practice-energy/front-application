"use client"

import { useEffect } from "react"
import { getVersionQuestions, createVersionMessage } from "@/components/become-specialist/messages"
import { MessageItem } from "@/components/chat/MessageItem"
import { addMessageToChat } from "@/utils/chatUtils"

const SearchPage = ({ becomeSpecialistState, chat, chatId }) => {
  // Add first version question when transitioning to step 3
  useEffect(() => {
    if (becomeSpecialistState.step === 3 && becomeSpecialistState.v && chat) {
      const versionQuestions = getVersionQuestions(becomeSpecialistState.v)
      if (versionQuestions.length > 0) {
        // Check if first version question is already added
        const hasVersionMessage = chat.messages.some((msg) => msg.aiMessageType === "version-test")

        if (!hasVersionMessage) {
          setTimeout(() => {
            const firstVersionMessage = createVersionMessage(versionQuestions[0], 0)
            addMessageToChat(chatId, firstVersionMessage)
          }, 500)
        }
      }
    }
  }, [becomeSpecialistState.step, becomeSpecialistState.v, chat, chatId, addMessageToChat])

  return (
    <div>
      {chat.messages.map((message, index) => (
        <MessageItem key={index} message={message} onAddMessage={(message) => addMessageToChat(chatId, message)} />
      ))}
    </div>
  )
}

export default SearchPage
