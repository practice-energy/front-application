import { create } from "zustand"
import { persist } from "zustand/middleware"
import { v4 as uuidv4 } from "uuid"
import type { Chat, Message } from "@/types/chats"

import { mockChatData } from "@/services/mock-chat"

interface BecomeSpecialistState {
  step: 1 | 2 | 3 | 4 | 5
  selectedTags: string[]
  policyAccepted: boolean
  personalityAnswers: Record<string, string> // questionId -> answer
  v: 1 | 2 | 3 | null // Version from backend
  versionAnswers: Record<string, 1 | 2 | 3 | 4 | 5> // Version-specific answers
  chatId?: string
  meetingLetted: boolean
}

interface ChatState {
  // Separate chats for different user hats
  adeptChats: Chat[]
  masterChats: Chat[]

  // Become specialist state
  becomeSpecialistState: BecomeSpecialistState

  // Become specialist functions
  setBecomeSpecialistStep: (step: 1 | 2 | 3 | 4 | 5) => void
  setSelectedTags: (tags: string[]) => void
  setPolicyAccepted: (accepted: boolean) => void
  setPersonalityAnswer: (questionId: string, answer: string) => void
  setVersion: (v: 1 | 2 | 3) => void
  setVersionAnswer: (questionId: string, answer: 1 | 2 | 3 | 4 | 5) => void
  setChatId: (chatId: string) => void
  resetBecomeSpecialistState: () => void
  getBecomeSpecialistState: () => BecomeSpecialistState
  submitPersonalityTest: () => Promise<{ v: 1 | 2 | 3 } | null>
  submitVersionAnswers: () => Promise<{ success: boolean; mufiMode?: string } | null>
  setMeetingLetted: () => void

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
  chatId: undefined,
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
      setBecomeSpecialistStep: (step: 1 | 2 | 3 | 4 | 5) => {
        set((state) => ({
          becomeSpecialistState: {
            ...state.becomeSpecialistState,
            step,
          },
        }))
      },

      setMeetingLetted: () => {
        set((state) => ({
              becomeSpecialistState: {
                ...state.becomeSpecialistState,
                meetingLetted: true,
              }
            }
        ))
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

      setChatId: (chatId: string) => {
        set((state) => ({
          becomeSpecialistState: {
            ...state.becomeSpecialistState,
            chatId: chatId,
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
        return get().adeptChats.find((chat) => chat.id === id)
      },

      findAdeptChatBySpecialistId: (specialistId: string) => {
        return get().adeptChats.find((chat) => chat.specialistId === specialistId)
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
        const chat = get().adeptChats.find((chat) => chat.id === chatId)
        if (chat) {
          set((state) => ({
            adeptChats: state.adeptChats.map((c) =>
              c.id === chatId ? { ...c, messages: [...c.messages, { ...message, id: uuidv4() }] } : c,
            ),
          }))
          return chat
        }
        return undefined
      },

      clearAdeptChats: () => {
        set({ adeptChats: [] })
      },

      // Master hat functions
      getMasterChatDataById: (id: string) => {
        return get().masterChats.find((chat) => chat.id === id)
      },

      findMasterChatBySpecialistId: (specialistId: string) => {
        return get().masterChats.find((chat) => chat.specialistId === specialistId)
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
        const chat = get().masterChats.find((chat) => chat.id === chatId)
        if (chat) {
          set((state) => ({
            masterChats: state.masterChats.map((c) =>
              c.id === chatId ? { ...c, messages: [...c.messages, { ...message, id: uuidv4() }] } : c,
            ),
          }))
          return chat
        }
        return undefined
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
    setChatId,
    resetBecomeSpecialistState,
    getBecomeSpecialistState,
    submitPersonalityTest,
    submitVersionAnswers,
    setMeetingLetted,
  } = useChatStore()

  return {
    state: becomeSpecialistState,
    setStep: setBecomeSpecialistStep,
    setSelectedTags,
    setPolicyAccepted,
    setPersonalityAnswer,
    setVersion,
    setVersionAnswer,
    setChatId,
    resetState: resetBecomeSpecialistState,
    getState: getBecomeSpecialistState,
    submitPersonalityTest,
    submitVersionAnswers,
    setMeetingLetted
  }
}
