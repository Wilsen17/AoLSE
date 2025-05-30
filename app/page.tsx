"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import OrderStatus from "@/components/order-status"

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [hasActiveOrder, setHasActiveOrder] = useState(false)
  const [orderStatus, setOrderStatus] = useState<"placed" | "cooking" | "delivery" | "completed">("cooking")
  const [orderId, setOrderId] = useState("ORD-003")

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))

      // Mock active order - in real app, this would come from API
      setHasActiveOrder(true)
    }
  }, [])

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

              <Button className="bg-[#7a8c4f] hover:bg-[#5a6c3f] text-white px-8 py-3 text-lg rounded-lg">
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
            <button className="p-4 bg-[#FFA500] text-white rounded-full hover:bg-[#FF8C00] w-16 h-16 flex items-center justify-center mr-8 shadow-lg">
              <ChevronLeft size={32} />
            </button>

            <div className="flex-1 max-w-6xl">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Ferdinand's Photo - Left Side */}
                <div className="flex-shrink-0">
                  <div className="relative w-64 h-64 rounded-2xl overflow-hidden shadow-xl">
                    <Image src="/images/ferdinand-wangsa.png" alt="Ferdinand Wangsa" fill className="object-cover" />
                  </div>
                  <h3 className="text-3xl font-bold text-[#7a8c4f] mt-4 text-center">Ferdinand Wangsa</h3>
                </div>

                {/* Food Reviews - Right Side */}
                <div className="flex-1">
                  <div className="grid grid-cols-2 gap-6">
                    {/* Nasi Goreng */}
                    <div className="text-center">
                      <div className="relative w-32 h-32 mx-auto mb-4 rounded-2xl overflow-hidden shadow-lg">
                        <Image src="/images/nasi-goreng.png" alt="Nasi Goreng" fill className="object-cover" />
                      </div>
                      <p className="text-sm text-[#4a5c2f] leading-relaxed">
                        Nasi gorengnya super smoky saya jadi tidak bisa stop makan 😍😍
                      </p>
                    </div>

                    {/* Capcay */}
                    <div className="text-center">
                      <div className="relative w-32 h-32 mx-auto mb-4 rounded-2xl overflow-hidden shadow-lg">
                        <Image src="/images/capcay.png" alt="Capcay" fill className="object-cover" />
                      </div>
                      <p className="text-sm text-[#4a5c2f] leading-relaxed">
                        Capcaynya lezat dan bergizi mengingatkan saya dengan masakan ibu 🥰🥰
                      </p>
                    </div>

                    {/* Tingkat Kematangan Ayam */}
                    <div className="text-center">
                      <div className="relative w-32 h-32 mx-auto mb-4 rounded-2xl overflow-hidden shadow-lg">
                        <Image src="/images/sayur-hijau.png" alt="Sayur Hijau" fill className="object-cover" />
                      </div>
                      <p className="text-sm text-[#4a5c2f] leading-relaxed">
                        Tingkat kematangan ayam sempurna dan cabe ijonya sangat lezat 😋❤️
                      </p>
                    </div>

                    {/* Tempe */}
                    <div className="text-center">
                      <div className="relative w-32 h-32 mx-auto mb-4 rounded-2xl overflow-hidden shadow-lg">
                        <Image src="/images/tempe-goreng.png" alt="Tempe Goreng" fill className="object-cover" />
                      </div>
                      <p className="text-sm text-[#4a5c2f] leading-relaxed">
                        Benar-benar nikmat!! tempenya seperti dimasak oleh Gordon Ramsey 🤩🤩
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button className="p-4 bg-[#FFA500] text-white rounded-full hover:bg-[#FF8C00] w-16 h-16 flex items-center justify-center ml-8 shadow-lg">
              <ChevronRight size={32} />
            </button>
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
            <button className="bg-[#7a8c4f] hover:bg-[#6a7c3e] text-white font-semibold text-lg px-6 py-3 rounded-lg shadow-md">
              Order Here
            </button>

            {/* Order Status - Only shown for logged in users with active orders */}
            {user && hasActiveOrder && <OrderStatus currentStatus={orderStatus} orderId={orderId} />}
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
              <a href="https://wa.me/0895639201682" target="_blank" rel="noopener noreferrer">
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
