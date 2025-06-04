import { type NextRequest, NextResponse } from "next/server"
import { ServerStorage } from "@/lib/storage-manager"

export async function GET(request: NextRequest) {
  try {
    // Get all users from server storage
    const users = ServerStorage.getAllUsers()

    // Return users without password hashes
    const usersResponse = users.map(({ password_hash, ...user }) => user)

    return NextResponse.json({
      users: usersResponse,
      total: usersResponse.length,
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat mengambil data pengguna" }, { status: 500 })
  }
}
