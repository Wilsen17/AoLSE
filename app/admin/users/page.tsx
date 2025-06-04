"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Eye, Search, RefreshCw } from "lucide-react"
import { Input } from "@/components/ui/input"

interface User {
  id: string
  username: string
  email: string
  phone: string
  address: string
  created_at: string
  updated_at: string
}

export default function AdminUsersPage() {
  const router = useRouter()
  const [admin, setAdmin] = useState<any>(null)
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if admin is logged in
    const adminData = localStorage.getItem("admin")
    if (!adminData) {
      router.push("/admin/login")
      return
    }
    setAdmin(JSON.parse(adminData))
    loadUsers()
  }, [router])

  useEffect(() => {
    // Filter users based on search term
    if (searchTerm) {
      const filtered = users.filter(
        (user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone.includes(searchTerm),
      )
      setFilteredUsers(filtered)
    } else {
      setFilteredUsers(users)
    }
  }, [searchTerm, users])

  const loadUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/admin/users")
      const data = await response.json()

      if (response.ok) {
        setUsers(data.users || [])
        setFilteredUsers(data.users || [])
      } else {
        setError(data.error || "Gagal memuat data pengguna")
      }
    } catch (error) {
      console.error("Error loading users:", error)
      setError("Terjadi kesalahan saat memuat data")
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    loadUsers()
  }

  if (!admin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4a5c2f] mx-auto"></div>
          <p className="mt-4 text-[#4a5c2f]">Loading...</p>
        </div>
      </div>
    )
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
            <Image src="/images/logo.png" alt="Your Daily Meal" width={120} height={56} className="h-auto" />
          </div>
          <span className="text-[#4a5c2f] font-medium">Admin: {admin?.name || "Admin"}</span>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="container mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-8">
            <div className="mb-6">
              <Button
                onClick={() => router.push("/admin/dashboard")}
                className="bg-[#7a8c4f] text-white px-4 py-2 rounded-lg hover:bg-[#5a6c3f] flex items-center space-x-2"
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </Button>
            </div>

            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-[#4a5c2f]">Kelola Pengguna</h1>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    placeholder="Cari pengguna..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button
                  onClick={handleRefresh}
                  className="bg-[#7a8c4f] text-white hover:bg-[#5a6c3f] flex items-center space-x-2"
                  disabled={loading}
                >
                  <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                  <span>Refresh</span>
                </Button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                <p>{error}</p>
                <Button onClick={handleRefresh} className="mt-2 bg-red-600 text-white hover:bg-red-700">
                  Coba Lagi
                </Button>
              </div>
            )}

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full bg-[#f8f3e2] rounded-lg overflow-hidden">
                <thead className="bg-[#7a8c4f] text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">ID</th>
                    <th className="px-4 py-3 text-left">Username</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Phone</th>
                    <th className="px-4 py-3 text-left">Alamat</th>
                    <th className="px-4 py-3 text-left">Tanggal Daftar</th>
                    <th className="px-4 py-3 text-left">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr key={user.id} className={index % 2 === 0 ? "bg-white" : "bg-[#f8f3e2]"}>
                      <td className="px-4 py-3 text-sm font-mono">{user.id.slice(-8)}</td>
                      <td className="px-4 py-3 font-medium text-[#4a5c2f]">{user.username}</td>
                      <td className="px-4 py-3 text-sm">{user.email}</td>
                      <td className="px-4 py-3 text-sm">{user.phone}</td>
                      <td className="px-4 py-3 text-sm max-w-xs truncate" title={user.address}>
                        {user.address}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {new Date(user.created_at).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          onClick={() => setSelectedUser(user)}
                          className="bg-[#b3a278] text-white px-3 py-1 rounded text-sm flex items-center space-x-1 hover:bg-[#9a8a65]"
                        >
                          <Eye size={14} />
                          <span>Detail</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {filteredUsers.length === 0 && !loading && !error && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">
                  {searchTerm
                    ? `Tidak ada pengguna yang ditemukan untuk "${searchTerm}"`
                    : "Belum ada pengguna terdaftar"}
                </p>
                <Button onClick={handleRefresh} className="bg-[#7a8c4f] text-white hover:bg-[#5a6c3f]">
                  Refresh Data
                </Button>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4a5c2f] mx-auto"></div>
                <p className="mt-4 text-gray-500">Memuat data pengguna...</p>
              </div>
            )}

            {/* Summary */}
            {!loading && !error && (
              <div className="mt-6 bg-[#f8f3e2] rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <h3 className="text-2xl font-bold text-[#4a5c2f]">{users.length}</h3>
                    <p className="text-[#7a8c4f]">Total Pengguna</p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#4a5c2f]">{filteredUsers.length}</h3>
                    <p className="text-[#7a8c4f]">Hasil Pencarian</p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#4a5c2f]">
                      {
                        users.filter((user) => new Date(user.created_at).toDateString() === new Date().toDateString())
                          .length
                      }
                    </h3>
                    <p className="text-[#7a8c4f]">Daftar Hari Ini</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-[#4a5c2f]">Detail Pengguna</h2>
                <Button
                  onClick={() => setSelectedUser(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Tutup
                </Button>
              </div>

              <div className="space-y-4">
                <div className="bg-[#f8f3e2] p-4 rounded-lg">
                  <h3 className="font-semibold text-[#4a5c2f] mb-3">Informasi Pribadi</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">ID Pengguna</p>
                      <p className="font-medium font-mono">{selectedUser.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Username</p>
                      <p className="font-medium">{selectedUser.username}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{selectedUser.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Nomor Telepon</p>
                      <p className="font-medium">{selectedUser.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#f8f3e2] p-4 rounded-lg">
                  <h3 className="font-semibold text-[#4a5c2f] mb-3">Alamat</h3>
                  <p className="text-gray-700">{selectedUser.address}</p>
                </div>

                <div className="bg-[#f8f3e2] p-4 rounded-lg">
                  <h3 className="font-semibold text-[#4a5c2f] mb-3">Informasi Akun</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Tanggal Daftar</p>
                      <p className="font-medium">
                        {new Date(selectedUser.created_at).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Terakhir Diupdate</p>
                      <p className="font-medium">
                        {new Date(selectedUser.updated_at).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
