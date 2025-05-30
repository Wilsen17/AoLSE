"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronRight, Camera } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    email: "",
    address: "",
    profilePicture: "",
  })
  const [isEditing, setIsEditing] = useState({
    username: false,
    phone: false,
    email: false,
    address: false,
  })

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const userObj = JSON.parse(userData)
    setUser(userObj)
    setFormData({
      username: userObj.username || "",
      phone: userObj.phone || "",
      email: userObj.email || "",
      address: userObj.address || "",
      profilePicture: userObj.profilePicture || "",
    })
    setIsLoading(false)
  }, [router])

  const handleEdit = (field: string) => {
    setIsEditing((prev) => ({
      ...prev,
      [field]: !prev[field as keyof typeof prev],
    }))
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Ukuran file terlalu besar. Maksimal 5MB.")
        return
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        alert("File harus berupa gambar.")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const base64String = e.target?.result as string
        setFormData((prev) => ({
          ...prev,
          profilePicture: base64String,
        }))
        setImageError(false) // Reset image error when new image is loaded
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageError = () => {
    setImageError(true)
  }

  const handleSave = async () => {
    try {
      // Update user data in localStorage
      const updatedUser = { ...user, ...formData }
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setUser(updatedUser)

      // Reset editing states
      setIsEditing({
        username: false,
        phone: false,
        email: false,
        address: false,
      })

      alert("Profile berhasil diperbarui!")

      // Refresh page to update navbar
      window.location.reload()
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Terjadi kesalahan saat memperbarui profile")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  // Function to check if profile picture is valid
  const hasValidProfilePicture = () => {
    return (
      formData.profilePicture &&
      formData.profilePicture.length > 0 &&
      !imageError &&
      (formData.profilePicture.startsWith("data:image/") || formData.profilePicture.startsWith("http"))
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main
        className="flex-1 py-8 px-6"
        style={{
          backgroundImage: `url('/images/leaf-pattern-new.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#f8f3e2",
        }}
      >
        <div className="container mx-auto max-w-2xl">
          {/* Profile Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-[#4a5c2f] bg-[#f8f4e3] inline-block px-6 py-3 rounded-xl shadow-md">
              Edit Profile
            </h1>

            {/* Logout Button - Moved to right */}
            <Button
              onClick={handleLogout}
              className="bg-[#3a4c1f] hover:bg-[#AC9362] text-[#FFC300] font-bold px-6 py-2 rounded-lg"
            >
              Log Out
            </Button>
          </div>

          {/* Profile Photo with Edit Button - Outside green box */}
          <div className="flex justify-center mb-8 relative">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-[#7a8c4f] flex items-center justify-center border-4 border-[#f8f4e3] shadow-lg">
              {hasValidProfilePicture() ? (
                <Image
                  src={formData.profilePicture || "/placeholder.svg"}
                  alt="Profile Picture"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                  priority
                />
              ) : (
                <span className="text-white text-4xl font-bold">
                  {user?.username ? user.username.charAt(0).toUpperCase() : "U"}
                </span>
              )}
            </div>
            <input
              type="file"
              id="profile-picture-input"
              accept="image/*"
              onChange={handleProfilePictureChange}
              className="hidden"
            />
            <Button
              onClick={() => document.getElementById("profile-picture-input")?.click()}
              className="absolute bottom-0 right-1/3 bg-[#b3a278] hover:bg-[#a39068] text-[#4a5c2f] rounded-full w-10 h-10 flex items-center justify-center shadow-lg"
              title="Edit Profile Picture"
            >
              <Camera size={18} />
            </Button>
          </div>

          {/* Profile Form */}
          <div className="bg-[#7a8c4f] rounded-2xl p-8 shadow-lg">
            <div className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-[#FFA500] font-bold text-lg mb-2">Name</label>
                <div className="flex items-center bg-white rounded-lg p-4">
                  {isEditing.username ? (
                    <Input
                      value={formData.username}
                      onChange={(e) => handleChange("username", e.target.value)}
                      className="flex-1 border-none bg-transparent text-[#4a5c2f] font-medium text-lg"
                      onBlur={() => handleEdit("username")}
                      autoFocus
                    />
                  ) : (
                    <span className="flex-1 text-[#4a5c2f] font-medium text-lg">{formData.username}</span>
                  )}
                  <button onClick={() => handleEdit("username")} className="text-[#4a5c2f] ml-2">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              {/* Phone Number Field */}
              <div>
                <label className="block text-[#FFA500] font-bold text-lg mb-2">Phone Number</label>
                <div className="flex items-center bg-white rounded-lg p-4">
                  {isEditing.phone ? (
                    <Input
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className="flex-1 border-none bg-transparent text-[#4a5c2f] font-medium text-lg"
                      onBlur={() => handleEdit("phone")}
                      autoFocus
                    />
                  ) : (
                    <span className="flex-1 text-[#4a5c2f] font-medium text-lg">{formData.phone}</span>
                  )}
                  <button onClick={() => handleEdit("phone")} className="text-[#4a5c2f] ml-2">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-[#FFA500] font-bold text-lg mb-2">Email</label>
                <div className="flex items-center bg-white rounded-lg p-4">
                  {isEditing.email ? (
                    <Input
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="flex-1 border-none bg-transparent text-[#4a5c2f] font-medium text-lg"
                      onBlur={() => handleEdit("email")}
                      autoFocus
                    />
                  ) : (
                    <span className="flex-1 text-[#4a5c2f] font-medium text-lg">{formData.email}</span>
                  )}
                  <button onClick={() => handleEdit("email")} className="text-[#4a5c2f] ml-2">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              {/* Address Field */}
              <div>
                <label className="block text-[#FFA500] font-bold text-lg mb-2">Address</label>
                <div className="flex items-center bg-white rounded-lg p-4">
                  {isEditing.address ? (
                    <Input
                      value={formData.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      className="flex-1 border-none bg-transparent text-[#4a5c2f] font-medium text-lg"
                      onBlur={() => handleEdit("address")}
                      autoFocus
                    />
                  ) : (
                    <span className="flex-1 text-[#4a5c2f] font-medium text-lg">{formData.address}</span>
                  )}
                  <button onClick={() => handleEdit("address")} className="text-[#4a5c2f] ml-2">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-8 text-center">
              <Button
                onClick={handleSave}
                className="bg-[#b3a278] hover:bg-[#a39068] text-[#4a5c2f] font-bold px-12 py-3 rounded-lg text-lg"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#DDB04E] py-8 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image src="/images/logo.png" alt="Your Daily Meal" width={100} height={50} className="h-auto" />
              <div className="text-[#4a5c2f]">
                <h3 className="text-xl font-bold">FAQ</h3>
                <p className="text-sm">Hubungi kami untuk pertanyaan</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <a href="https://wa.me/62895639201682" target="_blank" rel="noopener noreferrer">
                <div className="w-8 h-8 bg-[#4a5c2f] rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-white"
                    viewBox="0 0 32 32"
                    fill="currentColor"
                  >
                    <path d="M16 0C7.164 0 0 7.163 0 16c0 2.822.736 5.467 2.02 7.785L0 32l8.352-2.188A15.94 15.94 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm8.613 23.387c-.363 1.02-2.124 1.99-2.922 2.117-.748.117-1.68.166-2.714-.166-.624-.197-1.426-.459-2.45-.9-4.31-1.857-7.117-6.4-7.334-6.7-.215-.3-1.75-2.333-1.75-4.45 0-2.117 1.084-3.167 1.47-3.6.363-.4.793-.5 1.057-.5.27 0 .53.003.763.014.247.012.577-.093.9.7.363.9 1.235 3.1 1.345 3.317.11.217.182.47.036.77-.146.3-.22.47-.43.72-.215.25-.45.56-.64.75-.215.215-.44.45-.19.9.25.45 1.11 1.83 2.38 2.97 1.64 1.46 3.02 1.91 3.47 2.13.45.22.71.18.98-.11.27-.29 1.12-1.3 1.42-1.75.3-.45.6-.37 1.01-.22.41.15 2.6 1.23 3.05 1.45.45.22.75.33.86.51.11.18.11 1.05-.25 2.07z" />
                  </svg>
                </div>
              </a>

              {/* YouTube */}
              <a
                href="https://www.youtube.com/channel/UCzgxx_DM2Dcb9Y1spb9mUJA"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="w-8 h-8 bg-[#4a5c2f] rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 576 512"
                  >
                    <path d="M549.7 124.1C537.5 80.9 502.3 48 459 40.1 403.3 32 288 32 288 32s-115.3 0-171 8c-43.3 7.9-78.5 40.8-90.7 83.9C16 166.4 16 256 16 256s0 89.6 10.3 131.9c12.2 43.1 47.4 76 90.7 83.9 55.7 8 171 8 171 8s115.3 0 171-8c43.3-7.9 78.5-40.8 90.7-83.9C560 345.6 560 256 560 256s0-89.6-10.3-131.9zM232 338.5V173.5L361 256 232 338.5z" />
                  </svg>
                </div>
              </a>

              {/* Facebook */}
              <a href="https://www.facebook.com/JYPETWICE/" target="_blank" rel="noopener noreferrer">
                <div className="w-8 h-8 bg-[#4a5c2f] rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 320 512"
                  >
                    <path d="M279.14 288l14.22-92.66h-88.91V133.34c0-25.35 12.42-50.06 52.24-50.06H293V6.26S259.24 0 225.36 0c-73.61 0-121.08 44.38-121.08 124.72V195.3H22.89V288h81.39v224h100.2V288z" />
                  </svg>
                </div>
              </a>
            </div>
            <div className="text-center text-[#4a5c2f]">
              <p className="text-sm">Subscribe ke surat berita untuk mendapatkan informasi dan promo menarik lainnya</p>
              <div className="flex mt-2">
                <input type="email" placeholder="Masukkan E-mail anda" className="px-3 py-1 rounded-l-lg text-sm" />
                <button className="bg-[#7a8c4f] text-white px-3 py-1 rounded-r-lg text-sm">Sign Up</button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
