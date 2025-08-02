import { create } from "zustand"
import { persist } from "zustand/middleware"
import { v4 as uuidv4 } from "uuid"
import type { Chat, Message } from "@/types/chats"

import { mockChatData } from "@/services/mock-chat"

interface BecomeSpecialistState {
  step: 1 | 2 | 3 | 4
  selectedTags: string[]
  policyAccepted: boolean
  personalityAnswers: Record<string, string> // questionId -> answer
}

interface ChatState {
  // Separate chats for different user hats
  adeptChats: Chat[]
  masterChats: Chat[]

  // Become specialist state
  becomeSpecialistState: BecomeSpecialistState

  // Become specialist functions
  setBecomeSpecialistStep: (step: 1 | 2 | 3 | 4) => void
  setSelectedTags: (tags: string[]) => void
  setPolicyAccepted: (accepted: boolean) => void
  setPersonalityAnswer: (questionId: string, answer: string) => void
  resetBecomeSpecialistState: () => void
  getBecomeSpecialistState: () => BecomeSpecialistState

  // Adept hat functions
  getAdeptChatDataById: (id: string) => Chat | undefined
  findAdeptChatBySpecialistId: (specialistId: string) => Chat | undefined
  addAdeptChat: (chat: Chat) => void
  updateAdeptChat: (chatId: string, updates: Partial<Chat>) => void
  removeAdeptChat: (chatId: string) => void
  addMessageToAdeptChat: (chatId: string, message: Omit<Message, "id">) => Chat | undefined
  clearAdeptChats: () => void

  // Master hat functions
  getMasterChatDataById: (id: string) => Chat | undefined
  findMasterChatBySpecialistId: (specialistId: string) => Chat | undefined
  addMasterChat: (chat: Chat) => void
  updateMasterChat: (chatId: string, updates: Partial<Chat>) => void
  removeMasterChat: (chatId: string) => void
  addMessageToMasterChat: (chatId: string, message: Omit<Message, "id">) => Chat | undefined
  clearMasterChats: () => void
}

const deepCopy = (obj: any): any => JSON.parse(JSON.stringify(obj))

const initialBecomeSpecialistState: BecomeSpecialistState = {
  step: 1,
  selectedTags: [],
  policyAccepted: false,
  personalityAnswers: {},
}

export const useChatStore = create(
  persist(
    (set, get) => ({
      adeptChats: mockChatData,
      masterChats: [],
      becomeSpecialistState: initialBecomeSpecialistState,

      // Become specialist functions
      setBecomeSpecialistStep: (step: 1 | 2 | 3 | 4) => {
        set((state) => ({
          becomeSpecialistState: {
            ...state.becomeSpecialistState,
            step,
          },
        }))
      },

      setSelectedTags: (tags: string[]) => {
        set((state) => ({
          becomeSpecialistState: {
            ...state.becomeSpecialistState,
            selectedTags: tags,
          },
        }))
      },

      setPolicyAccepted: (accepted: boolean) => {
        set((state) => ({
          becomeSpecialistState: {
            ...state.becomeSpecialistState,
            policyAccepted: accepted,
          },
        }))
      },

      setPersonalityAnswer: (questionId: string, answer: string) => {
        set((state) => ({
          becomeSpecialistState: {
            ...state.becomeSpecialistState,
            personalityAnswers: {
              ...state.becomeSpecialistState.personalityAnswers,
              [questionId]: answer,
            },
          },
        }))
      },

      resetBecomeSpecialistState: () => {
        set({ becomeSpecialistState: initialBecomeSpecialistState })
      },

      getBecomeSpecialistState: () => {
        return get().becomeSpecialistState
      },

      // Adept hat functions
      getAdeptChatDataById: (id: string) => {
        const chat = get().adeptChats.find((chat) => chat.id === id)
        return chat ? deepCopy(chat) : undefined
      },

      findAdeptChatBySpecialistId: (specialistId: string) => {
        const chat = get().adeptChats.find((chat) => chat.specialistId === specialistId)
        return chat ? deepCopy(chat) : undefined
      },

      addAdeptChat: (chat: any) => {
        console.log(chat)
        console.log(get().adeptChats)
        set((state) => ({
          adeptChats: [deepCopy(chat), ...state.adeptChats],
        }))
      },

      updateAdeptChat: (chatId: string, updates: any) => {
        set((state) => ({
          adeptChats: state.adeptChats.map((chat) => (chat.id === chatId ? { ...chat, ...updates } : chat)),
        }))
      },

      removeAdeptChat: (chatId: string) => {
        set((state) => ({
          adeptChats: state.adeptChats.filter((chat) => chat.id !== chatId),
        }))
      },

      addMessageToAdeptChat: (chatId: string, message: any) => {
        const newMessage = {
          ...message,
          id: uuidv4(),
        }

        let updatedChat

        set((state) => {
          const chatIndex = state.adeptChats.findIndex((chat) => chat.id === chatId)
          if (chatIndex === -1) return state

          const chat = state.adeptChats[chatIndex]
          updatedChat = {
            ...chat,
            messages: [...chat.messages, newMessage],
            timestamp: message.timestamp,
            hasNew: false,
          }

          const newChats = [...state.adeptChats]
          newChats[chatIndex] = updatedChat

          return {
            adeptChats: newChats,
          }
        })

        return updatedChat ? deepCopy(updatedChat) : undefined
      },

      clearAdeptChats: () => {
        set({ adeptChats: [] })
      },

      // Master hat functions
      getMasterChatDataById: (id: string) => {
        const chat = get().masterChats.find((chat) => chat.id === id)
        return chat ? deepCopy(chat) : undefined
      },

      findMasterChatBySpecialistId: (specialistId: string) => {
        const chat = get().masterChats.find((chat) => chat.specialistId === specialistId)
        return chat ? deepCopy(chat) : undefined
      },

      addMasterChat: (chat: any) => {
        set((state) => ({
          masterChats: [deepCopy(chat), ...state.masterChats],
        }))
      },

      updateMasterChat: (chatId: string, updates: any) => {
        set((state) => ({
          masterChats: state.masterChats.map((chat) => (chat.id === chatId ? { ...chat, ...updates } : chat)),
        }))
      },

      removeMasterChat: (chatId: string) => {
        set((state) => ({
          masterChats: state.masterChats.filter((chat) => chat.id !== chatId),
        }))
      },

      addMessageToMasterChat: (chatId: string, message: any) => {
        const newMessage = {
          ...message,
          id: uuidv4(),
        }

        let updatedChat

        set((state) => {
          const chatIndex = state.masterChats.findIndex((chat) => chat.id === chatId)
          if (chatIndex === -1) return state

          const chat = state.masterChats[chatIndex]
          updatedChat = {
            ...chat,
            messages: [...chat.messages, newMessage],
            timestamp: message.timestamp,
            hasNew: false,
          }

          const newChats = [...state.masterChats]
          newChats[chatIndex] = updatedChat

          return {
            masterChats: newChats,
          }
        })

        return updatedChat ? deepCopy(updatedChat) : undefined
      },

      clearMasterChats: () => {
        set({ masterChats: [] })
      },
    }),
    {
      name: "chat-storage",
      partialize: (state) => ({
        adeptChats: state.adeptChats,
        masterChats: state.masterChats,
        becomeSpecialistState: state.becomeSpecialistState,
      }),
    },
  ),
)

