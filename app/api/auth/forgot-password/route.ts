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

// Generate random temporary password
function generateTempPassword(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export async function POST(request: NextRequest) {
  try {
    console.log("Forgot Password API called")

    const body = await request.json()
    console.log("Forgot password request for email:", body.email)

    const { email } = body

    // Validation
    if (!email) {
      console.log("Validation failed: Missing email")
      return NextResponse.json({ error: "Email harus diisi" }, { status: 400 })
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
      return NextResponse.json({ error: "Email tidak ditemukan" }, { status: 404 })
    }

    // Generate temporary password
    const tempPassword = generateTempPassword()
    const tempPasswordHash = await simpleHash(tempPassword)

    console.log("Updating user with temporary password...")
    // Update user with temporary password
    const { error: updateError } = await supabase
      .from("users")
      .update({
        password_hash: tempPasswordHash,
        temp_password: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (updateError) {
      console.error("Error updating password:", updateError)
      return NextResponse.json({ error: "Gagal mengupdate password" }, { status: 500 })
    }

    // In a real application, you would send an email here
    // For now, we'll just log the temporary password
    console.log(`Temporary password for ${email}: ${tempPassword}`)

    // Simulate email sending (in real app, use email service like SendGrid, Nodemailer, etc.)
    console.log("Sending email notification...")

    return NextResponse.json(
      {
        message: "Password sementara telah dikirim ke email Anda",
        // In development, you might want to include the temp password for testing
        // Remove this in production!
        tempPassword: tempPassword,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json(
      {
        error: "Terjadi kesalahan server",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
