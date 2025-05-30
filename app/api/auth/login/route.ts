import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

// Simple hash function for testing (same as signup)
async function simpleHash(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + "salt123")
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

export async function POST(request: NextRequest) {
  try {
    console.log("Login API called")

    const body = await request.json()
    console.log("Login request for email:", body.email)

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

    console.log("Creating Supabase client...")
    const supabase = createServerClient()

    console.log("Finding user by email...")
    // Find user by email
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email.toLowerCase().trim())
      .maybeSingle()

    if (error && error.code !== "PGRST116") {
      console.error("Database query error:", error)
      return NextResponse.json({ error: "Terjadi kesalahan saat mencari pengguna" }, { status: 500 })
    }

    if (!user) {
      console.log("User not found")
      return NextResponse.json({ error: "Email atau password salah" }, { status: 401 })
    }

    console.log("Verifying password...")
    // Verify password
    const passwordHash = await simpleHash(password)
    const isPasswordValid = passwordHash === user.password_hash

    if (!isPasswordValid) {
      console.log("Password verification failed")
      return NextResponse.json({ error: "Email atau password salah" }, { status: 401 })
    }

    console.log("Login successful for user:", user.email)
    // Return user data (without password)
    const { password_hash, ...userWithoutPassword } = user

    return NextResponse.json(
      {
        message: "Login berhasil",
        user: userWithoutPassword,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      {
        error: "Terjadi kesalahan server",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
