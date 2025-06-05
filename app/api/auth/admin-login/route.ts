import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("Admin Login API called")

    const body = await request.json()
    console.log("Request body received:", { ...body, password: "[HIDDEN]" })

    const { email, password } = body

    // Validation
    if (!email || !password) {
      console.log("Validation failed: Missing fields")
      return NextResponse.json({ error: "Email dan password harus diisi" }, { status: 400 })
    }

    // For demo purposes, hardcode admin credentials
    // Accept both username and email for admin login
    if ((email === "admin" || email === "admin@yourdailymeal.com") && password === "admin123") {
      console.log("Admin login successful")
      return NextResponse.json({
        message: "Login berhasil!",
        admin: {
          id: "admin-1",
          name: "Administrator",
          email: "admin@yourdailymeal.com",
          role: "admin",
        },
      })
    }

    console.log("Invalid admin credentials")
    return NextResponse.json({ error: "Email atau password salah" }, { status: 401 })
  } catch (error) {
    console.error("Admin login error:", error)
    return NextResponse.json(
      {
        error: "Terjadi kesalahan server",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
