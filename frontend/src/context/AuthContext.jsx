import { createContext, useContext, useEffect, useMemo, useState } from "react"
import api from "../services/api"
import { clearTokens, getTokens, setTokens } from "../services/tokenStorage"

const AuthContext = createContext(null)

const parseErrorMessage = (error) => {
  if (error?.response?.data?.detail) return error.response.data.detail
  if (error?.message) return error.message
  return "Unexpected error"
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const applyAuth = async (tokens) => {
    setTokens({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      csrfToken: tokens.csrf_token,
    })
    await fetchProfile()
  }

  const fetchProfile = async () => {
    try {
      const response = await api.get("/auth/me")
      setUser(response.data)
    } catch {
      clearTokens()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const { accessToken } = getTokens()
    if (!accessToken) {
      setLoading(false)
      return
    }
    fetchProfile()
  }, [])

  const login = async ({ email, password }) => {
    try {
      const response = await api.post("/auth/login", { email, password })
      await applyAuth(response.data)
      return { ok: true }
    } catch (error) {
      clearTokens()
      return { ok: false, message: parseErrorMessage(error) }
    }
  }

  const register = async ({ email, password, fullName }) => {
    try {
      const response = await api.post("/auth/register", {
        email,
        password,
        full_name: fullName || undefined,
      })
      await applyAuth(response.data)
      return { ok: true }
    } catch (error) {
      clearTokens()
      return { ok: false, message: parseErrorMessage(error) }
    }
  }

  const logout = () => {
    clearTokens()
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      fetchProfile,
    }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return ctx
}
