import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("Admin Login API called")

    const body = await request.json()
    console.log("Admin login request for email:", body.email)

    const { email, password } = body

    // Validation
    if (!email || !password) {
      console.log("Validation failed: Missing email or password")
      return NextResponse.json({ error: "Email dan password harus diisi" }, { status: 400 })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log("Validation failed: Invalid email format")
      return NextResponse.json({ error: "Format email tidak valid" }, { status: 400 })
    }

    // Default admin credentials
    const defaultAdmins = [
      {
        id: "admin-1",
        email: "admin@yourdailymeal.com",
        password: "admin123",
        name: "Admin YDM",
        role: "admin",
        created_at: new Date().toISOString(),
      },
    ]

    // Store default admins in localStorage if not exists
    if (!localStorage.getItem("admins")) {
      localStorage.setItem("admins", JSON.stringify(defaultAdmins))
    }

    // Get admins from localStorage
    const admins = JSON.parse(localStorage.getItem("admins") || JSON.stringify(defaultAdmins))

    // Find admin by email
    const admin = admins.find((a: any) => a.email.toLowerCase() === email.toLowerCase())

    if (!admin) {
      console.log("Admin not found")
      return NextResponse.json({ error: "Email atau password admin salah" }, { status: 401 })
    }

    // Verify password (direct comparison)
    const isPasswordValid = password === admin.password

    if (!isPasswordValid) {
      console.log("Admin password verification failed")
      return NextResponse.json({ error: "Email atau password admin salah" }, { status: 401 })
    }

    console.log("Admin login successful for:", admin.email)
    // Return admin data (without password)
    const { password: adminPassword, ...adminWithoutPassword } = admin

    return NextResponse.json(
      {
        message: "Login admin berhasil",
        admin: adminWithoutPassword,
      },
      { status: 200 },
    )
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
