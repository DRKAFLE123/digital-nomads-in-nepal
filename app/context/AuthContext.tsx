// app/context/AuthContext.tsx
"use client"

import { createContext, useContext, useEffect, useState } from "react"

export type Profile = {
  id: string
  name: string
  email: string
  avatarUrl?: string | null
  // you can add more fields if needed
}

type AuthContextType = {
  profile: Profile | null
  loading: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  profile: null,
  loading: true,
  logout: async () => {}
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchMe = async () => {
    try {
      const res = await fetch("/api/auth/me")
      if (res.ok) {
        const data = await res.json()
        setProfile(data)
      } else {
        setProfile(null)
      }
    } catch (e) {
      console.error("Error fetching auth/me", e)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    setProfile(null)
  }

  useEffect(() => {
    fetchMe()
  }, [])

  return (
    <AuthContext.Provider value={{ profile, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