// Convenience hooks for specific hat usage
export const useAdeptChats = () => {
  const {
    adeptChats,
    getAdeptChatDataById,
    findAdeptChatBySpecialistId,
    addAdeptChat,
    updateAdeptChat,
    removeAdeptChat,
    addMessageToAdeptChat,
    clearAdeptChats,
  } = useChatStore()

  return {
    chats: adeptChats,
    getChatDataById: getAdeptChatDataById,
    findChatBySpecialistId: findAdeptChatBySpecialistId,
    addChat: addAdeptChat,
    updateChat: updateAdeptChat,
    removeChat: removeAdeptChat,
    addMessageToChat: addMessageToAdeptChat,
    clearChats: clearAdeptChats,
  }
}

export const useMasterChats = () => {
  const {
    masterChats,
    getMasterChatDataById,
    findMasterChatBySpecialistId,
    addMasterChat,
    updateMasterChat,
    removeMasterChat,
    addMessageToMasterChat,
    clearMasterChats,
  } = useChatStore()

  return {
    chats: masterChats,
    getChatDataById: getMasterChatDataById,
    findChatBySpecialistId: findMasterChatBySpecialistId,
    addChat: addMasterChat,
    updateChat: updateMasterChat,
    removeChat: removeMasterChat,
    addMessageToChat: addMessageToMasterChat,
    clearChats: clearMasterChats,
  }
}

// Hook for become specialist functionality
export const useBecomeSpecialistStore = create<BecomeSpecialistState>()(
  persist(
    (set) => ({
      state: initialBecomeSpecialistState,
      setStep: (step) =>
        set((state) => ({
          state: { ...state.state, step },
        })),
      setSelectedTags: (selectedTags) =>
        set((state) => ({
          state: { ...state.state, selectedTags },
        })),
      setPolicyAccepted: (policyAccepted) =>
        set((state) => ({
          state: { ...state.state, policyAccepted },
        })),
      setPersonalityAnswer: (questionId, answer) =>
        set((state) => ({
          state: {
            ...state.state,
            personalityAnswers: {
              ...state.state.personalityAnswers,
              [questionId]: answer,
            },
          },
        })),
      resetState: () => set({ state: initialBecomeSpecialistState }),
    }),
    {
      name: "become-specialist-storage",
    },
  ),
)
