"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import OrderStatus from "@/components/order-status"
import { useRouter } from "next/navigation"
import ThankYouPopup from "@/components/thank-you-popup"

interface ActiveOrder {
  id: string
  status: "placed" | "cooking" | "delivery" | "completed"
}

interface Testimonial {
  id: number
  name: string
  photo: string
  reviews: {
    image: string
    text: string
    alt: string
  }[]
}

export default function HomePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [hasActiveOrder, setHasActiveOrder] = useState(false)
  const [activeOrder, setActiveOrder] = useState<ActiveOrder | null>(null)
  const [showThankYouPopup, setShowThankYouPopup] = useState(false)
  const [completedOrderId, setCompletedOrderId] = useState("")
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [slideDirection, setSlideDirection] = useState<"left" | "right" | null>(null)

  // Testimonials data
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Ferdinand Wangsa",
      photo: "/images/ferdinand-wangsa.png",
      reviews: [
        {
          image: "/images/nasi-goreng.png",
          text: "Nasi gorengnya super smoky saya jadi tidak bisa stop makan 😍😍",
          alt: "Nasi Goreng",
        },
        {
          image: "/images/capcay.png",
          text: "Capcaynya lezat dan bergizi mengingatkan saya dengan masakan ibu 🥰🥰",
          alt: "Capcay",
        },
        {
          image: "/images/sayur-hijau.png",
          text: "Tingkat kematangan ayam sempurna dan cabe ijonya sangat lezat 😋❤️",
          alt: "Sayur Hijau",
        },
        {
          image: "/images/tempe-goreng.png",
          text: "Benar-benar nikmat!! tempenya seperti dimasak oleh Gordon Ramsey 🤩🤩",
          alt: "Tempe Goreng",
        },
      ],
    },
    {
      id: 2,
      name: "Thomas Wongso",
      photo: "/images/thomas-wongso.jpg",
      reviews: [
        {
          image: "/images/tongseng-sapi.png",
          text: "Tongseng sapinya juara banget! Bumbu meresap sempurna dan dagingnya empuk 🤤🔥",
          alt: "Tongseng Sapi",
        },
        {
          image: "/images/nila-cabe-ijo.png",
          text: "Nila cabe ijonya fresh dan pedasnya pas banget di lidah! Nagih terus 🌶️😋",
          alt: "Nila Cabe Ijo",
        },
        {
          image: "/images/sayur-lodeh.png",
          text: "Sayur lodehnya creamy dan sayurannya segar, bikin kangen kampung halaman 🥥💚",
          alt: "Sayur Lodeh",
        },
      ],
    },
  ]

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))

      // Check for active order
      const storedActiveOrder = localStorage.getItem("activeOrder")
      if (storedActiveOrder) {
        try {
          const parsedOrder = JSON.parse(storedActiveOrder)
          setActiveOrder(parsedOrder)
          setHasActiveOrder(true)
        } catch (e) {
          console.error("Error parsing active order:", e)

          // Mock active order if error
          setActiveOrder({
            id: "ORD-003",
            status: "cooking",
          })
          setHasActiveOrder(true)
        }
      } else {
        // No active order in localStorage
        setHasActiveOrder(false)
        setActiveOrder(null)
      }
    }
  }, [])

  useEffect(() => {
    // Check for completed order from checkout
    const completedOrder = localStorage.getItem("completedOrder")
    if (completedOrder) {
      setCompletedOrderId(completedOrder)
      setShowThankYouPopup(true)
      localStorage.removeItem("completedOrder") // Clear it after showing
    }
  }, [])

  const handlePrevTestimonial = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setSlideDirection("right")
    setTimeout(() => {
      setCurrentTestimonialIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
      setIsAnimating(false)
      setSlideDirection(null)
    }, 300)
  }

  const handleNextTestimonial = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setSlideDirection("left")
    setTimeout(() => {
      setCurrentTestimonialIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
      setIsAnimating(false)
      setSlideDirection(null)
    }, 300)
  }

  const handleIndicatorClick = (index: number) => {
    if (isAnimating || index === currentTestimonialIndex) return
    setIsAnimating(true)
    setSlideDirection(index > currentTestimonialIndex ? "left" : "right")
    setTimeout(() => {
      setCurrentTestimonialIndex(index)
      setIsAnimating(false)
      setSlideDirection(null)
    }, 300)
  }

  const currentTestimonial = testimonials[currentTestimonialIndex]

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section - WITH PATTERN */}
      <section
        className="relative py-16 px-6 overflow-hidden"
        style={{
          backgroundImage: `url('/images/leaf-pattern-new.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#f8f3e2",
        }}
      >
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="text-center mb-12">
              <div className="inline-block bg-[#f8f4e3] px-6 py-4 rounded-xl shadow-md">
                <h1 className="text-4xl md:text-5xl font-bold text-[#4a5c2f] mb-2">
                  Gak sempet masak karna ga ada waktu??
                </h1>
                <h2 className="text-3xl md:text-4xl font-bold text-[#7a8c4f]">Ikut program kami ajaa!!</h2>
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <div className="relative w-full h-screen rounded-2xl overflow-hidden shadow-2xl">
              <Image src="/images/food-image.png" alt="Nasi dengan lauk pauk lengkap" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Nilai Utama Section - SOLID COLOR */}
      <section className="bg-[#7a8c4f] py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Nilai Utama Title */}
          <h2 className="text-4xl font-bold text-[#FFA500] text-center mb-8" style={{ fontFamily: "serif" }}>
            Nilai Utama
          </h2>

          {/* Nilai Utama Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            <div className="text-center text-white">
              <h3 className="text-xl font-bold mb-3 text-[#FFA500]">Kualitas</h3>
              <p className="text-sm leading-relaxed">
                Setiap hidangan kami dibuat dari bahan segar pilihan dan dimasak dengan standar kebersihan tinggi untuk
                menjaga cita rasa dan kesehatan Anda.
              </p>
            </div>

            <div className="text-center text-white">
              <h3 className="text-xl font-bold mb-3 text-[#FFA500]">Inovasi</h3>
              <p className="text-sm leading-relaxed">
                Kami terus menghadirkan variasi menu yang kreatif dan mengikuti tren kuliner agar Anda tidak bosan dan
                selalu punya pilihan menarik setiap hari.
              </p>
            </div>

            <div className="text-center text-white">
              <h3 className="text-xl font-bold mb-3 text-[#FFA500]">Keberlanjutan</h3>
              <p className="text-sm leading-relaxed">
                Kami berkomitmen pada penggunaan kemasan ramah lingkungan dan praktik dapur yang minim limbah untuk
                menjaga bumi tetap lestari.
              </p>
            </div>

            <div className="text-center text-white">
              <h3 className="text-xl font-bold mb-3 text-[#FFA500]">Terjangkau</h3>
              <p className="text-sm leading-relaxed">
                Makanan enak dan bergizi tidak harus mahal—kami hadir untuk menyediakan pilihan makan harian yang hemat
                tanpa mengorbankan kualitas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* White Pattern Divider */}
      <div
        className="h-16"
        style={{
          backgroundImage: `url('/images/leaf-pattern-new.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#f8f3e2",
        }}
      ></div>

      {/* Menu Favorit Section - SOLID COLOR */}
      <section className="bg-[#DDB04E] py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Left Side - Images */}
            <div className="flex-1">
              <div className="grid grid-cols-3 gap-4 h-full">
                {/* Large Capcay Image - Spans 2 columns and 2 rows */}
                <div className="col-span-2 row-span-2">
                  <div className="relative w-full h-80 rounded-lg overflow-hidden shadow-lg">
                    <Image src="/images/capcay-seafood.png" alt="Capcay Seafood" fill className="object-cover" />
                  </div>
                </div>

                {/* Top Right - Telur Balado */}
                <div className="relative w-full h-38 rounded-lg overflow-hidden shadow-lg">
                  <Image src="/images/telur-balado.png" alt="Telur Balado" fill className="object-cover" />
                </div>

                {/* Middle Right - Tumis Buncis */}
                <div className="relative w-full h-38 rounded-lg overflow-hidden shadow-lg">
                  <Image src="/images/tumis-buncis.png" alt="Tumis Buncis" fill className="object-cover" />
                </div>

                {/* Bottom Left - Martabak Telur */}
                <div className="relative w-full h-48 rounded-lg overflow-hidden shadow-lg">
                  <Image src="/images/martabak-telur.png" alt="Martabak Telur" fill className="object-cover" />
                </div>

                {/* Bottom Middle - Sayur Hijau */}
                <div className="relative w-full h-48 rounded-lg overflow-hidden shadow-lg">
                  <Image src="/images/sayur-hijau.png" alt="Sayur Hijau" fill className="object-cover" />
                </div>

                {/* Bottom Right - Ikan Teri */}
                <div className="relative w-full h-48 rounded-lg overflow-hidden shadow-lg">
                  <Image src="/images/ikan-teri.png" alt="Ikan Teri" fill className="object-cover" />
                </div>
              </div>
            </div>

            {/* Right Side - Menu List */}
            <div className="lg:w-1/3 flex flex-col justify-center items-center text-center">
              <h2 className="text-4xl font-bold text-[#4a5c2f] mb-8">Menu Favorit</h2>

              <div className="space-y-4 text-[#4a5c2f] mb-8">
                <p className="text-xl font-medium">Ayam Sayur</p>
                <p className="text-xl font-medium">Telur Dadar</p>
                <p className="text-xl font-medium">Ikan Teri</p>
                <p className="text-xl font-medium">Telur Balado</p>
                <p className="text-xl font-medium">Sayur Bayam</p>
                <p className="text-xl font-medium">Tempe Orek</p>
              </div>

              <Button
                onClick={() => router.push("/menu")}
                className="bg-[#7a8c4f] hover:bg-[#5a6c3f] text-white px-8 py-3 text-lg rounded-lg"
              >
                View More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* White Pattern Divider */}
      <div
        className="h-16"
        style={{
          backgroundImage: `url('/images/leaf-pattern-new.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#f8f3e2",
        }}
      ></div>

      {/* Testimonial Section - SOLID BEIGE COLOR */}
      <section className="bg-[#FFF9E2] py-16 px-6">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-5xl font-bold text-[#8B4513] text-center mb-16" style={{ fontFamily: "serif" }}>
            Testimonial
          </h2>

          <div className="flex items-center justify-center">
            <button
              onClick={handlePrevTestimonial}
              disabled={isAnimating}
              className="p-4 bg-[#FFA500] text-white rounded-full hover:bg-[#FF8C00] w-16 h-16 flex items-center justify-center mr-8 shadow-lg transition-all duration-200 disabled:opacity-50"
            >
              <ChevronLeft size={32} />
            </button>

            <div className="flex-1 max-w-6xl overflow-hidden">
              <div
                className={`transition-all duration-500 ease-in-out ${
                  isAnimating
                    ? slideDirection === "left"
                      ? "-translate-x-full opacity-0"
                      : "translate-x-full opacity-0"
                    : "translate-x-0 opacity-100"
                }`}
              >
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Person's Photo - Left Side */}
                  <div className="flex-shrink-0">
                    <div className="relative w-64 h-64 rounded-2xl overflow-hidden shadow-xl">
                      <Image
                        src={currentTestimonial.photo || "/placeholder.svg?height=256&width=256"}
                        alt={currentTestimonial.name}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg?height=256&width=256"
                        }}
                      />
                    </div>
                    <h3 className="text-3xl font-bold text-[#7a8c4f] mt-4 text-center">{currentTestimonial.name}</h3>
                  </div>

                  {/* Food Reviews - Right Side */}
                  <div className="flex-1">
                    {currentTestimonial.id === 2 ? (
                      // Thomas Wongso - Triangle layout (3 items)
                      <div className="flex flex-col items-center gap-6">
                        {/* Top row - 2 items */}
                        <div className="flex gap-8 justify-center">
                          <div className="text-center">
                            <div className="relative w-32 h-32 mx-auto mb-4 rounded-2xl overflow-hidden shadow-lg">
                              <Image
                                src={currentTestimonial.reviews[0].image || "/placeholder.svg?height=128&width=128"}
                                alt={currentTestimonial.reviews[0].alt}
                                fill
                                className="object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.src = "/placeholder.svg?height=128&width=128"
                                }}
                              />
                            </div>
                            <p className="text-sm text-[#4a5c2f] leading-relaxed max-w-40">
                              {currentTestimonial.reviews[0].text}
                            </p>
                          </div>
                          <div className="text-center">
                            <div className="relative w-32 h-32 mx-auto mb-4 rounded-2xl overflow-hidden shadow-lg">
                              <Image
                                src={currentTestimonial.reviews[1].image || "/placeholder.svg?height=128&width=128"}
                                alt={currentTestimonial.reviews[1].alt}
                                fill
                                className="object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.src = "/placeholder.svg?height=128&width=128"
                                }}
                              />
                            </div>
                            <p className="text-sm text-[#4a5c2f] leading-relaxed max-w-40">
                              {currentTestimonial.reviews[1].text}
                            </p>
                          </div>
                        </div>
                        {/* Bottom row - 1 item centered */}
                        <div className="text-center">
                          <div className="relative w-32 h-32 mx-auto mb-4 rounded-2xl overflow-hidden shadow-lg">
                            <Image
                              src={currentTestimonial.reviews[2].image || "/placeholder.svg?height=128&width=128"}
                              alt={currentTestimonial.reviews[2].alt}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = "/placeholder.svg?height=128&width=128"
                              }}
                            />
                          </div>
                          <p className="text-sm text-[#4a5c2f] leading-relaxed max-w-40">
                            {currentTestimonial.reviews[2].text}
                          </p>
                        </div>
                      </div>
                    ) : (
                      // Ferdinand Wangsa - Grid layout (4 items)
                      <div className="grid grid-cols-2 gap-6">
                        {currentTestimonial.reviews.map((review, index) => (
                          <div key={index} className="text-center">
                            <div className="relative w-32 h-32 mx-auto mb-4 rounded-2xl overflow-hidden shadow-lg">
                              <Image
                                src={review.image || "/placeholder.svg?height=128&width=128"}
                                alt={review.alt}
                                fill
                                className="object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.src = "/placeholder.svg?height=128&width=128"
                                }}
                              />
                            </div>
                            <p className="text-sm text-[#4a5c2f] leading-relaxed">{review.text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleNextTestimonial}
              disabled={isAnimating}
              className="p-4 bg-[#FFA500] text-white rounded-full hover:bg-[#FF8C00] w-16 h-16 flex items-center justify-center ml-8 shadow-lg transition-all duration-200 disabled:opacity-50"
            >
              <ChevronRight size={32} />
            </button>
          </div>

          {/* Testimonial Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleIndicatorClick(index)}
                disabled={isAnimating}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentTestimonialIndex ? "bg-[#FFA500] scale-125" : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* White Pattern Divider */}
      <div
        className="h-16"
        style={{
          backgroundImage: `url('/images/leaf-pattern-new.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#f8f3e2",
        }}
      ></div>

      {/* CTA Section - SOLID COLOR - Modified for logged in users */}
      <section className="bg-[#AC9362] px-8 py-12 flex items-center">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-center gap-8">
          {/* Text Section */}
          <div className="flex-1 flex flex-col items-center md:items-start justify-center text-center md:text-left text-[#4a3f2d]">
            <h2 className="text-4xl font-bold mb-4">Siap praktis bareng kita ?</h2>
            <p className="text-xl mb-6">Klik order sekarang juga</p>
            <Button
              onClick={() => (user ? router.push("/menu") : router.push("/login"))}
              className="bg-[#7a8c4f] hover:bg-[#6a7c3e] text-white font-semibold text-lg px-6 py-3 rounded-lg shadow-md"
            >
              Order Here
            </Button>

            {/* Order Status - Only shown for logged in users with active orders */}
            {user && (
              <div className="mt-8">
                {hasActiveOrder && activeOrder ? (
                  <OrderStatus currentStatus={activeOrder.status} orderId={activeOrder.id} />
                ) : (
                  <div className="text-center text-[#4a3f2d] mt-6">
                    <p className="text-lg font-medium">Belum ada pesanan aktif</p>
                    <p className="text-sm">Silakan pesan makanan untuk melihat status pesanan</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Image Section */}
          <div className="flex-1 flex justify-center">
            <div className="rounded-lg overflow-hidden shadow-lg max-w-md w-full">
              <img src="/images/sushi-dining.png" alt="Dining Experience" className="w-full h-auto object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* White Pattern Divider */}
      <div
        className="h-16"
        style={{
          backgroundImage: `url('/images/leaf-pattern-new.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#f8f3e2",
        }}
      ></div>

      {/* Footer - BRIGHT YELLOW COLOR */}
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
      {/* Thank You Popup */}
      <ThankYouPopup
        isOpen={showThankYouPopup}
        onClose={() => setShowThankYouPopup(false)}
        orderId={completedOrderId}
      />
    </div>
  )
}
