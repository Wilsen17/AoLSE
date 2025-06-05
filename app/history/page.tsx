"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

interface Order {
  id: string
  date: string
  items: OrderItem[]
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

    // Get ONLY real user-specific orders from localStorage
    const userOrdersKey = `orders_${JSON.parse(userData).email}`
    const storedOrders = localStorage.getItem(userOrdersKey)
    if (storedOrders) {
      try {
        const parsedOrders = JSON.parse(storedOrders)
        // Validate orders have required fields and sort by date
        const validOrders = parsedOrders.filter(
          (order: Order) => order.id && order.date && order.items && order.total !== undefined,
        )
        const sortedOrders = validOrders.sort(
          (a: Order, b: Order) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        )
        setOrders(sortedOrders)
      } catch (e) {
        console.error("Error parsing orders:", e)
        setOrders([])
      }
    } else {
      setOrders([])
    }
  }, [router])

  const formatDate = (dateString: string, orderId: string) => {
    const date = new Date(dateString)
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ]

    const dayName = days[date.getDay()]
    const day = date.getDate().toString().padStart(2, "0")
    const month = months[date.getMonth()]
    const year = date.getFullYear()

    return `${dayName}, ${day} ${month} ${year} - #${orderId}`
  }

  const handleOrderAgain = (order: Order) => {
    alert("Tidak ada menu dari pesanan sebelumnya yang tersedia.")
  }

  if (!user) {
    return <div>Loading...</div>
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
        <div className="container mx-auto max-w-6xl">
          {/* History Header */}
          <div className="text-center mb-8">
            <div className="bg-[#4a3f2d] text-[#DDB04E] px-8 py-4 rounded-2xl inline-block shadow-lg">
              <h1 className="text-3xl font-bold">History</h1>
            </div>
          </div>

          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="bg-[#50591A] rounded-2xl p-8 text-center">
                <p className="text-white text-lg">Belum ada riwayat pesanan</p>
              </div>
            ) : (
              <div className="bg-[#50591A] rounded-2xl p-6 shadow-lg">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-4 px-4 text-[#FFD700] text-xl">Tanggal & Order ID</th>
                      <th className="text-left py-4 px-4 text-[#FFD700] text-xl">Menu</th>
                      <th className="text-center py-4 px-4 text-[#FFD700] text-xl">Jumlah</th>
                      <th className="text-center py-4 px-4 text-[#FFD700] text-xl">Total</th>
                      <th className="text-center py-4 px-4 text-[#FFD700] text-xl">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-white/10 hover:bg-[#6a7c3f]">
                        <td className="py-4 px-4">
                          <p className="text-[#FFD700] font-bold">{formatDate(order.date, order.id)}</p>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-col space-y-4">
                            {order.items.map((item, idx) => (
                              <div key={`${order.id}-${idx}`} className="flex items-center gap-3">
                                <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                  <Image
                                    src={item.image || "/placeholder.svg?height=64&width=64"}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement
                                      target.src = "/placeholder.svg?height=64&width=64"
                                    }}
                                  />
                                </div>
                                <div className="bg-[#FFF9E2] rounded-lg p-3 flex-1">
                                  <p className="text-[#4a5c2f] font-bold text-lg">{item.name}</p>
                                  <p className="text-[#4a5c2f] text-base">Rp. {item.price.toLocaleString()}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-col space-y-2 items-center">
                            {order.items.map((item, idx) => (
                              <div
                                key={`${order.id}-${idx}`}
                                className="w-14 h-10 bg-[#FFC300] rounded-full flex items-center justify-center"
                              >
                                <span className="text-[#4a5c2f] font-bold text-base">{item.quantity}x</span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="text-[#FFD700] font-bold text-xl">Rp. {order.total.toLocaleString()}</span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <Button
                            onClick={() => handleOrderAgain(order)}
                            className="bg-[#AC9362] hover:bg-[#9d8555] text-[#4a5c2f] font-bold px-4 py-2 rounded-lg"
                          >
                            Pesan Lagi
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

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
              <p className="text-sm">Subscribe for latest updates</p>
              <div className="flex mt-2">
                <input type="email" placeholder="Your email" className="px-3 py-1 rounded-l-lg text-sm" />
                <button className="bg-[#7a8c4f] text-white px-3 py-1 rounded-r-lg text-sm">Subscribe</button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
