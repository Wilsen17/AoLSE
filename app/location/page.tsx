"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"

export default function LocationPage() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleNavigation = () => {
    // Open Google Maps to BINUS UNIVERSITY - Anggrek Campus
    const googleMapsUrl = "https://www.google.com/maps/search/BINUS+UNIVERSITY+Anggrek+Campus"
    window.open(googleMapsUrl, "_blank")
  }

  const locations = [
    {
      id: 1,
      title: "Kemanggisan Raya",
      address: "Jl. Kemanggisan Raya No. 3H RT.6, RW.5 Kebon Jeruk",
      hours: "Senin - Minggu 09.00 - 21.00",
      image: "/images/location-building-1.png",
    },
    {
    id: 2,
    title: "Kebon Jeruk",
    address: "Jl. Arjuna Utara No. 578, RT.1, RW.2 Kebon Jeruk",
    hours: "Senin - Minggu 09.00 - 21.00",
    image: "/images/location-building-2.png",
    },
    {
      id: 3,
      title: "Duri Kepa",
      address: "Jl. Duri Kepa Raya No. 7A, RT.5, RW.4 Kebon Jeruk",
      hours: "Senin - Minggu 09.00 - 21.00",
      image: "/images/location-building-3.png",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Main Content */}
      <main
        className="flex-1 py-16 px-6 min-h-screen"
        style={{
          backgroundImage: `url('/images/floral-background.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#f8f3e2",
        }}
      >
        <div className="container mx-auto max-w-6xl">
          {/* Location Cards Container */}
          <div className="bg-[#7a8c4f] rounded-3xl p-8 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {locations.map((location, index) => (
                <div key={location.id} className="flex flex-col">
                  {/* Location Info */}
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-[#FFA500] mb-2">{location.title}</h2>
                    <p className="text-white text-sm mb-1">{location.address}</p>
                    <p className="text-white text-sm">{location.hours}</p>
                  </div>

                  {/* Building Image */}
                  <div className="flex-1 mb-6">
                    <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-lg">
                      <Image
                        src={location.image || "/placeholder.svg"}
                        alt={`Your Daily Meal Location ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Navigation Button */}
                  <div className="flex justify-center">
                    <Button
                      onClick={handleNavigation}
                      className="bg-[#5a6c3f] hover:bg-[#4a5c2f] text-[#FFA500] font-bold px-8 py-3 rounded-lg text-lg shadow-md transition-colors duration-200"
                    >
                      Navigasi
                    </Button>
                  </div>

                  {/* Divider line (except for last item) */}
                  {index < locations.length - 1 && (
                    <div
                      className="hidden md:block absolute right-0 top-0 bottom-0 w-px bg-white/30"
                      style={{ transform: "translateX(50%)" }}
                    />
                  )}
                </div>
              ))}
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
