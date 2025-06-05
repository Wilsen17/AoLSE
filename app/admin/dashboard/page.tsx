"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { UtensilsCrossed, ShoppingCart, Settings, LogOut, Plus } from "lucide-react"

export default function AdminDashboard() {
  const router = useRouter()
  const [admin, setAdmin] = useState<any>(null)
  const [stats, setStats] = useState({
    totalMenuItems: 0,
    totalAdditionalItems: 0,
    todayOrders: 0,
    totalUsers: 0,
  })

  useEffect(() => {
    // Check if admin is logged in
    const adminData = localStorage.getItem("admin")
    if (!adminData) {
      router.push("/login")
      return
    }
    setAdmin(JSON.parse(adminData))
    calculateStats()
  }, [router])

  const calculateStats = () => {
    // Calculate total menu items - 10 items per day for 6 days = 60 total items
    const storedMenu = localStorage.getItem("adminMenu")
    const menuItems = storedMenu ? JSON.parse(storedMenu) : []
    const totalMenuItems = menuItems.length > 0 ? menuItems.length : 60 // Default to 60 if not set yet

    // Calculate additional items
    const storedAdditional = localStorage.getItem("additionalItems")
    const additionalItems = storedAdditional
      ? JSON.parse(storedAdditional)
      : [
          { id: 1, name: "Sambal Bawang", price: 2000, category: "sambal" },
          { id: 2, name: "Sambal Matah", price: 2000, category: "sambal" },
          { id: 3, name: "Sambal Ijo", price: 2000, category: "sambal" },
          { id: 4, name: "Sambal Terasi", price: 2000, category: "sambal" },
        ]
    const totalAdditionalItems = additionalItems.length

    // Calculate total users from localStorage
    let totalUsers = 0

    // Count users stored with user_ prefix
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith("user_")) {
        try {
          const userData = localStorage.getItem(key)
          if (userData) {
            const user = JSON.parse(userData)
            if (user.email && user.username) {
              totalUsers++
            }
          }
        } catch (e) {
          console.error("Error parsing user data:", e)
        }
      }
    }

    // Also check for users stored in 'users' key
    const storedUsers = localStorage.getItem("users")
    if (storedUsers) {
      try {
        const usersArray = JSON.parse(storedUsers)
        totalUsers += usersArray.filter((user: any) => user.email && user.username).length
      } catch (e) {
        console.error("Error parsing users array:", e)
      }
    }

    // Calculate today's orders
    let todayOrders = 0
    const today = new Date().toDateString()

    // Get all user-specific orders
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith("orders_")) {
        try {
          const userOrders = JSON.parse(localStorage.getItem(key) || "[]")
          const todayUserOrders = userOrders.filter((order: any) => new Date(order.date).toDateString() === today)
          todayOrders += todayUserOrders.length
        } catch (e) {
          console.error("Error parsing orders:", e)
        }
      }
    }

    setStats({
      totalMenuItems,
      totalAdditionalItems,
      todayOrders,
      totalUsers,
    })
  }

  const handleLogout = () => {
    localStorage.removeItem("admin")
    router.push("/login")
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
            <Image src="/images/logo.png" alt="Your Daily Meal" width={120} height={56} className="h-auto" />
            <span className="text-[#4a5c2f] font-bold text-xl">Admin Panel</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-[#4a5c2f] font-medium">Welcome, {admin.name}</span>
            <Button
              onClick={handleLogout}
              className="bg-[#7a8c4f] text-white px-4 py-2 rounded-lg hover:bg-[#5a6c3f] flex items-center space-x-2"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="container mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-[#4a5c2f] mb-8 text-center">Dashboard Admin</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Kelola Menu */}
              <Link href="/admin/menu">
                <div className="bg-[#f8f3e2] rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-[#7a8c4f]">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-[#7a8c4f] p-4 rounded-full mb-4">
                      <UtensilsCrossed size={32} className="text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#4a5c2f] mb-2">Kelola Menu</h3>
                    <p className="text-[#7a8c4f] text-sm">Tambah, edit, dan hapus menu harian</p>
                  </div>
                </div>
              </Link>

              {/* Kelola Additional */}
              <Link href="/admin/additional">
                <div className="bg-[#f8f3e2] rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-[#7a8c4f]">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-[#FFA500] p-4 rounded-full mb-4">
                      <Plus size={32} className="text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#4a5c2f] mb-2">Kelola Additional</h3>
                    <p className="text-[#7a8c4f] text-sm">Kelola item tambahan seperti sambal</p>
                  </div>
                </div>
              </Link>

              {/* Kelola Pesanan */}
              <Link href="/admin/orders">
                <div className="bg-[#f8f3e2] rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-[#7a8c4f]">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-[#b3a278] p-4 rounded-full mb-4">
                      <ShoppingCart size={32} className="text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#4a5c2f] mb-2">Kelola Pesanan</h3>
                    <p className="text-[#7a8c4f] text-sm">Monitor dan update status pesanan</p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Pengaturan - Centered */}
            <div className="mt-6 flex justify-center">
              <Link href="/admin/settings">
                <div className="bg-[#f8f3e2] rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-[#7a8c4f] w-64">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-[#4a5c2f] p-4 rounded-full mb-4">
                      <Settings size={32} className="text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#4a5c2f] mb-2">Pengaturan</h3>
                    <p className="text-[#7a8c4f] text-sm">Konfigurasi sistem dan aplikasi</p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Real Stats */}
            {/* Real Stats */}
            <div className="mt-8 flex justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-[#7a8c4f] text-white rounded-lg p-6 text-center">
                  <h4 className="text-2xl font-bold mb-2">{stats.totalMenuItems}</h4>
                  <p className="text-sm opacity-90">Total Menu Items</p>
                </div>
                <div className="bg-[#FFA500] text-white rounded-lg p-6 text-center">
                  <h4 className="text-2xl font-bold mb-2">{stats.totalAdditionalItems}</h4>
                  <p className="text-sm opacity-90">Total Additional Items</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
