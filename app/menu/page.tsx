"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Plus, ShoppingCart } from "lucide-react"
import { useRouter } from "next/navigation"

// Define menu data types
interface MenuItem {
  id: string
  name: string
  image: string
  price: number
}

interface DayMenu {
  day: string
  items: MenuItem[][]
}

interface AdditionalItem {
  id: string
  name: string
  image: string
  price: number
}

export default function MenuPage() {
  const [currentDayIndex, setCurrentDayIndex] = useState(0)
  const [todayIndex, setTodayIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [slideDirection, setSlideDirection] = useState<"left" | "right" | null>(null)
  const [user, setUser] = useState<any>(null)
  const [cartCount, setCartCount] = useState(0)
  const [animatingItems, setAnimatingItems] = useState<string[]>([])
  const [additionalItems, setAdditionalItems] = useState<AdditionalItem[]>([
    { id: "a1", name: "Sambal Matah", image: "/images/sambal-matah.png", price: 2500 },
    { id: "a2", name: "Sambal Bawang", image: "/images/sambal-bawang.png", price: 2500 },
    { id: "a3", name: "Sambal Terasi", image: "/images/sambal-terasi.png", price: 2500 },
    { id: "a4", name: "Sambal Ijo", image: "/images/sambal-ijo.png", price: 2500 },
  ])
  const [menuData, setMenuData] = useState<DayMenu[]>([
    // Monday
    {
      day: "Monday",
      items: [
        [
          { id: "m1-1", name: "Nasi Putih", image: "/images/nasi-putih.png", price: 5000 },
          { id: "m1-2", name: "Nasi Merah", image: "/images/nasi-merah.png", price: 5500 },
          { id: "m1-3", name: "Ayam Woku", image: "/images/ayam-woku.png", price: 19000 },
          { id: "m1-4", name: "Sapi Lada Hitam", image: "/images/sapi-lada-hitam.png", price: 23000 },
          { id: "m1-5", name: "Telur Barendo", image: "/images/telur-barendo.png", price: 14000 },
        ],
        [
          { id: "m1-6", name: "Cah Brokoli", image: "/images/cah-brokoli.png", price: 8000 },
          { id: "m1-7", name: "Tauge Ikan Asin", image: "/images/tauge-ikan-asin.png", price: 8000 },
          { id: "m1-8", name: "Tempe Goreng", image: "/images/tempe-goreng.png", price: 6000 },
          { id: "m1-9", name: "Sayur Bening", image: "/images/sayur-bening.png", price: 7500 },
          { id: "m1-10", name: "Nila Goreng", image: "/images/nila-goreng.png", price: 18500 },
        ],
      ],
    },
    // Tuesday
    {
      day: "Tuesday",
      items: [
        [
          { id: "m2-1", name: "Nasi Putih", image: "/images/nasi-putih.png", price: 5000 },
          { id: "m2-2", name: "Mie Kuning", image: "/images/mie-kuning.png", price: 6500 },
          { id: "m2-3", name: "Ayam Asam Manis", image: "/images/ayam-asam-manis.png", price: 19000 },
          { id: "m2-4", name: "Sapi Panggang", image: "/images/sapi-panggang.png", price: 23000 },
          { id: "m2-5", name: "Ikan Bakar", image: "/images/ikan-bakar.png", price: 18500 },
        ],
        [
          { id: "m2-6", name: "Labu Siam", image: "/images/labu-siam.png", price: 8000 },
          { id: "m2-7", name: "Bebek Goreng", image: "/images/bebek-goreng.png", price: 25000 },
          { id: "m2-8", name: "Tahu Bacem", image: "/images/tahu-bacem.png", price: 6000 },
          { id: "m2-9", name: "Kuah Oyong", image: "/images/kuah-oyong.png", price: 7500 },
          { id: "m2-10", name: "Telur Balado", image: "/images/telur-balado.png", price: 5000 },
        ],
      ],
    },
    // Wednesday
    {
      day: "Wednesday",
      items: [
        [
          { id: "m3-1", name: "Nasi putih", image: "/images/nasi-putih.png", price: 5000 },
          { id: "m3-2", name: "Mie shirataki", image: "/images/mie-shirataki.png", price: 7500 },
          { id: "m3-3", name: "Ayam Goreng", image: "/images/ayam-goreng.png", price: 13500 },
          { id: "m3-4", name: "Rendang", image: "/images/rendang.png", price: 20000 },
          { id: "m3-5", name: "Tuna Sawir", image: "/images/tuna-sawir.png", price: 18500 },
        ],
        [
          { id: "m3-6", name: "Cah kangkung", image: "/images/cah-kangkung.png", price: 8000 },
          { id: "m3-7", name: "Semur Daging", image: "/images/semur-daging.png", price: 25000 },
          { id: "m3-8", name: "Tempe Orek", image: "/images/tempe-orek.png", price: 7000 },
          { id: "m3-9", name: "Soto Lamongan", image: "/images/soto-lamongan.png", price: 15000 },
          { id: "m3-10", name: "Bakwan Jagung", image: "/images/bakwan-jagung.png", price: 5000 },
        ],
      ],
    },
    // Thursday
    {
      day: "Thursday",
      items: [
        [
          { id: "m4-1", name: "Nasi putih", image: "/images/nasi-putih.png", price: 5000 },
          { id: "m4-2", name: "Nasi Goreng", image: "/images/nasi-goreng.png", price: 12500 },
          { id: "m4-3", name: "Ayam Bakar", image: "/images/ayam-bakar.png", price: 13500 },
          { id: "m4-4", name: "Tumis Sapi", image: "/images/tumis-sapi.png", price: 18000 },
          { id: "m4-5", name: "Ikan Balado", image: "/images/ikan-balado.png", price: 16000 },
        ],
        [
          { id: "m4-6", name: "Tumis Buncis", image: "/images/tumis-buncis.png", price: 8000 },
          { id: "m4-7", name: "Ayam Kecap", image: "/images/ayam-kecap.png", price: 22000 },
          { id: "m4-8", name: "Kentang Balado", image: "/images/kentang-balado.png", price: 7000 },
          { id: "m4-9", name: "Sup Jagung", image: "/images/sup-jagung.png", price: 15000 },
          { id: "m4-10", name: "Telur Mata Sapi", image: "/images/telur-mata-sapi.png", price: 5000 },
        ],
      ],
    },
    // Friday
    {
      day: "Friday",
      items: [
        [
          { id: "m5-1", name: "Nasi putih", image: "/images/nasi-putih.png", price: 5000 },
          { id: "m5-2", name: "Nasi Merah", image: "/images/nasi-merah.png", price: 5500 },
          { id: "m5-3", name: "Ayam Geprek", image: "/images/ayam-geprek.png", price: 12500 },
          { id: "m5-4", name: "Tongseng Sapi", image: "/images/tongseng-sapi.png", price: 18000 },
          { id: "m5-5", name: "Nila Cabe Ijo", image: "/images/nila-cabe-ijo.png", price: 16000 },
        ],
        [
          { id: "m5-6", name: "Sayur Lodeh", image: "/images/sayur-lodeh.png", price: 8000 },
          { id: "m5-7", name: "Terong Balado", image: "/images/terong-balado.png", price: 10000 },
          { id: "m5-8", name: "Jamur Goreng", image: "/images/jamur-goreng.png", price: 7000 },
          { id: "m5-9", name: "Sayur Asem", image: "/images/sayur-asem.png", price: 10000 },
          { id: "m5-10", name: "Tahu Goreng", image: "/images/tahu-goreng.png", price: 5000 },
        ],
      ],
    },
    // Saturday
    {
      day: "Saturday",
      items: [
        [
          { id: "m6-1", name: "Nasi putih", image: "/images/nasi-putih.png", price: 5000 },
          { id: "m6-2", name: "Ubi Cilembu", image: "/images/ubi-cilembu.png", price: 12500 },
          { id: "m6-3", name: "Ayam Mentega", image: "/images/ayam-mentega.png", price: 16500 },
          { id: "m6-4", name: "Sate Sapi", image: "/images/sate-sapi.png", price: 15000 },
          { id: "m6-5", name: "Nila Bakar", image: "/images/nila-bakar.png", price: 18500 },
        ],
        [
          { id: "m6-6", name: "Cah Timun Udang", image: "/images/cah-timun-udang.png", price: 10000 },
          { id: "m6-7", name: "Terong Balado", image: "/images/terong-balado.png", price: 10000 },
          { id: "m6-8", name: "Usus Bakar", image: "/images/usus-bakar.png", price: 5000 },
          { id: "m6-9", name: "Sayur Sop", image: "/images/sayur-sop.png", price: 10000 },
          { id: "m6-10", name: "Telur Kecap", image: "/images/telur-kecap.png", price: 5000 },
        ],
      ],
    },
  ])

  const router = useRouter()

  // Days of the week
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  const handlePrevDay = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setSlideDirection("right")
    setTimeout(() => {
      setCurrentDayIndex((prev) => (prev === 0 ? menuData.length - 1 : prev - 1))
      setIsAnimating(false)
    }, 300)
  }

  const handleNextDay = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setSlideDirection("left")
    setTimeout(() => {
      setCurrentDayIndex((prev) => (prev === menuData.length - 1 ? 0 : prev + 1))
      setIsAnimating(false)
    }, 300)
  }

  const addToCart = (itemId: string, itemName: string, itemPrice: number, itemImage: string) => {
    // Check if user is logged in
    if (!user) {
      // Save intended action to localStorage
      localStorage.setItem("redirectAfterLogin", "/menu")

      // Show message
      alert("Silakan login terlebih dahulu untuk menambahkan item ke keranjang")

      // Redirect to login page
      router.push("/login")
      return
    }

    // Check if current day is today - only allow ordering for today
    if (currentDayIndex !== todayIndex) {
      alert(
        `Menu ini hanya tersedia untuk hari ${menuData[currentDayIndex].day}. Anda hanya bisa memesan menu hari ini (${menuData[todayIndex].day}).`,
      )
      return
    }

    // Add animation effect
    setAnimatingItems((prev) => [...prev, itemId])

    // Get existing cart or create new one
    let cart = []
    const existingCart = localStorage.getItem("cart")

    if (existingCart) {
      try {
        cart = JSON.parse(existingCart)
      } catch (e) {
        console.error("Error parsing cart:", e)
      }
    }

    // Add item to cart
    cart.push({
      id: itemId,
      name: itemName,
      price: itemPrice,
      image: itemImage,
      quantity: 1,
    })

    // Save cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart))

    // Update cart count
    setCartCount(cart.length)

    // Remove animation after 1 second
    setTimeout(() => {
      setAnimatingItems((prev) => prev.filter((id) => id !== itemId))
    }, 1000)
  }

  const goToCart = () => {
    if (!user) {
      // Save intended action to localStorage
      localStorage.setItem("redirectAfterLogin", "/cart")

      // Show message
      alert("Silakan login terlebih dahulu untuk melihat keranjang")

      // Redirect to login page
      router.push("/login")
      return
    }

    router.push("/cart")
  }

  // Check if current viewing day is today
  const isToday = currentDayIndex === todayIndex

  const getTodayMenuIndex = () => {
    const today = new Date().getDay()
    // Sunday is 0 in JavaScript, but we don't serve on Sunday, so redirect to Monday
    if (today === 0) return 0 // Sunday -> Monday
    // Saturday is 6, which maps to index 5 in our 6-day array
    return today === 6 ? 5 : today - 1
  }

  const loadMenuItems = () => {
    // Load menu items from admin's localStorage
    const adminMenu = localStorage.getItem("adminMenu")
    if (adminMenu) {
      try {
        const allItems = JSON.parse(adminMenu)
        // Group items by day
        const groupedMenu: { [key: string]: any[][] } = {}

        days.forEach((day) => {
          const dayItems = allItems.filter((item: any) => item.day === day)
          // Group into rows of 5 items each
          const rows = []
          for (let i = 0; i < dayItems.length; i += 5) {
            rows.push(dayItems.slice(i, i + 5))
          }
          groupedMenu[day] = rows
        })

        // Update menuData with admin's menu
        const newMenuData = [...menuData] // Create a copy of the state
        Object.keys(groupedMenu).forEach((day) => {
          const dayIndex = days.indexOf(day)
          if (dayIndex !== -1 && groupedMenu[day].length > 0) {
            newMenuData[dayIndex].items = groupedMenu[day]
          }
        })
        setMenuData(newMenuData) // Update the state with the new menu
      } catch (e) {
        console.error("Error parsing admin menu:", e)
        // Fallback to default menu if error
      }
    }
    // If no admin menu found, keep using default menu
  }

  const loadAdditionalItems = () => {
    // Load additional items from admin's localStorage
    const storedItems = localStorage.getItem("additionalItems")
    if (storedItems) {
      try {
        const items = JSON.parse(storedItems)
        // Convert admin's additional items format to user format
        const formattedItems = items.map((item: any) => ({
          id: item.id.toString(),
          name: item.name,
          image: item.image || `/images/sambal-bawang.png`,
          price: item.price,
        }))
        setAdditionalItems(formattedItems)
      } catch (e) {
        console.error("Error parsing additional items:", e)
        // Fallback to default items if error
      }
    }
  }

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))

      // Get cart count from localStorage if exists
      const storedCart = localStorage.getItem("cart")
      if (storedCart) {
        try {
          const cartItems = JSON.parse(storedCart)
          setCartCount(cartItems.length)
        } catch (e) {
          console.error("Error parsing cart data:", e)
        }
      }
    }

    // Load menu from admin
    loadMenuItems()

    // Load additional items from admin
    loadAdditionalItems()

    // Set current day index based on actual day of week
    const adjustedDayIndex = getTodayMenuIndex()
    setCurrentDayIndex(adjustedDayIndex)
    setTodayIndex(adjustedDayIndex)
  }, [])

  useEffect(() => {
    // Listen for menu and additional items changes from admin
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "adminMenu") {
        loadMenuItems()
      }
      if (e.key === "additionalItems") {
        loadAdditionalItems()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main
        className="flex-1 py-8 px-4 relative"
        style={{
          backgroundImage: `url('/images/leaf-pattern-new.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#f8f3e2",
        }}
      >
        {/* Cart Icon */}
        <div className="absolute top-8 right-8 z-20">
          <div className="relative">
            <Button
              onClick={goToCart}
              className="bg-[#7a8c4f] hover:bg-[#5a6c3f] rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
            >
              <ShoppingCart className="w-7 h-7 text-white" />
            </Button>
            {cartCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-[#FFA500] text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold animate-pulse">
                {cartCount}
              </div>
            )}
          </div>
        </div>

        <div className="container mx-auto max-w-7xl px-4">
          {/* Menu Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[#4a5c2f] bg-[#f8f4e3] inline-block px-8 py-4 rounded-2xl shadow-lg">
              Our Menu
            </h1>
          </div>

          {/* Day Menu Section */}
          <div className="relative mb-16">
            {/* Navigation Buttons */}
            <button
              onClick={handlePrevDay}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-[#FFA500] hover:bg-[#FF8C00] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-all duration-200"
              aria-label="Previous day"
            >
              <ChevronLeft size={28} />
            </button>

            <button
              onClick={handleNextDay}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-[#FFA500] hover:bg-[#FF8C00] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-all duration-200"
              aria-label="Next day"
            >
              <ChevronRight size={28} />
            </button>

            {/* Menu Content */}
            <div className="bg-[#7a8c4f] rounded-3xl p-8 mx-16 shadow-xl">
              {/* Day Title */}
              <div className="text-center mb-6">
                <h2 className="text-5xl font-bold text-[#FFA500] mb-2">{menuData[currentDayIndex].day}</h2>
                {!isToday && (
                  <p className="text-white text-lg bg-red-600 inline-block px-4 py-2 rounded-lg">
                    Menu ini tidak tersedia untuk pemesanan. Hanya menu hari ini yang bisa dipesan.
                  </p>
                )}
              </div>

              {/* Menu Items */}
              <div
                className={`transition-all duration-300 ease-in-out ${
                  isAnimating
                    ? slideDirection === "left"
                      ? "-translate-x-10 opacity-0"
                      : "translate-x-10 opacity-0"
                    : "translate-x-0 opacity-100"
                }`}
              >
                <div className="space-y-8">
                  {menuData[currentDayIndex].items.map((row, rowIndex) => (
                    <div key={rowIndex} className="grid grid-cols-5 gap-6">
                      {row.map((item) => (
                        <div
                          key={item.id}
                          className={`bg-[#5a6c3f] rounded-2xl overflow-hidden shadow-lg transition-all duration-300 ${
                            animatingItems.includes(item.id) ? "animate-bounce scale-110" : ""
                          } ${!isToday ? "opacity-60" : ""}`}
                        >
                          {/* Item Name */}
                          <div className="p-3 text-center bg-[#4a5c2f]">
                            <h3 className="text-[#FFA500] font-bold text-sm leading-tight">{item.name}</h3>
                          </div>

                          {/* Item Image */}
                          <div className="relative h-32 w-full">
                            <Image
                              src={item.image || "/placeholder.svg?height=128&width=128"}
                              alt={item.name}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = "/placeholder.svg?height=128&width=128"
                              }}
                            />
                          </div>

                          {/* Price and Add Button */}
                          <div className="p-3 flex justify-between items-center bg-[#5a6c3f]">
                            <span className="text-white font-bold text-sm">Rp{item.price.toLocaleString()}</span>
                            <button
                              onClick={() => addToCart(item.id, item.name, item.price, item.image)}
                              disabled={!isToday}
                              className={`rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200 ${
                                isToday
                                  ? "bg-[#FFA500] hover:bg-[#FF8C00] hover:scale-110 active:scale-95"
                                  : "bg-gray-400 cursor-not-allowed"
                              }`}
                              aria-label={`Add ${item.name} to cart`}
                            >
                              <Plus size={18} className="text-white font-bold" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Items Section - Always available */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-[#4a5c2f] bg-[#f8f4e3] inline-block px-8 py-4 rounded-2xl shadow-lg">
                Additional
              </h2>
            </div>

            <div className="grid grid-cols-4 gap-6 max-w-4xl mx-auto">
              {additionalItems.map((item) => (
                <div
                  key={item.id}
                  className={`bg-[#FFA500] rounded-2xl overflow-hidden shadow-lg transition-all duration-300 ${
                    animatingItems.includes(item.id) ? "animate-bounce scale-110" : ""
                  }`}
                >
                  <div className="p-3 text-center">
                    <h3 className="text-[#4a5c2f] font-bold text-lg">{item.name}</h3>
                  </div>
                  <div className="relative h-40 w-full">
                    <Image
                      src={item.image || "/placeholder.svg?height=160&width=160"}
                      alt={item.name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg?height=160&width=160"
                      }}
                    />
                  </div>
                  <div className="p-4 flex justify-between items-center">
                    <span className="text-[#4a5c2f] font-bold text-lg">Rp{item.price.toLocaleString()}</span>
                    <button
                      onClick={() => addToCart(item.id, item.name, item.price, item.image)}
                      className="bg-[#5a6c3f] hover:bg-[#4a5c2f] rounded-full w-9 h-9 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
                      aria-label={`Add ${item.name} to cart`}
                    >
                      <Plus size={20} className="text-white font-bold" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Package Section */}
          <div className="bg-[#b3a278] rounded-3xl p-8 shadow-xl">
            <h2 className="text-4xl font-bold text-[#4a5c2f] text-center mb-12">Our Package</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Weekly Package */}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-[#4a5c2f] mb-2">Weekly</h3>
                <p className="text-[#4a5c2f] mb-6">(2 Weeks)</p>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[#FFA500] font-medium bg-[#FEF9E1] px-3 py-1 rounded-lg border">
                      Lunch / Dinner
                    </span>
                    <div className="flex items-center">
                      <span className="text-[#4a5c2f] font-bold">Rp350.000</span>
                      <button
                        onClick={() =>
                          addToCart(
                            "package-weekly-1",
                            "Weekly Package (Lunch/Dinner)",
                            350000,
                            "/images/food-image.png",
                          )
                        }
                        className="ml-2 bg-[#FFA500] hover:bg-[#FF8C00] rounded-full w-7 h-7 flex items-center justify-center transition-all duration-200 hover:scale-110"
                      >
                        <Plus size={16} className="text-white" />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[#FFA500] font-medium bg-[#FEF9E1] px-3 py-1 rounded-lg border">
                      Lunch & Dinner
                    </span>
                    <div className="flex items-center">
                      <span className="text-[#4a5c2f] font-bold">Rp680.000</span>
                      <button
                        onClick={() =>
                          addToCart(
                            "package-weekly-2",
                            "Weekly Package (Lunch & Dinner)",
                            680000,
                            "/images/food-image.png",
                          )
                        }
                        className="ml-2 bg-[#FFA500] hover:bg-[#FF8C00] rounded-full w-7 h-7 flex items-center justify-center transition-all duration-200 hover:scale-110"
                      >
                        <Plus size={16} className="text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Monthly A Package */}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-[#4a5c2f] mb-2">Monthly A</h3>
                <p className="text-[#4a5c2f] mb-6">(1 Month)</p>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[#FFA500] font-medium bg-[#FEF9E1] px-3 py-1 rounded-lg border">
                      Lunch / Dinner
                    </span>
                    <div className="flex items-center">
                      <span className="text-[#4a5c2f] font-bold">Rp700.000</span>
                      <button
                        onClick={() =>
                          addToCart(
                            "package-monthly-a-1",
                            "Monthly A Package (Lunch/Dinner)",
                            700000,
                            "/images/food-image.png",
                          )
                        }
                        className="ml-2 bg-[#FFA500] hover:bg-[#FF8C00] rounded-full w-7 h-7 flex items-center justify-center transition-all duration-200 hover:scale-110"
                      >
                        <Plus size={16} className="text-white" />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[#FFA500] font-medium bg-[#FEF9E1] px-3 py-1 rounded-lg border">
                      Lunch & Dinner
                    </span>
                    <div className="flex items-center">
                      <span className="text-[#4a5c2f] font-bold">Rp1.300.000</span>
                      <button
                        onClick={() =>
                          addToCart(
                            "package-monthly-a-2",
                            "Monthly A Package (Lunch & Dinner)",
                            1300000,
                            "/images/food-image.png",
                          )
                        }
                        className="ml-2 bg-[#FFA500] hover:bg-[#FF8C00] rounded-full w-7 h-7 flex items-center justify-center transition-all duration-200 hover:scale-110"
                      >
                        <Plus size={16} className="text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Monthly B Package */}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-[#4a5c2f] mb-2">Monthly B</h3>
                <p className="text-[#4a5c2f] mb-6">(2 Months)</p>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[#FFA500] font-medium bg-[#FEF9E1] px-3 py-1 rounded-lg border">
                      Lunch / Dinner
                    </span>
                    <div className="flex items-center">
                      <span className="text-[#4a5c2f] font-bold">Rp1.375.000</span>
                      <button
                        onClick={() =>
                          addToCart(
                            "package-monthly-b-1",
                            "Monthly B Package (Lunch/Dinner)",
                            1375000,
                            "/images/food-image.png",
                          )
                        }
                        className="ml-2 bg-[#FFA500] hover:bg-[#FF8C00] rounded-full w-7 h-7 flex items-center justify-center transition-all duration-200 hover:scale-110"
                      >
                        <Plus size={16} className="text-white" />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[#FFA500] font-medium bg-[#FEF9E1] px-3 py-1 rounded-lg border">
                      Lunch & Dinner
                    </span>
                    <div className="flex items-center">
                      <span className="text-[#4a5c2f] font-bold">Rp2.450.000</span>
                      <button
                        onClick={() =>
                          addToCart(
                            "package-monthly-b-2",
                            "Monthly B Package (Lunch & Dinner)",
                            2450000,
                            "/images/food-image.png",
                          )
                        }
                        className="ml-2 bg-[#FFA500] hover:bg-[#FF8C00] rounded-full w-7 h-7 flex items-center justify-center transition-all duration-200 hover:scale-110"
                      >
                        <Plus size={16} className="text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-12 text-[#4a5c2f]">
              <p className="mb-4">
                Untuk informasi lebih lanjut atau konsultasi, dapat klik tombol dibawah ini untuk diarahkan ke Whatsapp
                kami
              </p>
              <Button
                className="bg-[#5a6c3f] hover:bg-[#4a5c2f] text-[#FFA500] font-bold px-6 py-2 rounded-lg"
                onClick={() => window.open("https://wa.me/62895639201682", "_blank")}
              >
                Konsultasi Sekarang!
              </Button>
            </div>
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
