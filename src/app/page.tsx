"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Chat from "@/components/chat"
import { supabase } from "@/utils/supabase"

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
      } else {
        router.push("/login")
      }
      setLoading(false)
    }

    checkUser()
  }, [router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#161616]">
        <p className="text-white">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null // This will prevent a flash of content before redirecting
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#161616] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Logged in as <b>{user.email}</b>
        </h1>
        <button
          onClick={async () => {
            await supabase.auth.signOut()
            router.push("/login")
          }}
          className="mt-4 px-4 py-2 bg-[#2b725e] hover:bg-[#235e4c] text-white rounded-md"
        >
          Sign Out
        </button>
      </div>

      <Chat user={user} />
    </div>
  )
}

