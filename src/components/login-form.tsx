"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/utils/supabase"
import { toast } from "sonner"

export default function LoginForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password })

            if (error) {
                toast.error(`Error ${error.message}`)
            } else {
                // Successful login: redirect to home page without showing a toast
                router.push("/")
            }
        } catch (error) {
            toast.error("An unexpected error occurred. Please try again.",
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md space-y-8">
            <div className="space-y-2 text-center">
                <h1 className="text-4xl font-semibold tracking-tight text-white">Welcome back</h1>
                <p className="text-lg text-gray-400">Sign in to your account</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                            Email
                        </label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="bg-[#1c1c1c] border-gray-800 text-white placeholder:text-gray-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                            Password
                        </label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="bg-[#1c1c1c] border-gray-800 text-white"
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#2b725e] hover:bg-[#235e4c] text-white py-6 text-lg font-medium rounded-lg h-[60px]"
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing in...
                        </>
                    ) : (
                        "Sign In"
                    )}
                </Button>

                <div className="text-center text-gray-400">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-white hover:underline">
                        Sign up
                    </Link>
                </div>

              
            </form>
        </div>
    )
}

