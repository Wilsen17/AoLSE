import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, email, phone, address, password } = body

    // Validation
    if (!username || !email || !phone || !address || !password) {
      return NextResponse.json({ error: "Semua field harus diisi" }, { status: 400 })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Format email tidak valid" }, { status: 400 })
    }

    // Get existing users
    const users = JSON.parse(process.env.YDM_USERS || "[]")

    // Check if email already exists
    const existingUser = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase())
    if (existingUser) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 })
    }

    // Create new user
    const newUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      username,
      email: email.toLowerCase(),
      phone,
      address,
      password, // Store password directly for deployment compatibility
      created_at: new Date().toISOString(),
    }

    // Add to users array
    users.push(newUser)

    // In a real deployment, you'd save to database
    // For now, we'll rely on client-side storage

    return NextResponse.json({
      message: "Pendaftaran berhasil!",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        phone: newUser.phone,
        address: newUser.address,
      },
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}
