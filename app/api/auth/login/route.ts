import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validation
    if (!email || !password) {
      return NextResponse.json({ error: "Email dan password harus diisi" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Find user by email
    const { data: user, error } = await supabase.from("users").select("*").eq("email", email).maybeSingle()

    if (error) {
      console.error("Database query error:", error)
      return NextResponse.json({ error: "Terjadi kesalahan saat mencari pengguna" }, { status: 500 })
    }

    if (!user) {
      return NextResponse.json({ error: "Email atau password salah" }, { status: 401 })
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash)

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Email atau password salah" }, { status: 401 })
    }

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
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}
