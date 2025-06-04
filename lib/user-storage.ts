export interface User {
  id: string
  username: string
  email: string
  phone: string
  address: string
  password_hash: string
  created_at: string
  updated_at: string
}

class UserStorage {
  private storageKey = "catering_users"

  // Get all users from localStorage
  getAllUsers(): User[] {
    if (typeof window === "undefined") return []

    try {
      const stored = localStorage.getItem(this.storageKey)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error("Error loading users:", error)
      return []
    }
  }

  // Save users to localStorage
  saveUsers(users: User[]): void {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(users))
    } catch (error) {
      console.error("Error saving users:", error)
    }
  }

  // Find user by email
  findByEmail(email: string): User | null {
    const users = this.getAllUsers()
    return users.find((user) => user.email.toLowerCase() === email.toLowerCase()) || null
  }

  // Create new user
  createUser(userData: Omit<User, "id" | "created_at" | "updated_at">): User {
    const users = this.getAllUsers()
    const newUser: User = {
      ...userData,
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    users.push(newUser)
    this.saveUsers(users)
    return newUser
  }

  // Hash password (simple implementation for demo)
  async hashPassword(password: string): Promise<string> {
    // Simple hash for demo - in production use bcrypt or similar
    const encoder = new TextEncoder()
    const data = encoder.encode(password + "salt_demo_2024")
    const hashBuffer = await crypto.subtle.digest("SHA-256", data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  }

  // Verify password
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    const hashedInput = await this.hashPassword(password)
    return hashedInput === hash
  }

  // Initialize with demo data if empty
  initializeDemoData(): void {
    const users = this.getAllUsers()
    if (users.length === 0) {
      // Add some demo users
      this.createUser({
        username: "Demo User",
        email: "demo@example.com",
        phone: "081234567890",
        address: "Jl. Demo No. 123, Jakarta",
        password_hash: "demo_hash",
      })
    }
  }
}

export const userStorage = new UserStorage()
