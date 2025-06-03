"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Plus, Edit, Trash2, Save, X, Camera } from "lucide-react"

interface AdditionalItem {
  id: number
  name: string
  price: number
  category: string
  image?: string
}

export default function AdminAdditional() {
  const router = useRouter()
  const [additionalItems, setAdditionalItems] = useState<AdditionalItem[]>([])
  const [editingItem, setEditingItem] = useState<number | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "sambal",
    image: "",
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")

  useEffect(() => {
    // Check if admin is logged in
    const adminData = localStorage.getItem("admin")
    if (!adminData) {
      router.push("/login")
      return
    }
    loadAdditionalItems()
  }, [router])

  const loadAdditionalItems = () => {
    const storedItems = localStorage.getItem("additionalItems")
    if (storedItems) {
      setAdditionalItems(JSON.parse(storedItems))
    } else {
      // Initialize with default items
      const defaultItems = [
        {
          id: 1,
          name: "Sambal Bawang",
          price: 2000,
          category: "sambal",
          image: "/images/sambal-bawang.png",
        },
        {
          id: 2,
          name: "Sambal Matah",
          price: 2000,
          category: "sambal",
          image: "/images/sambal-matah.png",
        },
        {
          id: 3,
          name: "Sambal Ijo",
          price: 2000,
          category: "sambal",
          image: "/images/sambal-ijo.png",
        },
        {
          id: 4,
          name: "Sambal Terasi",
          price: 2000,
          category: "sambal",
          image: "/images/sambal-terasi.png",
        },
      ]
      setAdditionalItems(defaultItems)
      localStorage.setItem("additionalItems", JSON.stringify(defaultItems))
    }
  }

  const saveAdditionalItem = (itemId: number, updatedData: Partial<AdditionalItem>) => {
    const updatedItems = additionalItems.map((item) => (item.id === itemId ? { ...item, ...updatedData } : item))
    setAdditionalItems(updatedItems)
    localStorage.setItem("additionalItems", JSON.stringify(updatedItems))
    setEditingItem(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newItem: AdditionalItem = {
      id: Date.now(),
      name: formData.name,
      price: Number.parseInt(formData.price),
      category: "sambal",
      image: imageFile ? URL.createObjectURL(imageFile) : formData.image,
    }
    const updatedItems = [...additionalItems, newItem]
    setAdditionalItems(updatedItems)
    localStorage.setItem("additionalItems", JSON.stringify(updatedItems))

    // Reset form
    setFormData({ name: "", price: "", category: "sambal", image: "" })
    setImageFile(null)
    setImagePreview("")
    setShowAddForm(false)
  }

  const handleDelete = (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus item ini?")) return

    const updatedItems = additionalItems.filter((item) => item.id !== id)
    setAdditionalItems(updatedItems)
    localStorage.setItem("additionalItems", JSON.stringify(updatedItems))
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
      {/* Header */}
      <header className="w-full bg-[#b3a278] py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Image src="/images/logo.png" alt="Your Daily Meal" width={120} height={56} className="h-auto" />
            <span className="text-[#4a5c2f] font-bold text-xl">Kelola Additional Items</span>
          </div>
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
              <h1 className="text-3xl font-bold text-[#4a5c2f]">Kelola Item Tambahan</h1>
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-[#7a8c4f] text-white px-4 py-2 rounded-lg hover:bg-[#5a6c3f] flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>Tambah Item</span>
              </Button>
            </div>

            {/* Add Form */}
            {showAddForm && (
              <div className="bg-[#f8f3e2] p-6 rounded-lg mb-6">
                <h2 className="text-xl font-semibold text-[#4a5c2f] mb-4">Tambah Item Baru</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    placeholder="Nama Item"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <Input
                    placeholder="Harga"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
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
                  <div className="md:col-span-3 flex space-x-4">
                    <Button type="submit" className="bg-[#7a8c4f] text-white px-6 py-2 rounded-lg hover:bg-[#5a6c3f]">
                      <Save size={16} className="mr-2" />
                      Simpan
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false)
                        setFormData({ name: "", price: "", category: "sambal", image: "" })
                        setImageFile(null)
                        setImagePreview("")
                      }}
                      className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                    >
                      <X size={16} className="mr-2" />
                      Batal
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {additionalItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {item.image && (
                    <div className="h-48 bg-gray-200 flex items-center justify-center relative">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
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
                                  saveAdditionalItem(item.id, { image: e.target?.result as string })
                                }
                                reader.readAsDataURL(file)
                              }
                            }}
                            className="hidden"
                            id={`image-${item.id}`}
                          />
                          <label
                            htmlFor={`image-${item.id}`}
                            className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-sm p-2 rounded-full cursor-pointer shadow-md hover:bg-white/90 transition-all"
                          >
                            <Camera size={14} className="text-gray-700" />
                          </label>
                        </>
                      )}
                    </div>
                  )}

                  {editingItem === item.id ? (
                    <div className="p-4 space-y-2">
                      <Input
                        defaultValue={item.name}
                        onBlur={(e) => saveAdditionalItem(item.id, { name: e.target.value })}
                        className="font-semibold"
                      />
                      <Input
                        defaultValue={item.price.toString()}
                        type="number"
                        onBlur={(e) => saveAdditionalItem(item.id, { price: Number.parseInt(e.target.value) })}
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
                      <p className="text-lg font-bold text-[#7a8c4f] mb-4">Rp {item.price.toLocaleString()}</p>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => setEditingItem(item.id)}
                          className="bg-[#b3a278] text-white px-3 py-1 rounded text-sm hover:bg-[#9d8f6b] flex items-center space-x-1"
                        >
                          <Edit size={14} />
                          <span>Edit</span>
                        </Button>
                        <Button
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 flex items-center space-x-1"
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

            {additionalItems.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Tidak ada item tambahan ditemukan.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
