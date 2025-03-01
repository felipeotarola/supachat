"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { supabase } from "@/utils/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, ImageIcon } from "lucide-react"
import { toast, Toaster } from "sonner"
import { CopilotKitCSSProperties, CopilotSidebar } from "@copilotkit/react-ui"
import { useCopilotReadable } from "@copilotkit/react-core"; 

type Message = {
    id: string
    user_id: string
    content: string
    created_at: string
    image_url?: string
}

export default function Chat({ user }: { user: any }) {
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState("")
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [colleagues, setColleagues] = useState([
        { id: 1, name: "John Doe", role: "Developer" },
        { id: 2, name: "Jane Smith", role: "Designer" },
        { id: 3, name: "Bob Wilson", role: "Product Manager" }
      ]);
     
      // Define Copilot readable state
      useCopilotReadable({
        description: "The current user's colleagues",
        value: colleagues,
      });

        // Define Copilot readable state for messages
  useCopilotReadable({
    description: "The current public chat messages from supabase",
    value: messages,
  });



    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const { data, error } = await supabase.from("messages").select("*").order("created_at", { ascending: true })

                if (error) throw error

                setMessages(data || [])
            } catch (error) {
                console.error("Error fetching messages:", error)
                toast.error("Failed to load messages. Please try again.")
            } finally {
                setLoading(false)
            }
        }

        fetchMessages()

        const channel = supabase
            .channel("public-chat")
            .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
                setMessages((prev) => [...prev, payload.new as Message])
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim() && !uploading) return

        try {
            const { error } = await supabase.from("messages").insert({
                user_id: user.id,
                content: newMessage,
            })

            if (error) throw error

            setNewMessage("")
        } catch (error) {
            console.error("Error sending message:", error)
            toast.error("Failed to send message. Please try again.")
        }
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)

        try {
            const filename = `${Date.now()}-${file.name}`
            const formData = new FormData()
            formData.append("file", file)

            const response = await fetch(`/api/upload-image?filename=${encodeURIComponent(filename)}`, {
                method: "POST",
                body: formData,
            })

            const contentType = response.headers.get("content-type")
            if (contentType && contentType.indexOf("application/json") !== -1) {
                // Response is JSON
                const data = await response.json()
                if (!response.ok) {
                    throw new Error(data.error || `HTTP error! status: ${response.status}`)
                }
                if (!data.url) {
                    throw new Error("Image URL not found in the response")
                }

                const { error } = await supabase.from("messages").insert({
                    user_id: user.id,
                    content: "Sent an image",
                    image_url: data.url,
                })

                if (error) throw error

                toast.success("Image uploaded successfully.")
            } else {
                // Response is not JSON
                const text = await response.text()
                throw new Error(`Unexpected response: ${text.substring(0, 100)}...`)
            }
        } catch (error) {
            console.error("Error uploading image:", error)
            toast.error(error instanceof Error ? error.message : "Failed to upload image. Please try again.")
        } finally {
            setUploading(false)
            if (fileInputRef.current) {
                fileInputRef.current.value = ""
            }
        }
    }

    if (loading) {
        return <div className="text-white">Loading messages...</div>
    }

    return (
        <>
            <div
                style={
                    {
                        "--copilot-kit-primary-color": "#222222",
                    } as CopilotKitCSSProperties
                }
            >
                <CopilotSidebar
                    defaultOpen={true}
                    instructions={"You are assisting the user as best as you can. Answer in the best way possible given the data you have."}
                    labels={{
                        title: "Sidebar Assistant",
                        initial: "How can I help you today?",
                    }}
                >
                    <Toaster />
                    <div className="flex flex-col h-[500px] w-full max-w-md bg-[#1c1c1c] rounded-lg overflow-hidden border border-gray-800">
                        <div className="p-4 bg-[#232323] border-b border-gray-800">
                            <h2 className="text-xl font-semibold text-white">Public Chat</h2>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.length === 0 ? (
                                <p className="text-gray-400 text-center">No messages yet. Be the first to say hello!</p>
                            ) : (
                                messages.map((msg) => (
                                    <div key={msg.id} className={`flex flex-col ${msg.user_id === user.id ? "items-end" : "items-start"}`}>
                                        <div
                                            className={`max-w-[80%] rounded-lg p-3 ${msg.user_id === user.id ? "bg-[#2b725e] text-white" : "bg-[#2a2a2a] text-white"
                                                }`}
                                        >
                                            {msg.image_url ? (
                                                <img
                                                    src={msg.image_url || "/placeholder.svg"}
                                                    alt="Shared image"
                                                    className="max-w-full h-auto rounded"
                                                />
                                            ) : (
                                                <p className="text-sm">{msg.content}</p>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-500 mt-1">
                                            {msg.user_id === user.id ? user.id: "User"} • {new Date(msg.created_at).toLocaleTimeString()}
                                        </span>
                                    </div>
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-800 flex gap-2">
                            <Input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 bg-[#232323] border-gray-700 text-white"
                            />
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" ref={fileInputRef} />
                            <Button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-[#2b725e] hover:bg-[#235e4c]"
                                disabled={uploading}
                            >
                                <ImageIcon size={18} />
                            </Button>
                            <Button
                                type="submit"
                                className="bg-[#2b725e] hover:bg-[#235e4c]"
                                disabled={(!newMessage.trim() && !uploading) || uploading}
                            >
                                <Send size={18} />
                            </Button>
                        </form>
                    </div>
                </CopilotSidebar>
            </div>
        </>
    )
}

