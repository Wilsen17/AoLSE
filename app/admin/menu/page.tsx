"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Plus, Edit, Trash2, Save, X, Camera } from "lucide-react"

interface MenuItem {
  id: string
  name: string
  image: string
  price: number
  day: string
  category: string
}

export default function AdminMenuPage() {
  const router = useRouter()
  const [admin, setAdmin] = useState<any>(null)
  const [selectedDay, setSelectedDay] = useState("Monday")
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [newItem, setNewItem] = useState({ name: "", price: "", image: "", category: "main" })
  const [showAddForm, setShowAddForm] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  // Default menu data yang sama dengan user
  const defaultMenuData = {
    Monday: [
      { id: "m1-1", name: "Nasi Putih", image: "/images/nasi-putih.png", price: 5000, category: "main" },
      { id: "m1-2", name: "Nasi Merah", image: "/images/nasi-merah.png", price: 5500, category: "main" },
      { id: "m1-3", name: "Ayam Woku", image: "/images/ayam-woku.png", price: 19000, category: "main" },
      { id: "m1-4", name: "Sapi Lada Hitam", image: "/images/sapi-lada-hitam.png", price: 22000, category: "main" },
      { id: "m1-5", name: "Telur Barendo", image: "/images/telur-barendo.png", price: 12000, category: "main" },
      { id: "m1-6", name: "Cah Brokoli", image: "/images/cah-brokoli.png", price: 8000, category: "side" },
      { id: "m1-7", name: "Tauge Ikan Asin", image: "/images/tauge-ikan-asin.png", price: 7000, category: "side" },
      { id: "m1-8", name: "Sayur Bening", image: "/images/sayur-bening.png", price: 6000, category: "side" },
      { id: "m1-9", name: "Nila Goreng", image: "/images/nila-goreng.png", price: 15000, category: "main" },
      { id: "m1-10", name: "Mie Kuning", image: "/images/mie-kuning.png", price: 8000, category: "additional" },
    ],
    Tuesday: [
      { id: "t1-1", name: "Nasi Putih", image: "/images/nasi-putih.png", price: 5000, category: "main" },
      { id: "t1-2", name: "Nasi Merah", image: "/images/nasi-merah.png", price: 5500, category: "main" },
      { id: "t1-3", name: "Ayam Asam Manis", image: "/images/ayam-asam-manis.png", price: 20000, category: "main" },
      { id: "t1-4", name: "Sapi Panggang", image: "/images/sapi-panggang.png", price: 25000, category: "main" },
      { id: "t1-5", name: "Ikan Bakar", image: "/images/ikan-bakar.png", price: 18000, category: "main" },
      { id: "t1-6", name: "Labu Siam", image: "/images/labu-siam.png", price: 7000, category: "side" },
      { id: "t1-7", name: "Bebek Goreng", image: "/images/bebek-goreng.png", price: 28000, category: "main" },
      { id: "t1-8", name: "Tahu Bacem", image: "/images/tahu-bacem.png", price: 6000, category: "side" },
      { id: "t1-9", name: "Kuah Oyong", image: "/images/kuah-oyong.png", price: 8000, category: "side" },
      { id: "t1-10", name: "Telur Balado", image: "/images/telur-balado.png", price: 10000, category: "main" },
    ],
    Wednesday: [
      { id: "w1-1", name: "Nasi Putih", image: "/images/nasi-putih.png", price: 5000, category: "main" },
      { id: "w1-2", name: "Mie Shirataki", image: "/images/mie-shirataki.png", price: 9000, category: "additional" },
      { id: "w1-3", name: "Ayam Goreng", image: "/images/ayam-goreng.png", price: 18000, category: "main" },
      { id: "w1-4", name: "Rendang", image: "/images/rendang.png", price: 25000, category: "main" },
      { id: "w1-5", name: "Tuna Sawir", image: "/images/tuna-sawir.png", price: 16000, category: "main" },
      { id: "w1-6", name: "Cah Kangkung", image: "/images/cah-kangkung.png", price: 7000, category: "side" },
      { id: "w1-7", name: "Semur Daging", image: "/images/semur-daging.png", price: 22000, category: "main" },
      { id: "w1-8", name: "Tempe Orek", image: "/images/tempe-orek.png", price: 6000, category: "side" },
      { id: "w1-9", name: "Soto Lamongan", image: "/images/soto-lamongan.png", price: 15000, category: "main" },
      { id: "w1-10", name: "Bakwan Jagung", image: "/images/bakwan-jagung.png", price: 8000, category: "side" },
    ],
    Thursday: [
      { id: "th1-1", name: "Nasi Putih", image: "/images/nasi-putih.png", price: 5000, category: "main" },
      { id: "th1-2", name: "Nasi Merah", image: "/images/nasi-merah.png", price: 5500, category: "main" },
      { id: "th1-3", name: "Ayam Bakar", image: "/images/ayam-bakar.png", price: 19000, category: "main" },
      { id: "th1-4", name: "Tumis Sapi", image: "/images/tumis-sapi.png", price: 23000, category: "main" },
      { id: "th1-5", name: "Ikan Balado", image: "/images/ikan-balado.png", price: 17000, category: "main" },
      { id: "th1-6", name: "Ayam Kecap", image: "/images/ayam-kecap.png", price: 20000, category: "main" },
      { id: "th1-7", name: "Kentang Balado", image: "/images/kentang-balado.png", price: 8000, category: "side" },
      { id: "th1-8", name: "Sup Jagung", image: "/images/sup-jagung.png", price: 9000, category: "side" },
      { id: "th1-9", name: "Telur Mata Sapi", image: "/images/telur-mata-sapi.png", price: 8000, category: "main" },
      { id: "th1-10", name: "Mie Kuning", image: "/images/mie-kuning.png", price: 8000, category: "additional" },
    ],
    Friday: [
      { id: "f1-1", name: "Nasi Putih", image: "/images/nasi-putih.png", price: 5000, category: "main" },
      { id: "f1-2", name: "Nasi Merah", image: "/images/nasi-merah.png", price: 5500, category: "main" },
      { id: "f1-3", name: "Ayam Geprek", image: "/images/ayam-geprek.png", price: 18000, category: "main" },
      { id: "f1-4", name: "Tongseng Sapi", image: "/images/tongseng-sapi.png", price: 24000, category: "main" },
      { id: "f1-5", name: "Nila Cabe Ijo", image: "/images/nila-cabe-ijo.png", price: 16000, category: "main" },
      { id: "f1-6", name: "Sayur Lodeh", image: "/images/sayur-lodeh.png", price: 8000, category: "side" },
      { id: "f1-7", name: "Terong Balado", image: "/images/terong-balado.png", price: 7000, category: "side" },
      { id: "f1-8", name: "Jamur Goreng", image: "/images/jamur-goreng.png", price: 9000, category: "side" },
      { id: "f1-9", name: "Sayur Asem", image: "/images/sayur-asem.png", price: 7000, category: "side" },
      { id: "f1-10", name: "Tahu Goreng", image: "/images/tahu-goreng.png", price: 6000, category: "side" },
    ],
    Saturday: [
      { id: "s1-1", name: "Nasi Putih", image: "/images/nasi-putih.png", price: 5000, category: "main" },
      { id: "s1-2", name: "Ubi Cilembu", image: "/images/ubi-cilembu.png", price: 8000, category: "additional" },
      { id: "s1-3", name: "Ayam Mentega", image: "/images/ayam-mentega.png", price: 21000, category: "main" },
      { id: "s1-4", name: "Sate Sapi", image: "/images/sate-sapi.png", price: 26000, category: "main" },
      { id: "s1-5", name: "Nila Bakar", image: "/images/nila-bakar.png", price: 17000, category: "main" },
      { id: "s1-6", name: "Cah Timun Udang", image: "/images/cah-timun-udang.png", price: 12000, category: "side" },
      { id: "s1-7", name: "Usus Bakar", image: "/images/usus-bakar.png", price: 15000, category: "main" },
      { id: "s1-8", name: "Sayur Sop", image: "/images/sayur-sop.png", price: 8000, category: "side" },
      { id: "s1-9", name: "Telur Kecap", image: "/images/telur-kecap.png", price: 9000, category: "main" },
      { id: "s1-10", name: "Mie Shirataki", image: "/images/mie-shirataki.png", price: 9000, category: "additional" },
    ],
  }

  useEffect(() => {
    // Check if admin is logged in
    const adminData = localStorage.getItem("admin")
    if (!adminData) {
      router.push("/login")
      return
    }
    setAdmin(JSON.parse(adminData))
    loadMenuItems()
  }, [router, selectedDay])

  const loadMenuItems = () => {
    // Load menu items from localStorage or initialize with default
    const storedMenu = localStorage.getItem("adminMenu")
    if (storedMenu) {
      const allItems = JSON.parse(storedMenu)
      setMenuItems(allItems.filter((item: MenuItem) => item.day === selectedDay))
    } else {
      // Initialize with default menu data
      initializeDefaultMenu()
    }
  }

  const initializeDefaultMenu = () => {
    const allMenuItems: MenuItem[] = []

    Object.entries(defaultMenuData).forEach(([day, items]) => {
      items.forEach((item) => {
        allMenuItems.push({
          ...item,
          day: day,
        })
      })
    })

    // Store in localStorage
    localStorage.setItem("adminMenu", JSON.stringify(allMenuItems))

    // Set the current day's menu items
    setMenuItems(allMenuItems.filter((item) => item.day === selectedDay))
  }

  const saveMenuItem = (itemId: string, updatedData: Partial<MenuItem>) => {
    const storedMenu = localStorage.getItem("adminMenu")
    const allItems = storedMenu ? JSON.parse(storedMenu) : []

    const updatedItems = allItems.map((item: MenuItem) => (item.id === itemId ? { ...item, ...updatedData } : item))

    localStorage.setItem("adminMenu", JSON.stringify(updatedItems))
    loadMenuItems()
    setEditingItem(null)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const addMenuItem = () => {
    if (!newItem.name || !newItem.price) return

    const storedMenu = localStorage.getItem("adminMenu")
    const allItems = storedMenu ? JSON.parse(storedMenu) : []

    const newMenuItem: MenuItem = {
      id: `new-${Date.now()}`,
      name: newItem.name,
      price: Number.parseInt(newItem.price),
      image: imagePreview || "/placeholder.svg?height=128&width=128",
      day: selectedDay,
      category: "main",
    }

    allItems.push(newMenuItem)
    localStorage.setItem("adminMenu", JSON.stringify(allItems))

    setNewItem({ name: "", price: "", image: "", category: "main" })
    setImageFile(null)
    setImagePreview("")
    setShowAddForm(false)
    loadMenuItems()
  }

  const deleteMenuItem = (itemId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus item ini?")) return

    const storedMenu = localStorage.getItem("adminMenu")
    const allItems = storedMenu ? JSON.parse(storedMenu) : []

    const updatedItems = allItems.filter((item: MenuItem) => item.id !== itemId)
    localStorage.setItem("adminMenu", JSON.stringify(updatedItems))
    loadMenuItems()
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
            <Link href="/admin/dashboard">
              <Button className="bg-[#7a8c4f] text-white px-4 py-2 rounded-lg hover:bg-[#5a6c3f] flex items-center space-x-2">
                <ArrowLeft size={16} />
                <span>Back</span>
              </Button>
            </Link>
            <Image src="/images/logo.png" alt="Your Daily Meal" width={120} height={56} className="h-auto" />
          </div>
          <span className="text-[#4a5c2f] font-medium">Admin: {admin.name}</span>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="container mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-[#4a5c2f]">Kelola Menu</h1>
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-[#7a8c4f] text-white px-4 py-2 rounded-lg hover:bg-[#5a6c3f] flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>Tambah Menu</span>
              </Button>
            </div>

            {/* Day Selector */}
            <div className="mb-6">
              <div className="flex space-x-2 overflow-x-auto">
                {days.map((day) => (
                  <Button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                      selectedDay === day ? "bg-[#7a8c4f] text-white" : "bg-gray-200 text-[#4a5c2f] hover:bg-gray-300"
                    }`}
                  >
                    {day}
                  </Button>
                ))}
              </div>
            </div>

            {/* Add New Item Form */}
            {showAddForm && (
              <div className="bg-[#f8f3e2] rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-[#4a5c2f] mb-4">Tambah Menu Baru - {selectedDay}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    placeholder="Nama Menu"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  />
                  <Input
                    placeholder="Harga"
                    type="number"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                  />
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    {imagePreview && (
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="mt-2 w-20 h-20 object-cover rounded"
                      />
                    )}
                  </div>
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button
                    onClick={addMenuItem}
                    className="bg-[#7a8c4f] text-white px-4 py-2 rounded-lg hover:bg-[#5a6c3f]"
                  >
                    <Save size={16} className="mr-2" />
                    Simpan
                  </Button>
                  <Button
                    onClick={() => setShowAddForm(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                  >
                    <X size={16} className="mr-2" />
                    Batal
                  </Button>
                </div>
              </div>
            )}

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {menuItems.map((item) => (
                <div key={item.id} className="bg-[#f8f3e2] rounded-lg overflow-hidden shadow-md">
                  <div className="relative h-32 w-full">
                    <Image
                      src={item.image || "/placeholder.svg?height=128&width=128"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                    {editingItem === item.id && (
                      <>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              const reader = new FileReader()
                              reader.onload = (e) => {
                                saveMenuItem(item.id, { image: e.target?.result as string })
                              }
                              reader.readAsDataURL(file)
                            }
                          }}
                          className="hidden"
                          id={`camera-${item.id}`}
                        />
                        <label
                          htmlFor={`camera-${item.id}`}
                          className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-sm p-2 rounded-full cursor-pointer shadow-md hover:bg-white/90 transition-all"
                        >
                          <Camera size={14} className="text-gray-700" />
                        </label>
                      </>
                    )}
                  </div>

                  {editingItem === item.id ? (
                    <div className="p-4 space-y-2">
                      <Input
                        defaultValue={item.name}
                        onBlur={(e) => saveMenuItem(item.id, { name: e.target.value })}
                        className="font-semibold"
                      />
                      <Input
                        defaultValue={item.price.toString()}
                        type="number"
                        onBlur={(e) => saveMenuItem(item.id, { price: Number.parseInt(e.target.value) })}
                      />
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => setEditingItem(null)}
                          className="bg-[#7a8c4f] text-white px-3 py-1 rounded text-sm"
                        >
                          <Save size={14} />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4">
                      <h3 className="font-semibold text-[#4a5c2f] mb-2">{item.name}</h3>
                      <p className="text-[#7a8c4f] font-bold mb-3">Rp{item.price.toLocaleString()}</p>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => setEditingItem(item.id)}
                          className="bg-[#b3a278] text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                        >
                          <Edit size={14} />
                          <span>Edit</span>
                        </Button>
                        <Button
                          onClick={() => deleteMenuItem(item.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                        >
                          <Trash2 size={14} />
                          <span>Hapus</span>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {menuItems.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Belum ada menu untuk hari {selectedDay}</p>
                <Button
                  onClick={() => setShowAddForm(true)}
                  className="mt-4 bg-[#7a8c4f] text-white px-6 py-2 rounded-lg hover:bg-[#5a6c3f]"
                >
                  Tambah Menu Pertama
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
