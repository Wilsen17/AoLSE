// Simple user storage implementation that works in both client and server
export interface User {
  id: string
  username: string
  email: string
  phone: string
  address: string
  password_hash: string
  created_at: string
  updated_at?: string
}

// Simple hash function
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + "salt123")
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const newHash = await hashPassword(password)
  return newHash === hash
}

// In-memory storage (will reset on server restart, but works for demo)
let users: User[] = []
let admins: any[] = []

// Check if we're in browser environment
const isBrowser = typeof window !== "undefined"

// Initialize with admin only
export function initializeDemoData() {
  if (admins.length === 0) {
    admins = [
      {
        id: "admin-1",
        username: "admin",
        email: "admin@yourdailymeal.com",
        password_hash: "admin-hash", // password: admin123
        role: "admin",
        created_at: new Date().toISOString(),
      },
    ]
  }
}

export class UserStorage {
  constructor() {
    initializeDemoData()
  }

  async findUserByEmail(email: string): Promise<User | null> {
    // Try to get users from localStorage first (client-side only)
    this.loadUsersFromStorage()

    return users.find((user) => user.email.toLowerCase() === email.toLowerCase()) || null
  }

  async createUser(userData: Omit<User, "id" | "created_at">): Promise<User> {
    // Try to get users from localStorage first (client-side only)
    this.loadUsersFromStorage()

    const newUser: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...userData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    users.push(newUser)

    // Save to localStorage (client-side only)
    this.saveUsersToStorage()

    return newUser
  }

  async findAdminByUsername(username: string): Promise<any | null> {
    return admins.find((admin) => admin.username === username) || null
  }

  async getAllUsers(): Promise<User[]> {
    // Try to get users from localStorage first (client-side only)
    this.loadUsersFromStorage()

    return [...users]
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    // Try to get users from localStorage first (client-side only)
    this.loadUsersFromStorage()

    const index = users.findIndex((user) => user.id === id)
    if (index !== -1) {
      users[index] = {
        ...users[index],
        ...updates,
        updated_at: new Date().toISOString(),
      }

      // Save to localStorage (client-side only)
      this.saveUsersToStorage()

      return users[index]
    }
    return null
  }

  async deleteUser(id: string): Promise<boolean> {
    // Try to get users from localStorage first (client-side only)
    this.loadUsersFromStorage()

    const index = users.findIndex((user) => user.id === id)
    if (index !== -1) {
      const userToDelete = users[index]
      users.splice(index, 1)

      // Save to localStorage (client-side only)
      this.saveUsersToStorage()

      // Also remove user-specific data like orders
      if (isBrowser) {
        try {
          // Find and remove user's orders
          const userEmail = userToDelete?.email
          if (userEmail) {
            localStorage.removeItem(`orders_${userEmail}`)
          }
        } catch (error) {
          console.error("Error removing user data:", error)
        }
      }

      return true
    }
    return false
  }

  // Helper methods for localStorage persistence
  private loadUsersFromStorage() {
    if (isBrowser) {
      try {
        const storedUsers = localStorage.getItem("ydm_users")
        if (storedUsers) {
          const parsedUsers = JSON.parse(storedUsers)
          if (Array.isArray(parsedUsers)) {
            users = parsedUsers
          }
        }
      } catch (error) {
        console.error("Error loading users from localStorage:", error)
        // Don't initialize with demo data if localStorage fails
        users = []
      }
    }
  }

  private saveUsersToStorage() {
    if (isBrowser) {
      try {
        localStorage.setItem("ydm_users", JSON.stringify(users))
      } catch (error) {
        console.error("Error saving users to localStorage:", error)
      }
    }
  }
}

// Singleton instance
export const userStorage = new UserStorage()
