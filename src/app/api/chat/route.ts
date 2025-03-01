import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/utils/supabase"
import { put } from "@vercel/blob"

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const messages = formData.getAll("messages")
  const attachments = formData.getAll("attachments")

  let imageUrl = null

  // Handle file upload if there's an attachment
  if (attachments && attachments.length > 0) {
    const file = attachments[0] as File
    const filename = `powerchat/${Date.now()}-${file.name}`
    const blob = await put(filename, file, { access: "public" })
    imageUrl = blob.url
  }

  // Process the last message (which is the new one)
  const lastMessage = JSON.parse(messages[messages.length - 1] as string)

  try {
    const { error } = await supabase.from("messages").insert({
      user_id: "user-id", // Replace with actual user ID
      content: lastMessage.content,
      image_url: imageUrl,
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving message:", error)
    return NextResponse.json({ error: "Failed to save message" }, { status: 500 })
  }
}

