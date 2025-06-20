"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Eye, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface Order {
  id: string
  userId: string
  items: any[]
  total: number
  status: string
  date: string
  paymentMethod: string
  paymentProof?: string
}

export default function AdminOrdersPage() {
  const router = useRouter()
  const [admin, setAdmin] = useState<any>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedPaymentProof, setSelectedPaymentProof] = useState<string | null>(null)

  useEffect(() => {
    // Check if admin is logged in
    const adminData = localStorage.getItem("admin")
    if (!adminData) {
      router.push("/login")
      return
    }
    setAdmin(JSON.parse(adminData))

    // Clean up any phantom data before loading
    cleanupPhantomData()
    loadOrders()
  }, [router])

  const cleanupPhantomData = () => {
    // Remove any hardcoded dummy orders
    const keysToRemove: string[] = []

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith("orders_")) {
        try {
          const orders = JSON.parse(localStorage.getItem(key) || "[]")
          // Remove orders with dummy IDs like ORD-001
          const cleanedOrders = orders.filter(
            (order: any) =>
              !order.id.includes("ORD-001") &&
              !order.id.includes("dummy") &&
              order.date &&
              new Date(order.date).getTime() > 0,
          )

          if (cleanedOrders.length !== orders.length) {
            if (cleanedOrders.length === 0) {
              keysToRemove.push(key)
            } else {
              localStorage.setItem(key, JSON.stringify(cleanedOrders))
            }
          }
        } catch (e) {
          keysToRemove.push(key)
        }
      }
    }

    // Remove empty order arrays
    keysToRemove.forEach((key) => localStorage.removeItem(key))
  }

  useEffect(() => {
    // Filter orders based on search term and status
    let filtered = orders

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    if (searchTerm) {
      filtered = filtered.filter((order) => order.id.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    setFilteredOrders(filtered)
  }, [searchTerm, orders, statusFilter])

  const loadOrders = () => {
    const allOrders: Order[] = []

    // Clear any phantom data first
    try {
      // Only get orders from localStorage that have valid user emails
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith("orders_") && key.includes("@")) {
          const userEmail = key.replace("orders_", "")

          // Verify this user actually exists
          const storedUsers = localStorage.getItem("ydm_users")
          const users = storedUsers ? JSON.parse(storedUsers) : []
          const userExists = users.some((user: any) => user.email === userEmail)

          if (userExists) {
            try {
              const userOrders = JSON.parse(localStorage.getItem(key) || "[]")

              // Only add orders that have all required fields and are valid
              userOrders.forEach((order: any) => {
                if (
                  order.id &&
                  order.date &&
                  order.items &&
                  Array.isArray(order.items) &&
                  order.items.length > 0 &&
                  typeof order.total === "number" &&
                  order.total > 0 &&
                  order.status
                ) {
                  allOrders.push({
                    ...order,
                    userId: userEmail,
                  })
                }
              })
            } catch (e) {
              console.error("Error parsing orders for", userEmail, e)
              // Remove invalid order data
              localStorage.removeItem(key)
            }
          } else {
            // Remove orders for non-existent users
            localStorage.removeItem(key)
          }
        }
      }

      // Remove any phantom activeOrder
      const activeOrder = localStorage.getItem("activeOrder")
      if (activeOrder) {
        try {
          const parsedActiveOrder = JSON.parse(activeOrder)
          // Check if this active order belongs to a real user with real orders
          const userOrdersKey = `orders_${parsedActiveOrder.userId || "unknown"}`
          const userOrders = JSON.parse(localStorage.getItem(userOrdersKey) || "[]")
          const orderExists = userOrders.some((order: any) => order.id === parsedActiveOrder.id)

          if (!orderExists) {
            localStorage.removeItem("activeOrder")
          }
        } catch (e) {
          localStorage.removeItem("activeOrder")
        }
      }
    } catch (error) {
      console.error("Error cleaning orders:", error)
    }

    // Sort by date (newest first)
    allOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    setOrders(allOrders)
    setFilteredOrders(allOrders)
  }

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    // Find the order and update its status
    const updatedOrders = orders.map((order) => {
      if (order.id === orderId) {
        const updatedOrder = { ...order, status: newStatus }

        // Update in localStorage
        const userOrdersKey = `orders_${order.userId}`
        const userOrders = JSON.parse(localStorage.getItem(userOrdersKey) || "[]")
        const updatedUserOrders = userOrders.map((userOrder: any) =>
          userOrder.id === orderId ? { ...userOrder, status: newStatus } : userOrder,
        )
        localStorage.setItem(userOrdersKey, JSON.stringify(updatedUserOrders))

        return updatedOrder
      }
      return order
    })

    setOrders(updatedOrders)
    setFilteredOrders(
      updatedOrders.filter((order) => {
        const matchesStatus = statusFilter === "all" || order.status === statusFilter
        const matchesSearch = !searchTerm || order.id.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesStatus && matchesSearch
      }),
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "order_placed":
        return "bg-blue-500"
      case "cooking":
        return "bg-orange-500"
      case "delivery":
        return "bg-green-500"
      case "completed":
        return "bg-green-700"
      case "cancelled":
        return "bg-red-500"
      case "confirmed":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending"
      case "order_placed":
        return "Order Diterima"
      case "cooking":
        return "Sedang Dimasak"
      case "delivery":
        return "Sedang Dikirim"
      case "completed":
        return "Selesai"
      case "cancelled":
        return "Cancelled"
      case "confirmed":
        return "Konfirmasi"
      default:
        return status
    }
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
            <span className="text-[#4a5c2f] font-bold text-xl">Kelola Pesanan</span>
          </div>
          <span className="text-[#4a5c2f] font-medium">Admin: {admin.name}</span>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="container mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-8">
            {/* Back Button */}
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
              <h1 className="text-3xl font-bold text-[#4a5c2f]">Kelola Pesanan</h1>
              <div className="flex items-center space-x-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7a8c4f]"
                >
                  <option value="all">Semua Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Konfirmasi</option>
                  <option value="order_placed">Order Diterima</option>
                  <option value="cooking">Sedang Dimasak</option>
                  <option value="delivery">Sedang Dikirim</option>
                  <option value="completed">Selesai</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    placeholder="Cari pesanan..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="w-full bg-[#f8f3e2] rounded-lg overflow-hidden">
                <thead className="bg-[#7a8c4f] text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">ID Pesanan</th>
                    <th className="px-4 py-3 text-left">Total</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Tanggal</th>
                    <th className="px-4 py-3 text-left">Bukti Pembayaran</th>
                    <th className="px-4 py-3 text-left">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, index) => (
                    <tr key={order.id} className={index % 2 === 0 ? "bg-white" : "bg-[#f8f3e2]"}>
                      <td className="px-4 py-3 text-sm font-mono">{order.id.slice(-8)}</td>
                      <td className="px-4 py-3 font-bold text-[#7a8c4f]">Rp{order.total.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs text-white ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">{new Date(order.date).toLocaleDateString("id-ID")}</td>
                      <td className="px-4 py-3">
                        {order.paymentProof ? (
                          <Button
                            onClick={() => setSelectedPaymentProof(order.paymentProof!)}
                            className="bg-[#b3a278] text-white px-3 py-1 rounded text-sm"
                          >
                            Lihat Bukti
                          </Button>
                        ) : (
                          <span className="text-gray-500 text-sm">Tidak ada</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => setSelectedOrder(order)}
                            className="bg-[#b3a278] text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                          >
                            <Eye size={14} />
                            <span>Detail</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  {searchTerm || statusFilter !== "all"
                    ? "Tidak ada pesanan yang sesuai dengan filter"
                    : "Belum ada pesanan"}
                </p>
              </div>
            )}

            {/* Summary */}
            <div className="mt-6 bg-[#f8f3e2] rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4 text-center">
                <div>
                  <h3 className="text-2xl font-bold text-[#4a5c2f]">{orders.length}</h3>
                  <p className="text-[#7a8c4f]">Total Pesanan</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#4a5c2f]">
                    {orders.filter((order) => order.status === "pending").length}
                  </h3>
                  <p className="text-[#7a8c4f]">Pending</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#4a5c2f]">
                    {orders.filter((order) => order.status === "confirmed").length}
                  </h3>
                  <p className="text-[#7a8c4f]">Konfirmasi</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#4a5c2f]">
                    {orders.filter((order) => order.status === "order_placed").length}
                  </h3>
                  <p className="text-[#7a8c4f]">Order Diterima</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#4a5c2f]">
                    {orders.filter((order) => order.status === "cooking").length}
                  </h3>
                  <p className="text-[#7a8c4f]">Sedang Dimasak</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#4a5c2f]">
                    {orders.filter((order) => order.status === "delivery").length}
                  </h3>
                  <p className="text-[#7a8c4f]">Sedang Dikirim</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#4a5c2f]">
                    {orders.filter((order) => order.status === "completed").length}
                  </h3>
                  <p className="text-[#7a8c4f]">Selesai</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-[#4a5c2f]">Detail Pesanan</h2>
                <Button
                  onClick={() => setSelectedOrder(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Tutup
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Order Info */}
                <div className="space-y-4">
                  <div className="bg-[#f8f3e2] p-4 rounded-lg">
                    <h3 className="font-semibold text-[#4a5c2f] mb-3">Informasi Pesanan</h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-600">ID Pesanan</p>
                        <p className="font-mono">{selectedOrder.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Tanggal</p>
                        <p>
                          {new Date(selectedOrder.date).toLocaleDateString("id-ID", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <span
                          className={`px-2 py-1 rounded-full text-xs text-white ${getStatusColor(
                            selectedOrder.status,
                          )}`}
                        >
                          {getStatusText(selectedOrder.status)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="text-xl font-bold text-[#7a8c4f]">Rp{selectedOrder.total.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Metode Pembayaran</p>
                        <p>{selectedOrder.paymentMethod || "Transfer Bank"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Bukti Pembayaran</p>
                        {selectedOrder.paymentProof ? (
                          <Button
                            onClick={() => setSelectedPaymentProof(selectedOrder.paymentProof!)}
                            className="bg-[#b3a278] text-white px-3 py-1 rounded text-sm mt-1"
                          >
                            Lihat Bukti Pembayaran
                          </Button>
                        ) : (
                          <p className="text-gray-500">Tidak ada bukti pembayaran</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-[#f8f3e2] p-4 rounded-lg">
                  <h3 className="font-semibold text-[#4a5c2f] mb-3">Item Pesanan</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center bg-white p-3 rounded">
                        <div className="flex items-center space-x-3">
                          <Image
                            src={item.image || "/placeholder.svg?height=50&width=50"}
                            alt={item.name}
                            width={50}
                            height={50}
                            className="rounded object-cover"
                          />
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-600">Rp{item.price.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">x{item.quantity}</p>
                          <p className="text-sm text-[#7a8c4f] font-bold">
                            Rp{(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Update Status */}
              {selectedOrder.status !== "delivery" &&
                selectedOrder.status !== "cancelled" &&
                selectedOrder.status !== "completed" && (
                  <div className="mt-6 bg-[#f8f3e2] p-4 rounded-lg">
                    <h3 className="font-semibold text-[#4a5c2f] mb-3">Update Status</h3>
                    <div className="flex space-x-2 flex-wrap">
                      <Button
                        onClick={() => {
                          updateOrderStatus(selectedOrder.id, "confirmed")
                          setSelectedOrder({ ...selectedOrder, status: "confirmed" })
                        }}
                        className="bg-[#7a8c4f] text-white px-4 py-2 rounded-lg hover:bg-[#5a6c3f]"
                        disabled={selectedOrder.status !== "pending"}
                      >
                        Confirm Order
                      </Button>
                      <Button
                        onClick={() => {
                          updateOrderStatus(selectedOrder.id, "order_placed")
                          setSelectedOrder({ ...selectedOrder, status: "order_placed" })
                        }}
                        className="bg-[#7a8c4f] text-white px-4 py-2 rounded-lg hover:bg-[#5a6c3f]"
                        disabled={selectedOrder.status !== "confirmed"}
                      >
                        Accept Order
                      </Button>
                      <Button
                        onClick={() => {
                          updateOrderStatus(selectedOrder.id, "cooking")
                          setSelectedOrder({ ...selectedOrder, status: "cooking" })
                        }}
                        className="bg-[#7a8c4f] text-white px-4 py-2 rounded-lg hover:bg-[#5a6c3f]"
                        disabled={selectedOrder.status !== "order_placed"}
                      >
                        Sedang Dimasak
                      </Button>
                      <Button
                        onClick={() => {
                          updateOrderStatus(selectedOrder.id, "delivery")
                          setSelectedOrder({ ...selectedOrder, status: "delivery" })
                        }}
                        className="bg-[#7a8c4f] text-white px-4 py-2 rounded-lg hover:bg-[#5a6c3f]"
                        disabled={selectedOrder.status !== "cooking"}
                      >
                        Sedang Dikirim
                      </Button>
                      <Button
                        onClick={() => {
                          updateOrderStatus(selectedOrder.id, "cancelled")
                          setSelectedOrder({ ...selectedOrder, status: "cancelled" })
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                      >
                        Cancel Order
                      </Button>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Payment Proof Modal */}
      {selectedPaymentProof && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-[#4a5c2f]">Bukti Pembayaran</h2>
                <Button
                  onClick={() => setSelectedPaymentProof(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Tutup
                </Button>
              </div>

              <div className="flex justify-center">
                <img
                  src={selectedPaymentProof || "/placeholder.svg"}
                  alt="Payment Proof"
                  className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
