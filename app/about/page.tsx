"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Navbar from "@/components/navbar"

export default function AboutPage() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* What Section */}
      <section
        className="py-16 px-6"
        style={{
          backgroundImage: `url('/images/leaf-pattern-new.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#f8f3e2",
        }}
      >
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Side - Text Content */}
            <div className="lg:w-2/3">
              <div className="bg-[#DDB04E] rounded-lg p-8 shadow-lg">
                <h3 className="text-3xl font-bold text-[#4a5c2f] bg-[#f8f4e3] inline-block px-4 py-2 rounded-md shadow-md mb-2">
                  What
                </h3>
                <p className="text-[#4a5c2f] text-lg leading-relaxed mb-4">
                  Kami adalah layanan catering sehat yang hadir untuk memenuhi kebutuhan makan harian Anda dengan
                  praktis dan bergizi. Dengan menu yang beragam dan cita rasa autentik Indonesia, kami berkomitmen untuk
                  menyajikan makanan berkualitas tinggi yang dibuat dari bahan-bahan segar pilihan.
                </p>
                <p className="text-[#4a5c2f] text-lg leading-relaxed">
                  Setiap hidangan disiapkan dengan standar kebersihan tinggi dan dikemas dengan ramah lingkungan. Kami
                  memahami bahwa waktu Anda berharga, oleh karena itu layanan kami dirancang untuk memberikan solusi
                  makan yang efisien tanpa mengorbankan kualitas dan kelezatan.
                </p>
              </div>
            </div>

            {/* Right Side - Logo */}
            <div className="lg:w-1/3 flex justify-center">
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <Image src="/images/logo.png" alt="Your Daily Meal" width={200} height={150} className="h-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Food Image Section */}
      <section className="bg-[#7a8c4f] py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Side - Food Image */}
            <div className="lg:w-1/2">
              <div className="relative w-full h-80 rounded-lg overflow-hidden shadow-lg">
                <Image src="/images/food-image.png" alt="Delicious Indonesian Food" fill className="object-cover" />
              </div>
            </div>

            {/* Right Side - Description */}
            <div className="lg:w-1/2">
              <p className="text-white text-lg leading-relaxed">
                Untuk pengalaman dan pelayanan terbaik, program cateri kami menyediakan berbagai pilihan menu
                tradisional Indonesia yang lezat dan bergizi. Setiap hidangan diolah dengan resep turun temurun yang
                telah disesuaikan dengan standar gizi modern, memastikan Anda mendapatkan nutrisi yang seimbang dalam
                setiap sajian.
              </p>
              <p className="text-white text-lg leading-relaxed mt-4">
                Kami bangga menyajikan cita rasa autentik yang mengingatkan Anda pada kehangatan rumah, dengan kualitas
                restoran dan kemudahan layanan modern yang dapat diandalkan setiap hari.
              </p>
            </div>
          </div>
        </div>
      </section>

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

      {/* Who Section */}
      <section className="bg-[#DDB04E] py-12">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* Gambar Kiri */}
            <div className="w-full lg:w-1/3 flex-shrink-0">
              <div className="rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/images/about-who.png"
                  alt="Founder"
                  width={400}
                  height={500}
                  className="w-full object-cover h-full"
                />
              </div>
            </div>

            {/* Konten Kanan */}
            <div className="w-full lg:w-2/3 space-y-8">
              {/* WHO */}
              <div>
                <h2 className="text-3xl font-bold text-[#4a5c2f] bg-[#f8f4e3] inline-block px-4 py-2 rounded-md shadow-md mb-2">
                  Who
                </h2>
                <p className="text-[#4a5c2f] text-base leading-relaxed">
                  Your Daily Meal dicetuskan oleh Fernanda Nessa pada tahun 2025. Ia adalah seorang wanita tulen yang
                  mandiri dan independen, dengan visi kuat untuk menghadirkan solusi makanan yang berkualitas dan
                  terjangkau bagi semua kalangan.
                </p>
              </div>

              {/* WHY */}
              <div>
                <h3 className="text-3xl font-bold text-[#4a5c2f] bg-[#f8f4e3] inline-block px-4 py-2 rounded-md shadow-md mb-2">
                  Why
                </h3>
                <p className="text-[#4a5c2f] text-base leading-relaxed">
                  Fernanda melihat tantangan nyata di tengah masyarakat modern: banyak orang yang ingin makan sehat,
                  namun terbentur oleh waktu, akses, atau harga. Dari sinilah ide Your Daily Meal lahir—sebuah layanan
                  catering berbasis pemesanan online yang tidak hanya menyajikan makanan lezat.
                </p>
              </div>

              {/* HOW */}
              <div>
                <h3 className="text-3xl font-bold text-[#4a5c2f] bg-[#f8f4e3] inline-block px-4 py-2 rounded-md shadow-md mb-2">
                  How
                </h3>
                <p className="text-[#4a5c2f] text-base leading-relaxed">
                  Fernanda membangun Your Daily Meal dari nol dengan kemandirian dan semangat wirausaha. Ia terlibat
                  langsung dalam kurasi menu, kualitas, dan layanan, menjadikan bisnis ini kontribusinya untuk gaya
                  hidup sehat yang terjangkau.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

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

      {/* Visi Misi Section */}
      <section className="bg-[#7a8c4f] py-16 px-6">
        <div className="w-full px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Visi */}
            <div className="bg-[#AC9362] justify-center items-center min-h-[300px] rounded-lg p-8 shadow-lg text-center">
              <h3 className="text-3xl font-bold text-[#4a5c2f] bg-[#f8f4e3] inline-block px-4 py-2 rounded-md shadow-md mb-4">
                Visi
              </h3>
              <p className="text-[#4a5c2f] text-lg leading-relaxed">
                Menjadi penyedia layanan catering terdepan di Indonesia yang mengutamakan kualitas, kesehatan, dan
                kepuasan pelanggan. Kami berkomitmen untuk menjadi bagian dari gaya hidup sehat masyarakat Indonesia
                melalui penyediaan makanan bergizi yang praktis dan terjangkau.
              </p>
            </div>

            {/* Misi */}
            <div className="bg-[#AC9362] flex flex-col justify-center items-center min-h-[300px] rounded-lg p-8 shadow-lg text-center">
              <h3 className="text-3xl font-bold text-[#4a5c2f] bg-[#f8f4e3] inline-block px-4 py-2 rounded-md shadow-md mb-4">
                Misi
              </h3>
              <ul className="text-[#4a5c2f] text-lg leading-relaxed space-y-3 text-left">
                <li>• Menyediakan makanan sehat bergizi dengan cita rasa autentik Indonesia</li>
                <li>• Menggunakan bahan-bahan segar dan berkualitas tinggi</li>
                <li>• Memberikan layanan pengantaran yang tepat waktu dan terpercaya</li>
                <li>• Menerapkan standar kebersihan dan keamanan pangan yang tinggi</li>
                <li>• Berinovasi secara berkelanjutan dalam menu dan layanan</li>
                <li>• Mendukung ekonomi lokal melalui kemitraan dengan petani dan supplier lokal</li>
                <li>• Mewujudkan gaya hidup sehat yang mudah diakses oleh semua kalangan</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

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
    </div>
  )
}
