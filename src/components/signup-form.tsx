"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/utils/supabase"
import { toast, Toaster } from "sonner"

export default function SignUpForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            })

            if (error) {
                throw error
            }

            toast.success("Check your email to confirm your account.",
            )
        } catch (error) {
            if (error instanceof Error) {
                toast.error(`Error ${error.message}`,
                )
            } else {
                toast.error("An unexpected error occurred. Please try again.",)
            }
            console.error("Sign up error:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md space-y-8">
            <div className="space-y-2 text-center">
                <h1 className="text-4xl font-semibold tracking-tight text-white">Create an account</h1>
                <p className="text-lg text-gray-400">Sign up to get started</p>
            </div>

            <form onSubmit={handleSignUp} className="space-y-6">
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
                            Signing up...
                        </>
                    ) : (
                        "Sign Up"
                    )}
                </Button>

                <div className="text-center text-gray-400">
                    Already have an account?{" "}
                    <Link href="/login" className="text-white hover:underline">
                        Log in
                    </Link>
                </div>

                <div className="flex items-center justify-center space-x-2 text-gray-400">
                    <span>Powered by</span>
                    <img
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Supabase_wordmark_dark-1qYmpCiDfeOHLrbsNfqcmhcXYkVLO1.svg"
                        alt="Supabase"
                        className="h-5 dark:invert"
                    />
                </div>
            </form>
        </div>
    )
}

