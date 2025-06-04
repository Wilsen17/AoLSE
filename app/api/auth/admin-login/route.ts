import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    // Validation
    if (!username || !password) {
      return NextResponse.json({ error: "Username dan password harus diisi" }, { status: 400 })
    }

    // Hardcoded admin credentials for demo
    if (username === "admin" && password === "admin123") {
      return NextResponse.json({
        message: "Login berhasil",
        admin: {
          id: "admin-1",
          name: "Administrator",
          username: "admin",
          role: "admin",
        },
      })
    }

    return NextResponse.json({ error: "Username atau password salah" }, { status: 401 })
  } catch (error) {
    console.error("Admin login error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat login" }, { status: 500 })
  }
}
