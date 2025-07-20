import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Chat, Message } from "@/types/chats"
import { v4 as uuidv4 } from "uuid"

interface ChatState {
  // Separate chat stores for different user hats
  adeptChats: Chat[]
  masterChats: Chat[]

  // Actions for adept hat
  getAdeptChatDataById: (id: string) => Chat | undefined
  findAdeptChatBySpecialistId: (specialistId: string) => Chat | undefined
  addAdeptChat: (chat: Chat) => void
  updateAdeptChat: (chatId: string, updates: Partial<Chat>) => void
  removeAdeptChat: (chatId: string) => void
  addMessageToAdeptChat: (chatId: string, message: Omit<Message, "id">) => void

  // Actions for master hat
  getMasterChatDataById: (id: string) => Chat | undefined
  findMasterChatBySpecialistId: (specialistId: string) => Chat | undefined
  addMasterChat: (chat: Chat) => void
  updateMasterChat: (chatId: string, updates: Partial<Chat>) => void
  removeMasterChat: (chatId: string) => void
  addMessageToMasterChat: (chatId: string, message: Omit<Message, "id">) => void

  // Utility actions
  clearAllChats: () => void
  getChatsByHat: (hat: "adept" | "master") => Chat[]
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      // Initial state
      adeptChats: [],
      masterChats: [],

      // Adept hat actions
      getAdeptChatDataById: (id: string) => {
        const chat = get().adeptChats.find((chat) => chat.id === id)
        // Return deep copy to avoid mutation issues
        return chat ? JSON.parse(JSON.stringify(chat)) : undefined
      },

      findAdeptChatBySpecialistId: (specialistId: string) => {
        const chat = get().adeptChats.find((chat) => chat.specialistId === specialistId)
        return chat ? JSON.parse(JSON.stringify(chat)) : undefined
      },

      addAdeptChat: (chat: Chat) => {
        set((state) => ({
          adeptChats: [...state.adeptChats, chat],
        }))
      },

      updateAdeptChat: (chatId: string, updates: Partial<Chat>) => {
        set((state) => ({
          adeptChats: state.adeptChats.map((chat) => (chat.id === chatId ? { ...chat, ...updates } : chat)),
        }))
      },

      removeAdeptChat: (chatId: string) => {
        set((state) => ({
          adeptChats: state.adeptChats.filter((chat) => chat.id !== chatId),
        }))
      },

      addMessageToAdeptChat: (chatId: string, message: Omit<Message, "id">) => {
        const newMessage: Message = {
          ...message,
          id: uuidv4(),
        }

        set((state) => ({
          adeptChats: state.adeptChats.map((chat) => {
            if (chat.id === chatId) {
              return {
                ...chat,
                messages: [...chat.messages, newMessage],
                timestamp: new Date(message.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                hasNew: true,
              }
            }
            return chat
          }),
        }))
      },

      // Master hat actions
      getMasterChatDataById: (id: string) => {
        const chat = get().masterChats.find((chat) => chat.id === id)
        return chat ? JSON.parse(JSON.stringify(chat)) : undefined
      },

      findMasterChatBySpecialistId: (specialistId: string) => {
        const chat = get().masterChats.find((chat) => chat.specialistId === specialistId)
        return chat ? JSON.parse(JSON.stringify(chat)) : undefined
      },

      addMasterChat: (chat: Chat) => {
        set((state) => ({
          masterChats: [...state.masterChats, chat],
        }))
      },

      updateMasterChat: (chatId: string, updates: Partial<Chat>) => {
        set((state) => ({
          masterChats: state.masterChats.map((chat) => (chat.id === chatId ? { ...chat, ...updates } : chat)),
        }))
      },

      removeMasterChat: (chatId: string) => {
        set((state) => ({
          masterChats: state.masterChats.filter((chat) => chat.id !== chatId),
        }))
      },

      addMessageToMasterChat: (chatId: string, message: Omit<Message, "id">) => {
        const newMessage: Message = {
          ...message,
          id: uuidv4(),
        }

        set((state) => ({
          masterChats: state.masterChats.map((chat) => {
            if (chat.id === chatId) {
              return {
                ...chat,
                messages: [...chat.messages, newMessage],
                timestamp: new Date(message.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                hasNew: true,
              }
            }
            return chat
          }),
        }))
      },

      // Utility actions
      clearAllChats: () => {
        set({
          adeptChats: [],
          masterChats: [],
        })
      },

      getChatsByHat: (hat: "adept" | "master") => {
        const state = get()
        return hat === "adept" ? state.adeptChats : state.masterChats
      },
    }),
    {
      name: "chat-store",
      partialize: (state) => ({
        adeptChats: state.adeptChats,
        masterChats: state.masterChats,
      }),
    },
  ),
)

// Convenience hooks for specific hat contexts
export const useAdeptChats = () => {
  const store = useChatStore()
  return {
    chats: store.adeptChats,
    getChatDataById: store.getAdeptChatDataById,
    findChatBySpecialistId: store.findAdeptChatBySpecialistId,
    addChat: store.addAdeptChat,
    updateChat: store.updateAdeptChat,
    removeChat: store.removeAdeptChat,
    addMessage: store.addMessageToAdeptChat,
  }
}

export const useMasterChats = () => {
  const store = useChatStore()
  return {
    chats: store.masterChats,
    getChatDataById: store.getMasterChatDataById,
    findChatBySpecialistId: store.findMasterChatBySpecialistId,
    addChat: store.addMasterChat,
    updateChat: store.updateMasterChat,
    removeChat: store.removeMasterChat,
    addMessage: store.addMessageToMasterChat,
  }
}
