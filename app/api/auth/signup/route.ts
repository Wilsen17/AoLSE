import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { username, email, phone, address, password, confirmPassword } = await request.json()

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

    const supabase = createServerClient()

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("email")
      .eq("email", email)
      .maybeSingle()

    if (checkError) {
      console.error("Error checking existing user:", checkError)
      return NextResponse.json({ error: "Terjadi kesalahan saat memeriksa email" }, { status: 500 })
    }

    if (existingUser) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 })
    }

    // Hash password
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // Insert new user
    const { error: insertError } = await supabase.from("users").insert({
      username,
      email,
      phone,
      address,
      password_hash: passwordHash,
    })

    if (insertError) {
      console.error("Database insert error:", insertError)
      return NextResponse.json(
        { error: `Gagal membuat akun: ${insertError.message || "Unknown error"}` },
        { status: 500 },
      )
    }

    // Get the created user
    const { data: newUser, error: fetchError } = await supabase
      .from("users")
      .select("id, username, email")
      .eq("email", email)
      .single()

    if (fetchError) {
      console.error("Error fetching new user:", fetchError)
      return NextResponse.json(
        {
          message: "Akun berhasil dibuat, tetapi gagal mengambil data pengguna",
          error: fetchError.message,
        },
        { status: 201 },
      )
    }

    return NextResponse.json(
      {
        message: "Akun berhasil dibuat",
        user: newUser,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}
