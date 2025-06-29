"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit2, ChevronDown } from "lucide-react"
import PaymentPopup from "@/components/payment-popup"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface Voucher {
  id: string
  name: string
  discount: number
  description: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [tempDeliveryAddress, setTempDeliveryAddress] = useState("")
  const [isEditingAddress, setIsEditingAddress] = useState(false)
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null)
  const [showVoucherDropdown, setShowVoucherDropdown] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showPaymentPopup, setShowPaymentPopup] = useState(false)

  // Available vouchers
  const availableVouchers: Voucher[] = [
    {
      id: "JUNIBERKAH",
      name: "JUNIBERKAH",
      discount: 5000,
      description: "Diskon Rp. 5.000 untuk semua pembelian",
    },
  ]

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      // Redirect to login if not logged in
      localStorage.setItem("redirectAfterLogin", "/checkout")
      router.push("/login")
      return
    }

    const userObj = JSON.parse(userData)
    setUser(userObj)

    // Set delivery address from user data
    if (userObj.address) {
      setDeliveryAddress(userObj.address)
      setTempDeliveryAddress(userObj.address) // Set temporary address same as permanent
    }

    // Get cart items from localStorage
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart)

        // Group items by ID and sum quantities
        const groupedCart: { [key: string]: CartItem } = {}

        parsedCart.forEach((item: any) => {
          if (groupedCart[item.id]) {
            groupedCart[item.id].quantity += item.quantity || 1
          } else {
            groupedCart[item.id] = {
              ...item,
              quantity: item.quantity || 1,
            }
          }
        })

        setCartItems(Object.values(groupedCart))
      } catch (e) {
        console.error("Error parsing cart data:", e)
        setCartItems([])
      }
    } else {
      setCartItems([])
    }

    setIsLoading(false)
  }, [router])

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotalPrice = () => {
    const subtotal = getSubtotal()
    const discount = selectedVoucher ? selectedVoucher.discount : 0
    return Math.max(0, subtotal - discount) // Ensure total doesn't go below 0
  }

  const getCurrentDate = () => {
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

    const today = new Date()
    const dayName = days[today.getDay()]
    const day = today.getDate().toString().padStart(2, "0")
    const month = months[today.getMonth()]
    const year = today.getFullYear()

    return `${dayName}, ${day} ${month} ${year}`
  }

  const generateOrderId = () => {
    // Get the highest order number from all users
    let highestOrderNumber = 0

    // Check all localStorage keys for orders
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith("orders_")) {
        try {
          const userOrders = JSON.parse(localStorage.getItem(key) || "[]")
          userOrders.forEach((order: any) => {
            if (order.id && order.id.startsWith("ORD-")) {
              const orderNumber = Number.parseInt(order.id.split("-")[1])
              if (orderNumber > highestOrderNumber) {
                highestOrderNumber = orderNumber
              }
            }
          })
        } catch (e) {
          console.error("Error parsing orders:", e)
        }
      }
    }

    // Generate next order number
    const nextNumber = highestOrderNumber + 1
    return `ORD-${nextNumber.toString().padStart(3, "0")}`
  }

  const handleVoucherSelect = (voucher: Voucher) => {
    setSelectedVoucher(voucher)
    setShowVoucherDropdown(false)
  }

  const handleRemoveVoucher = () => {
    setSelectedVoucher(null)
  }

  const handleOrderNow = () => {
    setShowPaymentPopup(true)
  }

  const handlePaymentSubmit = (paymentProof?: string) => {
    // Generate a new order ID
    const orderId = generateOrderId()

    // Create order object with image data and payment proof
    const order = {
      id: orderId,
      date: new Date().toISOString(),
      items: cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      subtotal: getSubtotal(),
      voucher: selectedVoucher
        ? {
            name: selectedVoucher.name,
            discount: selectedVoucher.discount,
          }
        : null,
      total: getTotalPrice(),
      status: "pending",
      paymentProof: paymentProof, // Add payment proof to order
    }

    // Save to localStorage per user - don't overwrite existing orders
    const userOrdersKey = `orders_${user.email}`
    const existingOrders = JSON.parse(localStorage.getItem(userOrdersKey) || "[]")
    existingOrders.unshift(order) // Add to beginning of array
    localStorage.setItem(userOrdersKey, JSON.stringify(existingOrders))

    // Set as active order
    localStorage.setItem(
      "activeOrder",
      JSON.stringify({
        id: orderId,
        status: "pending", // Changed from "cooking" to "pending"
      }),
    )

    // Store completed order ID for thank you popup
    localStorage.setItem("completedOrder", orderId)

    // Clear cart
    localStorage.removeItem("cart")

    // Close popup
    setShowPaymentPopup(false)

    // Redirect to home (thank you popup will show automatically)
    router.push("/")
  }

  const handleEditAddress = (): void => {
    setIsEditingAddress(true)
  }

  const handleSaveAddress = (): void => {
    setIsEditingAddress(false)
  }

  const handleCancelEditAddress = (): void => {
    setTempDeliveryAddress(deliveryAddress) // Reset to original address
    setIsEditingAddress(false)
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
        className="flex-1 py-8 px-4"
        style={{
          backgroundImage: `url('/images/leaf-pattern-new.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#f8f3e2",
        }}
      >
        <div className="container mx-auto max-w-4xl">
          {/* Back Button */}
          <div className="mb-6">
            <Button
              onClick={() => router.back()}
              className="bg-[#3a4c1f] hover:bg-[#AC9362] text-[#FFC300] font-bold px-6 py-2 rounded-lg flex items-center gap-2"
            >
              <ArrowLeft size={20} />
              Back
            </Button>
          </div>

          {/* Delivery Address Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-[#4a5c2f] bg-[#FFF9E2] inline-block px-6 py-3 rounded-xl shadow-md">
                Alamat Pengiriman
              </h2>
              <span className="text-lg text-[#4a5c2f] font-medium">{getCurrentDate()}</span>
            </div>

            <div className="bg-[#DDB04E] rounded-2xl p-4 flex justify-between items-center">
              {isEditingAddress ? (
                <div className="flex-1 flex items-center gap-3">
                  <input
                    type="text"
                    value={tempDeliveryAddress}
                    onChange={(e) => setTempDeliveryAddress(e.target.value)}
                    className="flex-1 text-[#4a5c2f] font-medium text-lg bg-white rounded-lg px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#7a8c4f]"
                    placeholder="Masukkan alamat pengiriman"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveAddress}
                      className="bg-[#7a8c4f] hover:bg-[#5a6c3f] text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      Simpan
                    </button>
                    <button
                      onClick={handleCancelEditAddress}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <span className="text-[#4a5c2f] font-medium text-lg">{tempDeliveryAddress}</span>
                  <button onClick={handleEditAddress} className="text-[#4a5c2f] hover:text-[#7a8c4f] transition-colors">
                    <Edit2 size={20} />
                  </button>
                </>
              )}
            </div>

            {isEditingAddress && (
              <p className="text-sm text-gray-600 mt-2">
                * Perubahan alamat hanya berlaku untuk pesanan ini. Untuk mengubah alamat permanen, silakan edit di
                halaman profile.
              </p>
            )}
          </div>

          {/* Order Items Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#4a5c2f] bg-[#FFF9E2] inline-block px-6 py-3 rounded-xl shadow-md mb-6">
              Pesanan
            </h2>

            {cartItems.length === 0 ? (
              <div className="bg-[#DDB04E] rounded-2xl p-8 text-center">
                <p className="text-[#4a5c2f] text-xl font-medium">Keranjang belanja Anda kosong</p>
                <Button
                  onClick={() => router.push("/menu")}
                  className="mt-4 bg-[#3a4c1f] hover:bg-[#AC9362] text-[#FFC300] px-6 py-2 rounded-lg"
                >
                  Lihat Menu
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-[#DDB04E] rounded-2xl p-4 flex items-center gap-4">
                    {/* Food Image */}
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg?height=80&width=80"
                        }}
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1">
                      <div className="bg-[#FFF9E2] rounded-lg p-3 inline-block">
                        <h3 className="text-[#4a5c2f] font-bold text-xl mb-1">{item.name}</h3>
                        <p className="text-[#4a5c2f] font-medium">
                          Rp. {item.price.toLocaleString()} x {item.quantity}
                        </p>
                        <p className="text-[#4a5c2f] font-bold">
                          Subtotal: Rp. {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="bg-[#3a4c1f] text-[#FFC300] font-bold px-4 py-2 rounded-lg min-w-[60px] text-center">
                      {item.quantity}x
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cartItems.length > 0 && (
            <>
              {/* Voucher Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#4a5c2f] bg-[#FFF9E2] inline-block px-6 py-3 rounded-xl shadow-md mb-4">
                  Voucher
                </h2>

                {!selectedVoucher ? (
                  <div className="relative">
                    <Button
                      onClick={() => setShowVoucherDropdown(!showVoucherDropdown)}
                      className="bg-[#3a4c1f] hover:bg-[#AC9362] text-[#FFC300] font-bold w-full py-4 text-lg rounded-2xl flex items-center justify-between"
                    >
                      <span>Pilih Voucher</span>
                      <ChevronDown size={20} />
                    </Button>

                    {showVoucherDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border z-10">
                        {availableVouchers.map((voucher) => (
                          <button
                            key={voucher.id}
                            onClick={() => handleVoucherSelect(voucher)}
                            className="w-full p-4 text-left hover:bg-gray-50 border-b last:border-b-0 rounded-lg"
                          >
                            <div className="font-bold text-[#4a5c2f]">{voucher.name}</div>
                            <div className="text-sm text-[#7a8c4f]">{voucher.description}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-[#DDB04E] rounded-2xl p-4 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-[#4a5c2f]">{selectedVoucher.name}</div>
                      <div className="text-sm text-[#4a5c2f]">
                        Diskon: Rp. {selectedVoucher.discount.toLocaleString()}
                      </div>
                    </div>
                    <Button
                      onClick={handleRemoveVoucher}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                    >
                      Hapus
                    </Button>
                  </div>
                )}
              </div>

              {/* Price Summary and Total - Combined in one background */}
              <div className="bg-[#FFF9E2] rounded-xl p-6 mb-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[#4a5c2f] font-medium text-lg">Subtotal</span>
                    <span className="text-[#4a5c2f] font-bold text-lg">Rp. {getSubtotal().toLocaleString()}</span>
                  </div>

                  {selectedVoucher && (
                    <div className="flex justify-between items-center">
                      <span className="text-[#4a5c2f] font-medium text-lg">
                        Potongan Voucher ({selectedVoucher.name})
                      </span>
                      <span className="text-red-600 font-bold text-lg">
                        - Rp. {selectedVoucher.discount.toLocaleString()}
                      </span>
                    </div>
                  )}

                  <hr className="border-[#4a5c2f] border-t-2 my-4" />

                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[#4a5c2f] font-bold text-2xl">Total</span>
                    <span className="text-[#4a5c2f] font-bold text-2xl">Rp. {getTotalPrice().toLocaleString()}</span>
                  </div>

                  <Button
                    onClick={handleOrderNow}
                    className="w-full bg-[#b3a278] hover:bg-[#a39068] text-[#4a5c2f] font-bold py-4 text-xl rounded-lg"
                  >
                    Order Now
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer - Fixed to match other pages */}
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

      {/* Payment Popup */}
      <PaymentPopup
        isOpen={showPaymentPopup}
        onClose={() => setShowPaymentPopup(false)}
        onSubmit={handlePaymentSubmit}
        totalAmount={getTotalPrice()}
      />
    </div>
  )
}
