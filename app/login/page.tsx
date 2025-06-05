"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import { useRouter, useSearchParams } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const signupSuccess = searchParams.get("signup") === "success"
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [redirectPath, setRedirectPath] = useState<string | null>(null)
  const [showSignupSuccess, setShowSignupSuccess] = useState(signupSuccess)

  useEffect(() => {
    const storedRedirect = localStorage.getItem("redirectAfterLogin")
    if (storedRedirect) {
      setRedirectPath(storedRedirect)
    }

    if (signupSuccess) {
      const timer = setTimeout(() => {
        setShowSignupSuccess(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [signupSuccess])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Admin login
      if (email === "admin@yourdailymeal.com" && password === "admin123") {
        const adminData = {
          id: "admin-1",
          email: "admin@yourdailymeal.com",
          name: "Admin YDM",
          role: "admin",
        }
        localStorage.setItem("admin", JSON.stringify(adminData))
        alert("Login admin berhasil!")
        router.push("/admin/dashboard")
        return
      }

      // Get users from localStorage
      const storedUsers = localStorage.getItem("ydm_users")
      const users = storedUsers ? JSON.parse(storedUsers) : []

      // Find user
      const user = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)

      if (user) {
        // Login success
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: user.id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            address: user.address,
          }),
        )

        alert("Login berhasil!")

        if (redirectPath) {
          localStorage.removeItem("redirectAfterLogin")
          router.push(redirectPath)
        } else {
          router.push("/")
        }
      } else {
        setError("Email atau password salah. Pastikan Anda sudah mendaftar terlebih dahulu.")
      }
    } catch (error) {
      console.error("Error:", error)
      setError("Terjadi kesalahan. Pastikan Anda sudah mendaftar terlebih dahulu.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 flex">
        {/* Left side - Food Image */}
        <div className="hidden md:block w-1/2 relative">
          <Image src="/images/food-image.png" alt="Delicious meal" fill className="object-cover" priority />
        </div>

        {/* Right side - Login Form */}
        <div className="w-full md:w-1/2 bg-[#7a8c4f] flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="bg-[#f8f3e2] rounded-3xl p-8 shadow-lg">
              <div className="flex justify-center mb-6">
                <Image src="/images/logo.png" alt="Your Daily Meal" width={200} height={100} className="h-auto" />
              </div>

              {showSignupSuccess && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                  <div className="font-bold">Signup Berhasil!</div>
                  <div className="text-sm">
                    Akun Anda telah berhasil dibuat. Silakan login dengan email dan password Anda.
                  </div>
                </div>
              )}

              {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-xl text-[#4a5c2f] font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (error) setError("")
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Masukkan email"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-xl text-[#4a5c2f] font-medium">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (error) setError("")
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Masukkan password"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="text-right">
                  <Link href="/forgot-password" className="text-[#4a5c2f] hover:underline">
                    Lupa password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full py-3 bg-[#b3a278] hover:bg-[#a39068] text-[#4a5c2f] text-lg font-medium rounded-lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Memproses..." : "Log In"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-[#4a5c2f]">
                  Belum punya akun?{" "}
                  <Link href="/signup" className="text-[#4a5c2f] font-bold hover:underline">
                    Daftar
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
