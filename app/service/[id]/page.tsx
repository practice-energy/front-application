"use client"

import { useState } from "react"

import type React from "react"
import { mockServices } from "@/services/mock-services"
import { ServicePageContent } from "@/components/service/service-page-content"
import {mockBookingSlots} from "@/services/booking-slot-data";
import {Mufi} from "@/components/mufi";
import type {Chat, Message} from "@/types/chats";
import {v4 as uuidv4} from "uuid";
import {router} from "next/client";

export default function ServicePage({ params }: { params: { id: string } }) {
  const { id } = params
  const [isAnimating] = useState(false)

  // Find the service by ID
  const service = mockServices.find((s) => s.id === id) || mockServices[0]
  const bookingSlots = mockBookingSlots

  const handleSearch = (query: string, title?: string, files: File[] = [], isPractice?: boolean) => {
    if (!query.trim() && files.length === 0) return

    const existingChat = findChatBySpecialistId(specialist.id)

    if (existingChat) {
      const userMessage: Omit<Message, "id"> = {
        type: "user",
        content: query,
        timestamp: Date.now(),
        files: files,
      }
      addMessageToChat(existingChat.id, userMessage)
      window.dispatchEvent(new CustomEvent("chatUpdated", { detail: { chatId: existingChat.id } }))
      router.push(`/search/${existingChat.id}`)
    } else {
      const newChatId = uuidv4()
      const userMessage: Message = {
        id: uuidv4(),
        type: "user",
        content: query,
        timestamp: Date.now(),
        files: files,
      }

      const newChat: Chat = {
        id: newChatId,
        title: specialist.name,
        specialistId: specialist.id,
        avatar: specialist.avatar || "placeholder.jpg",
        timestamp:Date.now(),
        messages: [userMessage],
        isAI: false,
        hasNew: false,
        createdAt: Date.now(),
      }

      addChat(newChat)

      window.dispatchEvent(
          new CustomEvent("addNewChatToSidebar", {
            detail: {
              chat: {
                ...newChat,
                description: query,
                isPractice: isPractice,
              },
            },
          }),
      )

      router.push(`/search/${newChatId}`)
    }
  }

  return (
    <>
      <div className="mx-auto px-4 sm:px-6 py-8">
        {/* Service Page Content */}
        <div className="h-24"/>
        <ServicePageContent service={service} bookingSlots={bookingSlots}/>
        <Mufi
            onSearch={handleSearch}
            showHeading={false}
            dynamicWidth={false}
            showPractice={false}
            disableFileApply={true}
            placeholder={ `Спроси у ${service.specialist?.name || "Alura"}`}
            onCancelReply={() => {}}
            chatTitle="Alura"
        />
      </div>
    </>
  )
}
