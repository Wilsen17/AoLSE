"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Save, Eye, EyeOff } from "lucide-react"

export default function AdminSettingsPage() {
  const router = useRouter()
  const [admin, setAdmin] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error">("success")

  useEffect(() => {
    // Check if admin is logged in
    const adminData = localStorage.getItem("admin")
    if (!adminData) {
      router.push("/login")
      return
    }
    const parsedAdmin = JSON.parse(adminData)
    setAdmin(parsedAdmin)
    setFormData({
      name: parsedAdmin.name || "",
      email: parsedAdmin.email || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
  }, [router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate current password
    if (formData.currentPassword !== admin.password) {
      setMessage("Password saat ini tidak benar")
      setMessageType("error")
      return
    }

    // Validate new password if provided
    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        setMessage("Konfirmasi password tidak cocok")
        setMessageType("error")
        return
      }
      if (formData.newPassword.length < 6) {
        setMessage("Password baru minimal 6 karakter")
        setMessageType("error")
        return
      }
    }

    // Update admin data
    const updatedAdmin = {
      ...admin,
      name: formData.name,
      email: formData.email,
      password: formData.newPassword || admin.password,
    }

    localStorage.setItem("admin", JSON.stringify(updatedAdmin))
    setAdmin(updatedAdmin)

    // Clear password fields
    setFormData({
      ...formData,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })

    setMessage("Pengaturan berhasil disimpan")
    setMessageType("success")
  }

  if (!admin) {
    return <div>Loading...</div>
  }

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{
        backgroundImage: "url('/images/leaf-pattern-new.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Admin Header */}
      <header className="w-full bg-[#b3a278] py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin/dashboard">
              <Button className="bg-[#7a8c4f] text-white px-4 py-2 rounded-lg hover:bg-[#5a6c3f] flex items-center space-x-2">
                <ArrowLeft size={16} />
                <span>Back</span>
              </Button>
            </Link>
            <Image src="/images/logo.png" alt="Your Daily Meal" width={120} height={56} className="h-auto" />
          </div>
          <span className="text-[#4a5c2f] font-medium">Admin: {admin.name}</span>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="container mx-auto max-w-2xl">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-[#4a5c2f] mb-8 text-center">Pengaturan Admin</h1>

            {message && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  messageType === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="bg-[#f8f3e2] p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-[#4a5c2f] mb-4">Informasi Dasar</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#4a5c2f] mb-2">Nama</label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#4a5c2f] mb-2">Email</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Password Change */}
              <div className="bg-[#f8f3e2] p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-[#4a5c2f] mb-4">Ubah Password</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#4a5c2f] mb-2">Password Saat Ini</label>
                    <div className="relative">
                      <Input
                        type={showCurrentPassword ? "text" : "password"}
                        value={formData.currentPassword}
                        onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                        className="w-full pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >
                        {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#4a5c2f] mb-2">
                      Password Baru (kosongkan jika tidak ingin mengubah)
                    </label>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        value={formData.newPassword}
                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                        className="w-full pr-10"
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >
                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  {formData.newPassword && (
                    <div>
                      <label className="block text-sm font-medium text-[#4a5c2f] mb-2">Konfirmasi Password Baru</label>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          className="w-full pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        >
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <Button
                  type="submit"
                  className="bg-[#7a8c4f] text-white px-8 py-3 rounded-lg hover:bg-[#5a6c3f] flex items-center space-x-2"
                >
                  <Save size={16} />
                  <span>Simpan Pengaturan</span>
                </Button>
              </div>
            </form>

            {/* System Information */}
            <div className="mt-8 bg-[#f8f3e2] p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-[#4a5c2f] mb-4">Informasi Sistem</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Versi Aplikasi</p>
                  <p className="font-medium">1.0.0</p>
                </div>
                <div>
                  <p className="text-gray-600">Terakhir Login</p>
                  <p className="font-medium">{new Date().toLocaleDateString("id-ID")}</p>
                </div>
                <div>
                  <p className="text-gray-600">Status</p>
                  <p className="font-medium text-green-600">Aktif</p>
                </div>
                <div>
                  <p className="text-gray-600">Role</p>
                  <p className="font-medium">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
