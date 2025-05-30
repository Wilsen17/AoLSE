"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"

export default function SignupPage() {
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
    // Clear error when user types
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Akun berhasil dibuat! Silakan login.")
        // Reset form
        setFormData({
          username: "",
          email: "",
          phone: "",
          address: "",
          password: "",
          confirmPassword: "",
        })

        // Redirect to login page after 2 seconds
        setTimeout(() => {
          window.location.href = "/login"
        }, 2000)
      } else {
        setError(data.error || "Terjadi kesalahan")
      }
    } catch (error) {
      console.error("Error:", error)
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
                    placeholder="Enter your username"
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
                    placeholder="Enter your email"
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
                    placeholder="Enter your phone number"
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
                    placeholder="Enter your address"
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
                    placeholder="Enter your password"
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
                    placeholder="Confirm your password"
                    required
                    disabled={isLoading}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full py-3 bg-[#b3a278] hover:bg-[#a39068] text-[#4a5c2f] text-lg font-medium rounded-lg mt-4"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Sign Up"}
                </Button>
              </form>

              <div className="mt-4 text-center">
                <p className="text-[#4a5c2f]">
                  Already have an account?{" "}
                  <Link href="/login" className="text-[#4a5c2f] font-bold hover:underline">
                    Click Here
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
