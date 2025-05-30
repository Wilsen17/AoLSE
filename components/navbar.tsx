"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    setUser(null)
    setShowDropdown(false)
    window.location.href = "/"
  }

  return (
    <header className="w-full bg-[#b3a278] py-4 px-6">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image src="/images/logo.png" alt="Your Daily Meal" width={150} height={70} className="h-auto" />
        </Link>
        <nav className="hidden md:flex items-center space-x-10">
          <Link href="/" className="text-[#4a5c2f] text-xl font-medium hover:text-[#3a4a25]">
            Home
          </Link>
          <Link href="/about" className="text-[#4a5c2f] text-xl font-medium hover:text-[#3a4a25]">
            About
          </Link>
          <Link href="/menu" className="text-[#4a5c2f] text-xl font-medium hover:text-[#3a4a25]">
            Menu
          </Link>
          <Link href="/location" className="text-[#4a5c2f] text-xl font-medium hover:text-[#3a4a25]">
            Location
          </Link>
          {user && (
            <Link href="/history" className="text-[#4a5c2f] text-xl font-medium hover:text-[#3a4a25]">
              History
            </Link>
          )}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="w-10 h-10 bg-[#7a8c4f] rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                </div>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-[#4a5c2f]">{user.username}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-[#4a5c2f] hover:bg-gray-100"
                    onClick={() => setShowDropdown(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-[#7a8c4f] text-white px-6 py-2 rounded-lg hover:bg-[#5a6c3f] text-lg font-medium"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
