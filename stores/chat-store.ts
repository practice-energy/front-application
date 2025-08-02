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
  v: 1 | 2 | 3 | null // Version from backend
  versionAnswers: Record<string, 1 | 2 | 3 | 4 | 5> // Version-specific answers
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
  setVersion: (v: 1 | 2 | 3) => void
  setVersionAnswer: (questionId: string, answer: 1 | 2 | 3 | 4 | 5) => void
  resetBecomeSpecialistState: () => void
  getBecomeSpecialistState: () => BecomeSpecialistState
  submitPersonalityTest: () => Promise<{ v: 1 | 2 | 3 } | null>
  submitVersionAnswers: () => Promise<{ success: boolean; mufiMode?: string } | null>

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
  v: null,
  versionAnswers: {},
}

// Mock backend API call
const mockSubmitPersonalityTest = async (personalityAnswers: Record<string, string>): Promise<{ v: 1 | 2 | 3 }> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

  // Simulate 20% chance of error for retry logic
  if (Math.random() < 0.2) {
    throw new Error("Network error")
  }

  // Simple logic to determine version based on answers
  const answers = Object.values(personalityAnswers)
  const firstAnswers = answers.filter(
    (a) => a.includes("возможности") || a.includes("эксперимент") || a.includes("опыт"),
  ).length
  const secondAnswers = answers.filter(
    (a) => a.includes("план") || a.includes("улучшения") || a.includes("Результат"),
  ).length

  if (firstAnswers >= secondAnswers) {
    return { v: Math.random() > 0.5 ? 1 : 3 }
  } else {
    return { v: 2 }
  }
}

// Mock backend API call for version answers
const mockSubmitVersionAnswers = async (
  versionAnswers: Record<string, 1 | 2 | 3 | 4 | 5>,
  version: 1 | 2 | 3 | null,
): Promise<{ success: boolean; mufiMode?: string }> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

  // Simulate 15% chance of error for retry logic
  if (Math.random() < 0.15) {
    throw new Error("Network error")
  }

  // Calculate average score
  const scores = Object.values(versionAnswers)
  const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length

  // Determine mufiMode based on version and average score
  let mufiMode = "continue"

  if (version === 1 && averageScore >= 4) {
    mufiMode = "young-high"
  } else if (version === 2 && averageScore >= 4) {
    mufiMode = "mature-high"
  } else if (version === 3 && averageScore >= 4) {
    mufiMode = "wise-high"
  }

  return { success: true, mufiMode }
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

      setVersion: (v: 1 | 2 | 3) => {
        set((state) => ({
          becomeSpecialistState: {
            ...state.becomeSpecialistState,
            v,
          },
        }))
      },

      setVersionAnswer: (questionId: string, answer: 1 | 2 | 3 | 4 | 5) => {
        set((state) => ({
          becomeSpecialistState: {
            ...state.becomeSpecialistState,
            versionAnswers: {
              ...state.becomeSpecialistState.versionAnswers,
              [questionId]: answer,
            },
          },
        }))
      },

      submitPersonalityTest: async () => {
        const { personalityAnswers } = get().becomeSpecialistState

        let retries = 3
        while (retries > 0) {
          try {
            const result = await mockSubmitPersonalityTest(personalityAnswers)

            // Update store with version
            set((state) => ({
              becomeSpecialistState: {
                ...state.becomeSpecialistState,
                v: result.v,
              },
            }))

            return result
          } catch (error) {
            retries--
            if (retries === 0) {
              console.error("Failed to submit personality test after retries:", error)
              return null
            }
            // Wait before retry
            await new Promise((resolve) => setTimeout(resolve, 1000))
          }
        }
        return null
      },

      submitVersionAnswers: async () => {
        const { versionAnswers, v } = get().becomeSpecialistState

        let retries = 3
        while (retries > 0) {
          try {
            const result = await mockSubmitVersionAnswers(versionAnswers, v)

            // Move to step 4 (continue mode)
            set((state) => ({
              becomeSpecialistState: {
                ...state.becomeSpecialistState,
                step: 4,
              },
            }))

            return result
          } catch (error) {
            retries--
            if (retries === 0) {
              console.error("Failed to submit version answers after retries:", error)
              return null
            }
            // Wait before retry
            await new Promise((resolve) => setTimeout(resolve, 1000))
          }
        }
        return null
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
export const useBecomeSpecialist = () => {
  const {
    becomeSpecialistState,
    setBecomeSpecialistStep,
    setSelectedTags,
    setPolicyAccepted,
    setPersonalityAnswer,
    setVersion,
    setVersionAnswer,
    resetBecomeSpecialistState,
    getBecomeSpecialistState,
    submitPersonalityTest,
    submitVersionAnswers,
  } = useChatStore()

  return {
    state: becomeSpecialistState,
    setStep: setBecomeSpecialistStep,
    setSelectedTags,
    setPolicyAccepted,
    setPersonalityAnswer,
    setVersion,
    setVersionAnswer,
    resetState: resetBecomeSpecialistState,
    getState: getBecomeSpecialistState,
    submitPersonalityTest,
    submitVersionAnswers,
  }
}
