"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import { useRouter } from "next/navigation"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        // Store admin data in localStorage
        localStorage.setItem("admin", JSON.stringify(data.admin))

        // Show success message briefly
        alert("Login admin berhasil! Selamat datang, Admin.")

        // Redirect to admin dashboard
        router.push("/admin/dashboard")

        // Force page refresh to update navbar
        setTimeout(() => {
          window.location.reload()
        }, 100)
      } else {
        setError(data.error || "Login admin gagal")
      }
    } catch (error) {
      console.error("Error:", error)
      setError("Terjadi kesalahan jaringan. Silakan coba lagi.")
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

        {/* Right side - Admin Login Form */}
        <div className="w-full md:w-1/2 bg-[#7a8c4f] flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="bg-[#f8f3e2] rounded-3xl p-8 shadow-lg">
              <div className="flex justify-center mb-6">
                <Image src="/images/logo.png" alt="Your Daily Meal" width={200} height={100} className="h-auto" />
              </div>

              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-[#4a5c2f]">Admin Login</h2>
                <p className="text-[#4a5c2f] mt-2">Masuk sebagai administrator</p>
              </div>

              {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-xl text-[#4a5c2f] font-medium">
                    Email Admin
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
                    placeholder="Masukkan email admin"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-xl text-[#4a5c2f] font-medium">
                    Password Admin
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
                    placeholder="Masukkan password admin"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="text-right">
                  <Link href="/admin/forgot-password" className="text-[#4a5c2f] hover:underline">
                    Lupa password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full py-3 bg-[#b3a278] hover:bg-[#a39068] text-[#4a5c2f] text-lg font-medium rounded-lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Memproses..." : "Login Admin"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link href="/login" className="text-[#4a5c2f] hover:underline">
                  ← Kembali ke Login User
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
