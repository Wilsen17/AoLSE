"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

export default function CartPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      // Redirect to login if not logged in
      localStorage.setItem("redirectAfterLogin", "/cart")
      router.push("/login")
      return
    }

    const userObj = JSON.parse(userData)
    setUser(userObj)

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

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      const updatedItems = cartItems.filter((item) => item.id !== id)
      setCartItems(updatedItems)

      // Update localStorage
      localStorage.setItem(
        "cart",
        JSON.stringify(
          updatedItems.flatMap((item) =>
            Array(item.quantity).fill({
              id: item.id,
              name: item.name,
              price: item.price,
              image: item.image,
              quantity: 1,
            }),
          ),
        ),
      )
    } else {
      const updatedItems = cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
      setCartItems(updatedItems)

      // Update localStorage
      localStorage.setItem(
        "cart",
        JSON.stringify(
          updatedItems.flatMap((item) =>
            Array(item.quantity).fill({
              id: item.id,
              name: item.name,
              price: item.price,
              image: item.image,
              quantity: 1,
            }),
          ),
        ),
      )
    }
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const handleOrder = () => {
    router.push("/checkout")
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

          {/* Cart Title */}
          <h1 className="text-3xl font-bold text-[#4a5c2f] bg-[#f8f4e3] px-8 py-4 rounded-2xl shadow-lg text-center mb-8 w-fit mx-auto">Keranjang Saya</h1>
          {cartItems.length === 0 ? (
            <div className="bg-[#DDB04E] rounded-2xl p-8 text-center">
              <p className="text-[#4a5c2f] text-xl font-medium">Keranjang belanja Anda kosong</p>
              <Button
                onClick={() => router.push("/menu")}
                className="mt-4 bg-[#7a8c4f] hover:bg-[#5a6c3f] text-white px-6 py-2 rounded-lg"
              >
                Lihat Menu
              </Button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-4 mb-8">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-[#DDB04E] rounded-xl p-6 flex items-center gap-6">
                    {/* Food Image */}
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg?height=128&width=128"
                        }}
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1">
                      <div className="bg-[#FFF9E2] rounded-lg p-4 inline-block">
                        <h3 className="text-[#4a5c2f] font-bold text-xl mb-2">{item.name}</h3>
                        <p className="text-[#4a5c2f] text-lg">Rp. {item.price.toLocaleString()}</p>
                        <p className="text-[#4a5c2f] text-sm mt-1">
                          Subtotal: Rp. {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4 bg-[#FFF9E2] rounded-lg p-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="text-[#4a5c2f] font-bold text-xl w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded"
                      >
                        -
                      </button>

                      <span className="text-[#4a5c2f] font-bold text-xl px-4">{item.quantity}</span>

                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-[#4a5c2f] font-bold text-xl w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add More Button */}
              <div className="mb-6">
                <Link href="/menu">
                  <Button className="bg-[#3a4c1f] hover:bg-[#AC9362] text-[#FFC300] font-bold px-6 py-2 rounded-lg">
                    Add More
                  </Button>
                </Link>
              </div>

              {/* Total Section */}
              <div className="bg-[#FFF9E2] rounded-xl p-6 mb-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[#4a5c2f] font-bold text-2xl">Total ({getTotalItems()} items)</span>
                  <span className="text-[#4a5c2f] font-bold text-2xl">Rp. {getTotalPrice().toLocaleString()}</span>
                </div>
                <Button
                  onClick={handleOrder}
                  className="w-full bg-[#b3a278] hover:bg-[#a39068] text-[#4a5c2f] font-bold py-4 text-xl rounded-lg"
                >
                  Order
                </Button>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#DDB04E] py-8 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center md:justify-between gap-6">
            <div className="flex items-center space-x-4">
              <Image src="/images/logo.png" alt="Your Daily Meal" width={100} height={50} className="h-auto" />
              <div className="text-[#4a5c2f]">
                <h3 className="text-xl font-bold">FAQ</h3>
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
