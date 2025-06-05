import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validation
    if (!email || !password) {
      return NextResponse.json({ error: "Email dan password harus diisi" }, { status: 400 })
    }

    // Simple approach - check localStorage directly in the API
    // This works better for deployment
    const users = JSON.parse(process.env.YDM_USERS || "[]")

    // Find user by email
    const user = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase())

    if (!user) {
      return NextResponse.json({ error: "Email atau password salah" }, { status: 401 })
    }

    // Simple password check (for deployment compatibility)
    if (user.password !== password) {
      return NextResponse.json({ error: "Email atau password salah" }, { status: 401 })
    }

    return NextResponse.json({
      message: "Login berhasil!",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        address: user.address,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}
