import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

// Simple hash function for testing (replace with bcrypt later)
async function simpleHash(password: string): Promise<string> {
  // For now, we'll use a simple hash - in production, use bcrypt
  const encoder = new TextEncoder()
  const data = encoder.encode(password + "salt123")
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const newHash = await simpleHash(password)
  return newHash === hash
}

export async function POST(request: NextRequest) {
  try {
    console.log("Signup API called")

    const body = await request.json()
    console.log("Request body received:", { ...body, password: "[HIDDEN]", confirmPassword: "[HIDDEN]" })

    const { username, email, phone, address, password, confirmPassword } = body

    // Validation
    if (!username || !email || !phone || !address || !password || !confirmPassword) {
      console.log("Validation failed: Missing fields")
      return NextResponse.json({ error: "Semua field harus diisi" }, { status: 400 })
    }

    if (password !== confirmPassword) {
      console.log("Validation failed: Password mismatch")
      return NextResponse.json({ error: "Password dan konfirmasi password tidak cocok" }, { status: 400 })
    }

    if (password.length < 6) {
      console.log("Validation failed: Password too short")
      return NextResponse.json({ error: "Password minimal 6 karakter" }, { status: 400 })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log("Validation failed: Invalid email format")
      return NextResponse.json({ error: "Format email tidak valid" }, { status: 400 })
    }

    console.log("Creating Supabase client...")
    const supabase = createServerClient()

    console.log("Checking for existing user...")
    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("email")
      .eq("email", email.toLowerCase().trim())
      .maybeSingle()

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking existing user:", checkError)
      return NextResponse.json({ error: "Terjadi kesalahan saat memeriksa email" }, { status: 500 })
    }

    if (existingUser) {
      console.log("User already exists")
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 })
    }

    console.log("Hashing password...")
    // Hash password
    const passwordHash = await simpleHash(password)

    console.log("Inserting new user...")
    // Insert new user
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert({
        username: username.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        address: address.trim(),
        password_hash: passwordHash,
      })
      .select("id, username, email")
      .single()

    if (insertError) {
      console.error("Database insert error:", insertError)
      return NextResponse.json({ error: `Gagal membuat akun: ${insertError.message}` }, { status: 500 })
    }

    console.log("User created successfully:", newUser)
    return NextResponse.json(
      {
        message: "Akun berhasil dibuat! Silakan login.",
        user: newUser,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      {
        error: "Terjadi kesalahan server",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
