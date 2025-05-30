"use client"
import Image from "next/image"

interface OrderStatusProps {
  currentStatus: "placed" | "cooking" | "delivery" | "completed"
  orderDate?: string
  orderId: string
}

export default function OrderStatus({ currentStatus, orderDate, orderId }: OrderStatusProps) {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-[#4a3f2d] mb-6">On-going Order Status — Order #{orderId}</h3>

      <div className="flex items-start justify-between relative">
        {/* Progress Line */}
        <div className="absolute left-0 right-0 h-1 bg-[#4a3f2d]/30 top-6 z-0"></div>

        {/* Active Progress Line */}
        <div
          className={`absolute left-0 h-1 bg-[#7a8c4f] top-6 z-0 transition-all duration-500 ${
            currentStatus === "placed"
              ? "w-0"
              : currentStatus === "cooking"
                ? "w-1/2"
                : currentStatus === "delivery"
                  ? "w-full"
                  : "w-full"
          }`}
        ></div>

        {/* Order Placed */}
        <div className="flex flex-col items-center relative z-10">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
              currentStatus === "placed" ||
              currentStatus === "cooking" ||
              currentStatus === "delivery" ||
              currentStatus === "completed"
                ? "bg-[#7a8c4f]"
                : "bg-[#AC9362] border-2 border-[#4a3f2d]"
            }`}
          >
            <Image
              src="/images/check-icon.png"
              alt="Order Placed"
              width={24}
              height={24}
              className="filter brightness-0 invert"
            />
          </div>
          <span className="text-sm font-medium text-[#4a3f2d] text-center leading-tight">
            Order
            <br />
            Placed
          </span>
        </div>

        {/* Cooking */}
        <div className="flex flex-col items-center relative z-10">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
              currentStatus === "cooking"
                ? "bg-[#FFD700]"
                : currentStatus === "delivery" || currentStatus === "completed"
                  ? "bg-[#7a8c4f]"
                  : "bg-[#AC9362] border-2 border-[#4a3f2d]"
            }`}
          >
            {currentStatus === "cooking" ? (
              <Image
                src="/images/cooking-icon.png"
                alt="Cooking"
                width={24}
                height={24}
                className="filter brightness-0"
              />
            ) : currentStatus === "delivery" || currentStatus === "completed" ? (
              <Image
                src="/images/check-icon.png"
                alt="Cooking Complete"
                width={24}
                height={24}
                className="filter brightness-0 invert"
              />
            ) : (
              <Image
                src="/images/cooking-icon.png"
                alt="Cooking"
                width={24}
                height={24}
                className="filter brightness-0 opacity-50"
              />
            )}
          </div>
          <span className="text-sm font-medium text-[#4a3f2d] text-center">Cooking</span>
        </div>

        {/* Delivery */}
        <div className="flex flex-col items-center relative z-10">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
              currentStatus === "delivery"
                ? "bg-[#FFD700]"
                : currentStatus === "completed"
                  ? "bg-[#7a8c4f]"
                  : "bg-[#AC9362] border-2 border-[#4a3f2d]"
            }`}
          >
            {currentStatus === "delivery" ? (
              <Image
                src="/images/delivery-icon.png"
                alt="Delivery"
                width={24}
                height={24}
                className="filter brightness-0"
              />
            ) : currentStatus === "completed" ? (
              <Image
                src="/images/check-icon.png"
                alt="Delivery Complete"
                width={24}
                height={24}
                className="filter brightness-0 invert"
              />
            ) : (
              <Image
                src="/images/delivery-icon.png"
                alt="Delivery"
                width={24}
                height={24}
                className="filter brightness-0 opacity-50"
              />
            )}
          </div>
          <span className="text-sm font-medium text-[#4a3f2d] text-center">Delivery</span>
        </div>
      </div>
    </div>
  )
}
