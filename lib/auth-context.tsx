"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getSupabaseClient, hashPassword, type User } from "./supabase"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateUserName: (name: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem("lombaku_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const supabase = getSupabaseClient()
      const hashedPassword = await hashPassword(password)

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email.toLowerCase())
        .eq("password_hash", hashedPassword)
        .single()

      if (error || !data) {
        return { success: false, error: "Email atau password salah" }
      }

      const userData: User = {
        id: data.id,
        email: data.email,
        name: data.name,
        avatar_url: data.avatar_url,
        created_at: data.created_at,
      }

      setUser(userData)
      localStorage.setItem("lombaku_user", JSON.stringify(userData))
      return { success: true }
    } catch {
      return { success: false, error: "Terjadi kesalahan. Silakan coba lagi." }
    }
  }

  const register = async (email: string, password: string, name: string) => {
    try {
      const supabase = getSupabaseClient()
      const hashedPassword = await hashPassword(password)

      // Check if email already exists
      const { data: existing } = await supabase.from("users").select("id").eq("email", email.toLowerCase()).single()

      if (existing) {
        return { success: false, error: "Email sudah terdaftar" }
      }

      const { data, error } = await supabase
        .from("users")
        .insert([
          {
            email: email.toLowerCase(),
            password_hash: hashedPassword,
            name,
          },
        ])
        .select()
        .single()

      if (error) {
        return { success: false, error: "Gagal mendaftar. Silakan coba lagi." }
      }

      const userData: User = {
        id: data.id,
        email: data.email,
        name: data.name,
        avatar_url: data.avatar_url,
        created_at: data.created_at,
      }

      setUser(userData)
      localStorage.setItem("lombaku_user", JSON.stringify(userData))
      return { success: true }
    } catch {
      return { success: false, error: "Terjadi kesalahan. Silakan coba lagi." }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("lombaku_user")
  }

  const updateUserName = (name: string) => {
    if (user) {
      const updatedUser = { ...user, name }
      setUser(updatedUser)
      localStorage.setItem("lombaku_user", JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUserName }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
