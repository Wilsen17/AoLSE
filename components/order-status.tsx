"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface OrderStatusProps {
  orderId: string
  currentStatus: string
}

export default function OrderStatus({ orderId, currentStatus }: OrderStatusProps) {
  const [status, setStatus] = useState(currentStatus)

  useEffect(() => {
    // Check for status updates from admin - only for real orders
    const checkStatusUpdate = () => {
      const user = localStorage.getItem("user")
      if (user && orderId) {
        const userData = JSON.parse(user)
        const userOrdersKey = `orders_${userData.email}`
        const orders = JSON.parse(localStorage.getItem(userOrdersKey) || "[]")
        const currentOrder = orders.find((order: any) => order.id === orderId)

        if (currentOrder && currentOrder.status !== status) {
          setStatus(currentOrder.status)
        } else if (!currentOrder) {
          // Order doesn't exist, remove active order
          localStorage.removeItem("activeOrder")
          window.location.reload()
        }
      }
    }

    // Check for updates every 5 seconds
    const interval = setInterval(checkStatusUpdate, 5000)

    return () => clearInterval(interval)
  }, [orderId, status])

  const handleOrderComplete = () => {
    const user = localStorage.getItem("user")
    if (user) {
      const userData = JSON.parse(user)
      const userOrdersKey = `orders_${userData.email}`
      const orders = JSON.parse(localStorage.getItem(userOrdersKey) || "[]")

      // Update order status to completed
      const updatedOrders = orders.map((order: any) =>
        order.id === orderId ? { ...order, status: "completed" } : order,
      )

      localStorage.setItem(userOrdersKey, JSON.stringify(updatedOrders))

      // Remove active order to show "no orders" state
      localStorage.removeItem("activeOrder")

      // Reload the page to refresh the UI
      window.location.reload()
    }
  }

  const getStatusStep = (status: string) => {
    switch (status) {
      case "pending":
        return 0
      case "order_placed":
        return 1
      case "cooking":
        return 2
      case "delivery":
        return 3
      case "cancelled":
        return 0
      default:
        return 0
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Menunggu Konfirmasi"
      case "order_placed":
        return "Pesanan Diterima"
      case "cooking":
        return "Sedang Dimasak"
      case "delivery":
        return "Sedang Dikirim"
      case "cancelled":
        return "Pesanan Dibatalkan"
      default:
        return "Menunggu Konfirmasi"
    }
  }

  const currentStep = getStatusStep(status)

  if (status === "cancelled") {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">✕</span>
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Pesanan Dibatalkan</h3>
          <p className="text-red-600">Pesanan Anda telah dibatalkan oleh admin.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#DDB04E] rounded-lg shadow-lg p-6">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-[#4a5c2f] mb-2">Status Pesanan</h3>
        <p className="text-[#4a5c2f] font-medium">Order ID: #{orderId}</p>
      </div>

      <div className="flex items-center justify-between mb-8">
        {/* Step 1: Order Placed */}
        <div className="flex flex-col items-center flex-1">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
              currentStep >= 1 ? "bg-[#7a8c4f] text-white" : "bg-gray-200 text-gray-400"
            }`}
          >
            <Image
              src="/images/check-icon.png"
              alt="Order Placed"
              width={24}
              height={24}
              className={currentStep >= 1 ? "opacity-100" : "opacity-50"}
            />
          </div>
          <p className={`text-sm text-center ${currentStep >= 1 ? "text-[#4a5c2f] font-semibold" : "text-gray-500"}`}>
            Pesanan Diterima
          </p>
        </div>

        {/* Connector Line 1 */}
        <div className={`flex-1 h-1 mx-2 ${currentStep >= 2 ? "bg-[#7a8c4f]" : "bg-gray-300"}`}></div>

        {/* Step 2: Cooking */}
        <div className="flex flex-col items-center flex-1">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
              currentStep >= 2 ? "bg-[#7a8c4f] text-white" : "bg-gray-200 text-gray-400"
            }`}
          >
            <Image
              src="/images/cooking-icon.png"
              alt="Cooking"
              width={24}
              height={24}
              className={currentStep >= 2 ? "opacity-100" : "opacity-50"}
            />
          </div>
          <p className={`text-sm text-center ${currentStep >= 2 ? "text-[#4a5c2f] font-semibold" : "text-gray-500"}`}>
            Sedang Dimasak
          </p>
        </div>

        {/* Connector Line 2 */}
        <div className={`flex-1 h-1 mx-2 ${currentStep >= 3 ? "bg-[#7a8c4f]" : "bg-gray-300"}`}></div>

        {/* Step 3: Delivery */}
        <div className="flex flex-col items-center flex-1">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
              currentStep >= 3 ? "bg-[#7a8c4f] text-white" : "bg-gray-200 text-gray-400"
            }`}
          >
            <Image
              src="/images/delivery-icon.png"
              alt="Delivery"
              width={24}
              height={24}
              className={currentStep >= 3 ? "opacity-100" : "opacity-50"}
            />
          </div>
          <p className={`text-sm text-center ${currentStep >= 3 ? "text-[#4a5c2f] font-semibold" : "text-gray-500"}`}>
            Sedang Dikirim
          </p>
        </div>
      </div>

      <div className="text-center">
        <p className="text-lg font-semibold text-[#4a5c2f]">{getStatusText(status)}</p>
        <p className="text-sm text-[#4a5c2f] mt-1">
          {status === "pending" && "Pesanan Anda menunggu konfirmasi admin"}
          {status === "order_placed" && "Pesanan Anda sedang diproses"}
          {status === "cooking" && "Chef sedang menyiapkan makanan Anda"}
          {status === "delivery" && "Pesanan Anda sedang dalam perjalanan"}
        </p>

        {/* Complete Order Button for Delivery Status */}
        {status === "delivery" && (
          <div className="mt-6">
            <button
              onClick={handleOrderComplete}
              className="bg-[#7a8c4f] text-white px-8 py-3 rounded-lg hover:bg-[#5a6c3f] transition-colors duration-200 font-semibold"
            >
              Diterima
            </button>
            <p className="text-xs text-[#4a5c2f] mt-2">Klik tombol ini jika pesanan sudah Anda terima</p>
          </div>
        )}
      </div>
    </div>
  )
}
