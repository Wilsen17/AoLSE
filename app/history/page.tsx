"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Order {
  id: string
  date: string
  items: string[]
  total: number
  status: "pending" | "confirmed" | "delivered" | "cancelled"
}

export default function HistoryPage() {
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))

    // Mock order data - in real app, this would come from API
    const mockOrders: Order[] = [
      {
        id: "ORD-001",
        date: "2024-01-15",
        items: ["Nasi Goreng", "Capcay Seafood", "Es Teh"],
        total: 45000,
        status: "delivered",
      },
      {
        id: "ORD-002",
        date: "2024-01-10",
        items: ["Telur Balado", "Tumis Buncis", "Nasi Putih"],
        total: 35000,
        status: "delivered",
      },
      {
        id: "ORD-003",
        date: "2024-01-08",
        items: ["Martabak Telur", "Ikan Teri", "Jus Jeruk"],
        total: 40000,
        status: "confirmed",
      },
    ]
    setOrders(mockOrders)
  }, [router])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Menunggu"
      case "confirmed":
        return "Dikonfirmasi"
      case "delivered":
        return "Terkirim"
      case "cancelled":
        return "Dibatalkan"
      default:
        return status
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main
        className="flex-1 py-16 px-6"
        style={{
          backgroundImage: `url('/images/leaf-pattern-new.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#f8f3e2",
        }}
      >
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <h1 className="text-4xl font-bold text-[#4a5c2f] mb-8 text-center">Riwayat Pesanan</h1>

            <div className="mb-6">
              <p className="text-lg text-[#4a5c2f]">
                Halo, <span className="font-semibold">{user.username}</span>! Berikut adalah riwayat pesanan Anda:
              </p>
            </div>

            <div className="space-y-6">
              {orders.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500 text-lg">Belum ada riwayat pesanan</p>
                  </CardContent>
                </Card>
              ) : (
                orders.map((order) => (
                  <Card key={order.id} className="border-2 border-[#b3a278]">
                    <CardHeader className="bg-[#f8f3e2]">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-[#4a5c2f]">Order #{order.id}</CardTitle>
                        <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Tanggal: {new Date(order.date).toLocaleDateString("id-ID")}
                      </p>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <h4 className="font-semibold text-[#4a5c2f] mb-2">Item Pesanan:</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {order.items.map((item, index) => (
                            <li key={index} className="text-gray-700">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t">
                        <span className="font-semibold text-[#4a5c2f]">Total:</span>
                        <span className="font-bold text-lg text-[#7a8c4f]">
                          Rp {order.total.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
