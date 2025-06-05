"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (error) setError("")
    if (success) setSuccess("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // Validation
      if (formData.password !== formData.confirmPassword) {
        setError("Password dan konfirmasi password tidak cocok")
        setIsLoading(false)
        return
      }

      if (formData.password.length < 6) {
        setError("Password minimal 6 karakter")
        setIsLoading(false)
        return
      }

      // Get existing users
      const storedUsers = localStorage.getItem("ydm_users")
      const users = storedUsers ? JSON.parse(storedUsers) : []

      // Check if email exists
      const existingUser = users.find((u: any) => u.email.toLowerCase() === formData.email.toLowerCase())
      if (existingUser) {
        setError("Email sudah terdaftar")
        setIsLoading(false)
        return
      }

      // Create new user
      const newUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        username: formData.username,
        email: formData.email.toLowerCase(),
        phone: formData.phone,
        address: formData.address,
        password: formData.password,
        created_at: new Date().toISOString(),
      }

      // Add to users
      users.push(newUser)
      localStorage.setItem("ydm_users", JSON.stringify(users))

      setSuccess("Akun berhasil dibuat! Mengalihkan ke halaman login...")

      // Reset form
      setFormData({
        username: "",
        email: "",
        phone: "",
        address: "",
        password: "",
        confirmPassword: "",
      })

      // Redirect to login
      setTimeout(() => {
        router.push("/login?signup=success")
      }, 2000)
    } catch (error) {
      console.error("Signup error:", error)
      setError("Terjadi kesalahan. Silakan coba lagi.")
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

        {/* Right side - Signup Form */}
        <div className="w-full md:w-1/2 bg-[#7a8c4f] flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="bg-[#f8f3e2] rounded-3xl p-8 shadow-lg">
              <div className="flex justify-center mb-6">
                <Image src="/images/logo.png" alt="Your Daily Meal" width={200} height={100} className="h-auto" />
              </div>

              {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

              {success && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">{success}</div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="username" className="block text-lg text-[#4a5c2f] font-medium">
                    Username
                  </label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Masukkan username"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-lg text-[#4a5c2f] font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Masukkan email"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-lg text-[#4a5c2f] font-medium">
                    Nomor Telephone
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Masukkan nomor telepon"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="address" className="block text-lg text-[#4a5c2f] font-medium">
                    Address
                  </label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Masukkan alamat"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-lg text-[#4a5c2f] font-medium">
                    Password
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Masukkan password"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-lg text-[#4a5c2f] font-medium">
                    Confirm Password
                  </label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Konfirmasi password"
                    required
                    disabled={isLoading}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full py-3 bg-[#b3a278] hover:bg-[#a39068] text-[#4a5c2f] text-lg font-medium rounded-lg mt-4"
                  disabled={isLoading}
                >
                  {isLoading ? "Memproses..." : "Sign Up"}
                </Button>
              </form>

              <div className="mt-4 text-center">
                <p className="text-[#4a5c2f]">
                  Sudah punya akun?{" "}
                  <Link href="/login" className="text-[#4a5c2f] font-bold hover:underline">
                    Login
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
