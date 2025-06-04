import { type NextRequest, NextResponse } from "next/server"
import { ServerStorage, hashPassword } from "@/lib/storage-manager"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validation
    if (!email || !password) {
      return NextResponse.json({ error: "Email dan password harus diisi" }, { status: 400 })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Format email tidak valid" }, { status: 400 })
    }

    // Find user by email
    const user = ServerStorage.findUserByEmail(email)
    if (!user) {
      return NextResponse.json({ error: "Email atau password salah" }, { status: 401 })
    }

    // Verify password
    const hashedPassword = await hashPassword(password)
    if (hashedPassword !== user.password_hash) {
      return NextResponse.json({ error: "Email atau password salah" }, { status: 401 })
    }

    // Return user data (without password hash)
    const { password_hash: _, ...userResponse } = user

    return NextResponse.json({
      message: "Login berhasil",
      user: userResponse,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat login" }, { status: 500 })
  }
}
