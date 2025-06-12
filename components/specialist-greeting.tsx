"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Save, Edit, MessageCircle, Eye } from "lucide-react"

export function SpecialistGreeting() {
  const [isEditing, setIsEditing] = useState(false)
  const [greetingMessage, setGreetingMessage] = useState(
    "Welcome! I'm excited to work with you on your spiritual journey. I specialize in astrology, life coaching, and meditation practices. Feel free to share what brings you here today, and let's explore how I can best support your growth and transformation.",
  )
  const [editedMessage, setEditedMessage] = useState(greetingMessage)

  const handleSave = () => {
    setGreetingMessage(editedMessage)
    setIsEditing(false)
    // Here you would typically save to your backend
    console.log("Saving greeting message:", editedMessage)
  }

  const handleCancel = () => {
    setEditedMessage(greetingMessage)
    setIsEditing(false)
  }

  const characterCount = editedMessage.length
  const maxCharacters = 500

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Greeting Message</h2>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit Message
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button onClick={handleCancel} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-violet-600 hover:bg-violet-700 text-white">
              <Save className="h-4 w-4 mr-2" />
              Save Message
            </Button>
          </div>
        )}
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <MessageCircle className="h-5 w-5 text-violet-600" />
            <h3 className="text-lg font-semibold">Welcome Message for New Clients</h3>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            This message will be automatically sent to new clients when they start a conversation with you. Make it
            warm, welcoming, and informative about your services.
          </p>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="greeting">Greeting Message</Label>
                <Textarea
                  id="greeting"
                  value={editedMessage}
                  onChange={(e) => setEditedMessage(e.target.value)}
                  placeholder="Write a welcoming message for your new clients..."
                  rows={6}
                  maxLength={maxCharacters}
                  className="mt-2"
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-muted-foreground">
                    This message will appear when clients first contact you
                  </p>
                  <p
                    className={`text-xs ${characterCount > maxCharacters * 0.9 ? "text-red-500" : "text-muted-foreground"}`}
                  >
                    {characterCount}/{maxCharacters}
                  </p>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </h4>
                <div className="bg-background p-3 rounded border">
                  <p className="text-sm">{editedMessage || "Your greeting message will appear here..."}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-violet-50 border border-violet-200 p-4 rounded-lg">
                <p className="text-foreground leading-relaxed">{greetingMessage}</p>
              </div>

              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                >
                  Active
                </Badge>
                <span>• Automatically sent to new clients</span>
                <span>• {greetingMessage.length} characters</span>
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Tips for a Great Greeting Message</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-violet-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-muted-foreground">
              <strong>Be welcoming:</strong> Start with a warm greeting that makes clients feel comfortable
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-violet-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-muted-foreground">
              <strong>Introduce your specialties:</strong> Briefly mention what services you offer
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-violet-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-muted-foreground">
              <strong>Set expectations:</strong> Let them know what to expect from your sessions
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-violet-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-muted-foreground">
              <strong>Encourage engagement:</strong> Ask them to share what brings them to you
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
