"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Eye, Search, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { userStorage, type User } from "@/lib/user-storage"

export default function AdminUsersPage() {
  const router = useRouter()
  const [admin, setAdmin] = useState<any>(null)
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Check if admin is logged in
    try {
      const adminData = localStorage.getItem("admin")
      if (!adminData) {
        router.push("/admin/login")
        return
      }
      setAdmin(JSON.parse(adminData))
      loadUsers()
    } catch (error) {
      console.error("Error loading admin data:", error)
      router.push("/admin/login")
    }
  }, [router, mounted])

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
    try {
      // Get users from our userStorage
      const allUsers = await userStorage.getAllUsers()
      setUsers(allUsers.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()))
      setFilteredUsers(allUsers)
    } catch (error) {
      console.error("Error loading users:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      const success = await userStorage.deleteUser(userId)
      if (success) {
        // Remove from current state
        setUsers(users.filter((user) => user.id !== userId))
        setFilteredUsers(filteredUsers.filter((user) => user.id !== userId))
        setUserToDelete(null)
        alert("User berhasil dihapus!")
      } else {
        alert("Gagal menghapus user!")
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      alert("Terjadi kesalahan saat menghapus user!")
    }
  }

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4a5c2f] mx-auto"></div>
          <p className="mt-4 text-[#4a5c2f]">Loading...</p>
        </div>
      </div>
    )
  }

  if (!admin && loading) {
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
                <Button onClick={loadUsers} className="bg-[#7a8c4f] text-white hover:bg-[#5a6c3f]">
                  Refresh
                </Button>
              </div>
            </div>

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
                      <td className="px-4 py-3 text-sm">{user.id.toString().slice(-8)}</td>
                      <td className="px-4 py-3 font-medium text-[#4a5c2f]">{user.username}</td>
                      <td className="px-4 py-3 text-sm">{user.email}</td>
                      <td className="px-4 py-3 text-sm">{user.phone}</td>
                      <td className="px-4 py-3 text-sm max-w-xs truncate" title={user.address}>
                        {user.address}
                      </td>
                      <td className="px-4 py-3 text-sm">{new Date(user.created_at).toLocaleDateString("id-ID")}</td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => setSelectedUser(user)}
                            className="bg-[#b3a278] text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                          >
                            <Eye size={14} />
                            <span>Detail</span>
                          </Button>
                          <Button
                            onClick={() => setUserToDelete(user)}
                            className="bg-red-500 text-white px-3 py-1 rounded text-sm flex items-center space-x-1 hover:bg-red-600"
                          >
                            <Trash2 size={14} />
                            <span>Delete</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  {searchTerm
                    ? `Tidak ada pengguna yang ditemukan untuk "${searchTerm}"`
                    : "Belum ada pengguna terdaftar"}
                </p>
              </div>
            )}

            {/* Summary */}
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
                      <p className="font-medium">{selectedUser.id}</p>
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
                  </div>
                </div>

                <div className="bg-[#f8f3e2] p-4 rounded-lg">
                  <h3 className="font-semibold text-[#4a5c2f] mb-3">Terakhir Diupdate</h3>
                  <p className="font-medium">
                    {new Date(selectedUser.updated_at || selectedUser.created_at).toLocaleDateString("id-ID", {
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
      )}

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-[#4a5c2f] mb-4">Konfirmasi Hapus User</h2>
              <p className="text-gray-700 mb-6">
                Apakah Anda yakin ingin menghapus user <strong>{userToDelete.username}</strong>? Tindakan ini tidak
                dapat dibatalkan.
              </p>
              <div className="flex space-x-4">
                <Button
                  onClick={() => handleDeleteUser(userToDelete.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Ya, Hapus
                </Button>
                <Button
                  onClick={() => setUserToDelete(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Batal
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
