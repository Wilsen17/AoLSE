import { type NextRequest, NextResponse } from "next/server"
import { ServerStorage, hashPassword } from "@/lib/storage-manager"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, email, phone, address, password, confirmPassword } = body

    // Validation
    if (!username || !email || !phone || !address || !password || !confirmPassword) {
      return NextResponse.json({ error: "Semua field harus diisi" }, { status: 400 })
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Password dan konfirmasi password tidak cocok" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password minimal 6 karakter" }, { status: 400 })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Format email tidak valid" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = ServerStorage.findUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 })
    }

    // Hash password
    const password_hash = await hashPassword(password)

    // Create user
    const newUser = ServerStorage.createUser({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      address: address.trim(),
      password_hash,
    })

    // Return success response
    const { password_hash: _, ...userResponse } = newUser

    return NextResponse.json({
      message: "Pendaftaran berhasil! Silakan login.",
      user: userResponse,
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat mendaftar" }, { status: 500 })
  }
}
