"use client"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface ThankYouPopupProps {
  isOpen: boolean
  onClose: () => void
  orderId: string
}

export default function ThankYouPopup({ isOpen, onClose, orderId }: ThankYouPopupProps) {
  const router = useRouter()

  if (!isOpen) return null

  const handleSeeHistory = () => {
    onClose()
    router.push("/history")
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#AC9362] rounded-2xl p-8 max-w-md w-full mx-4 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#4a5c2f] hover:text-[#7a8c4f] transition-colors bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="text-center">
          {/* Thank You Image */}
          <div className="mb-6 flex justify-center">
            <div className="w-32 h-32 relative">
              <Image
                src="/images/thank-you-image.png"
                alt="Thank You"
                width={128}
                height={128}
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg?height=128&width=128"
                }}
              />
            </div>
          </div>

          {/* Thank You Message */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#4a5c2f] mb-2">Terima kasih atas pembeliannya.</h2>
            <p className="text-[#4a5c2f] text-lg">Pesanan anda akan langsung kami proses.</p>
            <p className="text-[#4a5c2f] text-sm mt-2 font-medium">Order ID: #{orderId}</p>
          </div>

          {/* See Transaction History Button */}
          <Button
            onClick={handleSeeHistory}
            className="bg-[#7a8c4f] hover:bg-[#5a6c3f] text-white font-bold px-8 py-3 rounded-lg text-lg"
          >
            See transaction history
          </Button>
        </div>
      </div>
    </div>
  )
}
