"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface PaymentPopupProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (paymentProof?: string) => void
  totalAmount: number
}

export default function PaymentPopup({ isOpen, onClose, onSubmit, totalAmount }: PaymentPopupProps) {
  const [paymentProof, setPaymentProof] = useState<string | null>(null)

  if (!isOpen) return null

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file")
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB")
        return
      }

      // Convert to base64 for storage
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPaymentProof(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = () => {
    if (!paymentProof) {
      alert("Silakan upload bukti pembayaran terlebih dahulu!")
      return
    }

    // Call onSubmit with the payment proof
    onSubmit(paymentProof)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#DDB04E] rounded-2xl p-8 max-w-lg w-full mx-4 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#4a5c2f] hover:text-[#7a8c4f] transition-colors"
        >
          <X size={24} />
        </button>

        {/* QR Code Section */}
        <div className="text-center mb-6">
          <div className="mb-4 inline-block">
            <Image
              src="/images/qr-payment.png"
              alt="QR Code for Payment"
              width={350}
              height={350}
              className="mx-auto"
              priority
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "/placeholder.svg?height=350&width=350"
                console.error("Failed to load QR code image")
              }}
            />
          </div>

          {/* Amount */}
          <h2 className="text-2xl font-bold text-[#4a5c2f] mb-2">Rp. {totalAmount.toLocaleString()}</h2>

          {/* Bank Details */}
          <div className="text-[#4a5c2f] font-medium mb-6">
            <p>BCA 1234567890</p>
            <p>FERNANDA NESSA</p>
          </div>

          {/* Upload Payment Proof */}
          <div className="mb-4">
            <label htmlFor="payment-proof" className="block mb-2">
              <Button
                type="button"
                className="bg-[#7a8c4f] hover:bg-[#5a6c3f] text-white font-bold px-6 py-3 rounded-lg cursor-pointer"
                onClick={() => document.getElementById("payment-proof")?.click()}
              >
                Upload Payment Proof
              </Button>
            </label>
            <input id="payment-proof" type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            {paymentProof && (
              <div className="mt-2 flex justify-center">
                <div className="p-2 bg-green-100 rounded-lg inline-block">
                  <p className="text-sm text-green-800 font-medium">✓ File uploaded</p>
                  <img
                    src={paymentProof || "/placeholder.svg"}
                    alt="Payment Preview"
                    className="mt-2 max-h-40 rounded"
                  />
                </div>
              </div>
            )}
            {!paymentProof && <p className="text-sm text-red-600 mt-2">* Bukti pembayaran wajib diupload</p>}
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!paymentProof}
            className={`px-8 py-3 rounded-lg text-lg font-bold ${
              paymentProof
                ? "bg-[#b3a278] hover:bg-[#a39068] text-[#4a5c2f]"
                : "bg-gray-400 text-gray-600 cursor-not-allowed"
            }`}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  )
}
