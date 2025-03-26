"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, Clock, MessageSquare, User } from "lucide-react"

export default function PatientChatbot() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    initialMessages: [
      {
        id: "1",
        role: "assistant",
        content: "Hello! I'm your healthcare assistant. How can I help you today?",
      },
    ],
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [selectedTab, setSelectedTab] = useState("chat")

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-4">
      <header className="w-full max-w-4xl mx-auto mb-4">
        <div className="flex items-center space-x-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="HealthAssist Logo" />
            <AvatarFallback className="bg-blue-500 text-white">HA</AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold text-blue-700">HealthAssist</h1>
        </div>
        <p className="text-gray-500 mt-1">Your personal healthcare assistant</p>
      </header>

      <main className="flex-grow w-full max-w-4xl mx-auto">
        <Tabs defaultValue="chat" value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>Chat</span>
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>Appointments</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-4">
            <Card className="border-blue-100">
              <CardHeader className="bg-blue-50 border-b border-blue-100">
                <CardTitle className="text-blue-700">Chat with HealthAssist</CardTitle>
              </CardHeader>
              <CardContent className="h-[60vh] overflow-y-auto p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.role === "assistant" && (
                        <Avatar className="h-8 w-8 mr-2 mt-1">
                          <AvatarFallback className="bg-blue-500 text-white">HA</AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.role === "user"
                            ? "bg-blue-500 text-white rounded-tr-none"
                            : "bg-gray-100 text-gray-800 rounded-tl-none"
                        }`}
                      >
                        {message.content}
                      </div>
                      {message.role === "user" && (
                        <Avatar className="h-8 w-8 ml-2 mt-1">
                          <AvatarFallback className="bg-gray-300">
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>
              <CardFooter className="border-t border-blue-100 p-4">
                <form onSubmit={handleSubmit} className="flex w-full space-x-2">
                  <Textarea
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Type your health question here..."
                    className="flex-grow resize-none min-h-[60px]"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSubmit(e as any)
                      }
                    }}
                  />
                  <Button type="submit" disabled={isLoading || !input.trim()} className="bg-blue-600 hover:bg-blue-700">
                    Send
                  </Button>
                </form>
              </CardFooter>
            </Card>

            <div className="text-sm text-gray-500 text-center">
              <p>
                This chatbot is for informational purposes only and is not a substitute for professional medical advice.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Dr. Sarah Johnson</h3>
                      <p className="text-sm text-gray-500">General Checkup</p>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span>March 28, 2025</span>
                      <Clock className="h-4 w-4 ml-3 mr-1" />
                      <span>10:30 AM</span>
                    </div>
                  </div>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Schedule New Appointment</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="bg-gray-300">
                        <User className="h-8 w-8" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-lg">Alex Johnson</h3>
                      <p className="text-sm text-gray-500">Patient ID: 12345678</p>
                    </div>
                  </div>

                  <div className="grid gap-4 pt-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-1 font-medium">Date of Birth:</div>
                      <div className="col-span-2">May 15, 1985</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-1 font-medium">Primary Doctor:</div>
                      <div className="col-span-2">Dr. Sarah Johnson</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-1 font-medium">Insurance:</div>
                      <div className="col-span-2">HealthPlus Premium</div>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full mt-4">
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="w-full max-w-4xl mx-auto mt-8 text-center text-sm text-gray-500">
        <p>© 2025 HealthAssist. All rights reserved.</p>
        <p className="mt-1">For medical emergencies, please call 911 or your local emergency number.</p>
      </footer>
    </div>
  )
}

