"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaymentProofModalProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
}

export default function PaymentProofModal({ isOpen, onClose, imageUrl }: PaymentProofModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 max-w-3xl w-full max-h-[90vh] relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#4a5c2f]">Bukti Pembayaran</h2>
          <Button onClick={onClose} variant="ghost" className="p-1 h-auto rounded-full hover:bg-gray-200">
            <X size={24} />
          </Button>
        </div>

        <div className="overflow-auto max-h-[calc(90vh-80px)]">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt="Payment Proof"
            className="w-full h-auto object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.svg?height=400&width=400"
            }}
          />
        </div>
      </div>
    </div>
  )
}
