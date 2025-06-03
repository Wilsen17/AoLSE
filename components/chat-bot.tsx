"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, Send, X, Bot, User } from "lucide-react"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

// Predefined responses for common questions
const responses = [
  {
    keywords: ["harga", "biaya", "tarif", "price", "cost"],
    response:
      "Harga makanan kami berkisar antara Rp 5.000 - Rp 25.000 per item. Nasi (putih/merah): Rp 5.000-5.500, Lauk protein (ayam, sapi, ikan): Rp 13.500-25.000, Sayuran: Rp 7.500-10.000, Sambal: Rp 2.500. Minimum order Rp 50.000 dan gratis ongkir untuk order di atas Rp 100.000.",
  },
  {
    keywords: ["menu", "makanan", "food", "makan"],
    response:
      "Menu kami berubah setiap hari. Kami menyediakan berbagai pilihan nasi, lauk protein (ayam, sapi, ikan), sayuran, dan sambal. Anda dapat melihat menu lengkap di halaman Menu pada website kami.",
  },
  {
    keywords: ["kirim", "antar", "delivery", "ongkir", "ongkos"],
    response:
      "Kami melayani pengiriman ke area Jakarta, Bogor, Depok, Tangerang, dan Bekasi. Waktu pengiriman untuk makan siang adalah pukul 10:00-14:00. Biaya pengiriman bervariasi tergantung lokasi, tetapi gratis untuk pesanan di atas Rp 100.000.",
  },
  {
    keywords: ["bayar", "payment", "transfer", "gopay", "ovo", "dana"],
    response:
      "Kami menerima pembayaran melalui transfer bank dan e-wallet (GoPay, OVO, DANA). Pembayaran dilakukan setelah Anda mengonfirmasi pesanan.",
  },
  {
    keywords: ["pesan", "order", "cara", "how"],
    response:
      "Cara pemesanan: 1) Pilih menu di halaman Menu, 2) Tambahkan ke keranjang, 3) Isi alamat pengiriman, 4) Pilih metode pembayaran, 5) Konfirmasi pesanan.",
  },
  {
    keywords: ["paket", "package", "langganan", "subscription", "catering"],
    response:
      "Kami menyediakan paket langganan mingguan dan bulanan dengan harga spesial. Paket Hemat (5 hari): Rp 225.000, Paket Standar (5 hari): Rp 275.000, Paket Premium (5 hari): Rp 350.000. Semua paket termasuk nasi, lauk utama, sayuran, dan sambal.",
  },
  {
    keywords: ["sehat", "health", "nutrisi", "nutrition", "kalori", "calorie"],
    response:
      "Makanan kami dimasak dengan bahan-bahan segar dan berkualitas. Kami meminimalkan penggunaan minyak dan garam berlebih. Setiap menu menyediakan informasi kalori dan nutrisi yang dapat Anda lihat saat memesan.",
  },
  {
    keywords: ["kontak", "contact", "telepon", "phone", "email", "whatsapp", "wa"],
    response:
      "Anda dapat menghubungi kami melalui WhatsApp di nomor 0812-3456-7890, email di info@yourdailymeal.com, atau melalui formulir kontak di website kami.",
  },
]

// Default responses when no keyword matches
const defaultResponses = [
  "Terima kasih atas pertanyaan Anda. Kami menyediakan layanan katering makanan sehat harian dengan menu yang berubah setiap hari. Ada yang ingin Anda ketahui tentang menu, harga, atau cara pemesanan?",
  "Sebagai asisten YourDailyMeal, saya dapat membantu Anda dengan informasi seputar menu, harga, pengiriman, dan cara pemesanan. Apa yang ingin Anda ketahui lebih lanjut?",
  "YourDailyMeal menyediakan makanan sehat harian dengan pengiriman ke area Jabodetabek. Kami memiliki berbagai pilihan menu yang berubah setiap hari. Ada yang bisa saya bantu jelaskan lebih detail?",
  "Maaf, saya tidak memiliki informasi spesifik tentang hal tersebut. Namun, saya bisa membantu Anda dengan informasi tentang menu, harga, pengiriman, atau cara pemesanan YourDailyMeal.",
]

// Function to get response based on user input
const getResponse = (input: string): string => {
  const lowercaseInput = input.toLowerCase()

  // Check for greetings
  if (/^(halo|hai|hi|hello|hey|selamat|pagi|siang|sore|malam)/.test(lowercaseInput)) {
    return "Halo! Selamat datang di YourDailyMeal. Ada yang bisa saya bantu terkait layanan katering kami?"
  }

  // Check for thank you
  if (/^(terima kasih|makasih|thanks|thank you|thx)/.test(lowercaseInput)) {
    return "Sama-sama! Senang bisa membantu Anda. Ada hal lain yang ingin Anda tanyakan?"
  }

  // Check for goodbye
  if (/^(bye|selamat tinggal|sampai jumpa|dadah)/.test(lowercaseInput)) {
    return "Terima kasih telah menghubungi YourDailyMeal. Sampai jumpa kembali!"
  }

  // Check for predefined responses
  for (const item of responses) {
    if (item.keywords.some((keyword) => lowercaseInput.includes(keyword))) {
      return item.response
    }
  }

  // Return random default response if no match
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Halo! Saya asisten YourDailyMeal. Saya bisa membantu Anda dengan informasi tentang paket makanan, harga, pengiriman, dan pertanyaan lainnya. Ada yang bisa saya bantu?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Small delay to ensure the sheet is fully opened
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Simulate typing delay for more natural interaction
    setTimeout(() => {
      try {
        const responseText = getResponse(userMessage.content)

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: responseText,
          role: "assistant",
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, assistantMessage])
      } catch (error) {
        console.error("Error generating response:", error)
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "Maaf, terjadi kesalahan. Silakan coba lagi atau hubungi customer service kami.",
          role: "assistant",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
      }
    }, 1000) // 1 second delay to simulate thinking
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-[#7a8c4f] hover:bg-[#5a6c3f] shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
        >
          <MessageCircle size={24} className="text-white" />
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/20" onClick={() => setIsOpen(false)} />

          {/* Chat Container */}
          <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-md h-[500px] flex flex-col">
            {/* Header */}
            <div className="bg-[#7a8c4f] text-white p-4 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bot size={20} />
                <div>
                  <h3 className="font-semibold">YourDailyMeal Assistant</h3>
                  <p className="text-xs opacity-90">Online sekarang</p>
                </div>
              </div>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 p-1"
              >
                <X size={18} />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === "user" ? "bg-[#7a8c4f] text-white" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.role === "assistant" && <Bot size={16} className="mt-1 flex-shrink-0" />}
                      {message.role === "user" && <User size={16} className="mt-1 flex-shrink-0" />}
                      <div>
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${message.role === "user" ? "text-white/70" : "text-gray-500"}`}>
                          {message.timestamp.toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Bot size={16} />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ketik pesan Anda..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-[#7a8c4f] hover:bg-[#5a6c3f] text-white px-3"
                >
                  <Send size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ChatBot
