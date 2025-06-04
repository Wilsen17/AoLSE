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

// In-memory storage untuk server-side
let serverUsers: User[] = []

// Initialize dengan data demo
function initializeServerData() {
  if (serverUsers.length === 0) {
    serverUsers = [
      {
        id: "demo_user_1",
        username: "Demo User",
        email: "demo@example.com",
        phone: "081234567890",
        address: "Jl. Demo No. 123, Jakarta",
        password_hash: "demo_hash_123",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]
  }
}

// Hash password function
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + "salt_catering_2024")
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

// Server-side storage functions
export class ServerStorage {
  static getAllUsers(): User[] {
    initializeServerData()
    return [...serverUsers]
  }

  static findUserByEmail(email: string): User | null {
    initializeServerData()
    return serverUsers.find((user) => user.email.toLowerCase() === email.toLowerCase()) || null
  }

  static createUser(userData: Omit<User, "id" | "created_at" | "updated_at">): User {
    initializeServerData()
    const newUser: User = {
      ...userData,
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    serverUsers.push(newUser)
    return newUser
  }

  static updateUser(id: string, updates: Partial<User>): User | null {
    initializeServerData()
    const index = serverUsers.findIndex((user) => user.id === id)
    if (index !== -1) {
      serverUsers[index] = { ...serverUsers[index], ...updates, updated_at: new Date().toISOString() }
      return serverUsers[index]
    }
    return null
  }

  static deleteUser(id: string): boolean {
    initializeServerData()
    const index = serverUsers.findIndex((user) => user.id === id)
    if (index !== -1) {
      serverUsers.splice(index, 1)
      return true
    }
    return false
  }
}

// Client-side storage functions
export class ClientStorage {
  private static storageKey = "catering_users_client"

  static getAllUsers(): User[] {
    if (typeof window === "undefined") return []
    try {
      const stored = localStorage.getItem(this.storageKey)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  static saveUsers(users: User[]): void {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(users))
    } catch (error) {
      console.error("Error saving to localStorage:", error)
    }
  }

  static syncFromServer(users: User[]): void {
    this.saveUsers(users)
  }
}
