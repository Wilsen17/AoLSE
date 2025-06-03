import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

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
    console.log("Admin Forgot Password API called")

    const body = await request.json()
    console.log("Admin forgot password request for email:", body.email)

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

    console.log("Finding admin by email...")
    // Find admin by email in admins table
    const { data: admin, error } = await supabase
      .from("admins")
      .select("*")
      .eq("email", email.toLowerCase().trim())
      .maybeSingle()

    if (error && error.code !== "PGRST116") {
      console.error("Database query error:", error)
      return NextResponse.json({ error: "Terjadi kesalahan saat mencari admin" }, { status: 500 })
    }

    if (!admin) {
      console.log("Admin not found")
      return NextResponse.json({ error: "Email admin tidak ditemukan" }, { status: 404 })
    }

    // Generate temporary password
    const tempPassword = generateTempPassword()

    console.log("Updating admin with temporary password...")
    // Update admin with temporary password (store as plain text in admins table)
    const { error: updateError } = await supabase
      .from("admins")
      .update({
        password: tempPassword,
        created_at: new Date().toISOString(),
      })
      .eq("id", admin.id)

    if (updateError) {
      console.error("Error updating admin password:", updateError)
      return NextResponse.json({ error: "Gagal mengupdate password admin" }, { status: 500 })
    }

    // In a real application, you would send an email here
    // For now, we'll just log the temporary password
    console.log(`Temporary password for admin ${email}: ${tempPassword}`)

    // Simulate email sending (in real app, use email service like SendGrid, Nodemailer, etc.)
    console.log("Sending admin email notification...")

    return NextResponse.json(
      {
        message: "Password sementara admin telah dikirim ke email Anda",
        // In development, you might want to include the temp password for testing
        // Remove this in production!
        tempPassword: tempPassword,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Admin forgot password error:", error)
    return NextResponse.json(
      {
        error: "Terjadi kesalahan server",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
