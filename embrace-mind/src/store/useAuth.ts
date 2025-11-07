import { create } from "zustand"
import { get as idbGet, set as idbSet, del as idbDel } from "idb-keyval"
import { decodeToken } from "@/lib/auth"
import type { Gender } from "@/lib/types"

interface AuthUser {
  id: string
  email: string
  name?: string
  gender?: Gender
}

interface AuthState {
  user: AuthUser | null
  accessToken: string | null
  refreshToken: string | null
  isLoading: boolean
  initialized: boolean

  setAuth: (accessToken: string, refreshToken?: string, name?: string) => Promise<void>
  logout: () => Promise<void>
  initialize: () => Promise<void>
  tryRefresh: () => Promise<boolean>
}

const API = import.meta.env.VITE_API_URL || "http://localhost:8000"

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: true,
  initialized: false,

  /** ✅ called after login/signup */
  setAuth: async (accessToken: string, refreshToken?: string, name?: string) => {
    await idbSet("access_token", accessToken)
    if (refreshToken) await idbSet("refresh_token", refreshToken)
    if (name) await idbSet("user_name", name)

    const decoded = decodeToken(accessToken)
    if (decoded) {
      const storedName = name || (await idbGet<string>("user_name")) || undefined
      set({
        user: {
          id: decoded.user_id,
          email: decoded.email,
          gender: decoded.gender,
          name: storedName,
        },
        accessToken,
        refreshToken: refreshToken || null,
        isLoading: false,
        initialized: true,
      })
    }
  },

  /** 🧹 logs out and clears IndexedDB */
  logout: async () => {
    await Promise.all([idbDel("access_token"), idbDel("refresh_token"), idbDel("user_name")])
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      initialized: true,
    })
    window.location.href = "/login"
  },

  /** 🔄 tries to refresh token if expired */
  tryRefresh: async () => {
    const refresh = await idbGet<string>("refresh_token")
    if (!refresh) return false

    try {
      const res = await fetch(`${API}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refresh }),
      })

      if (!res.ok) throw new Error("Refresh failed")
      const { access_token } = await res.json()
      await idbSet("access_token", access_token)
      const decoded = decodeToken(access_token)
      if (!decoded) throw new Error("Invalid new token")

      set({
        accessToken: access_token,
        user: {
          id: decoded.user_id,
          email: decoded.email,
          gender: decoded.gender,
          name: (await idbGet("user_name")) || undefined,
        },
      })
      return true
    } catch (err) {
      await get().logout()
      return false
    }
  },

  /** 🚀 restores session on load */
  initialize: async () => {
    const token = await idbGet<string>("access_token")
    const refresh = await idbGet<string>("refresh_token")
    const name = await idbGet<string>("user_name")

    if (token) {
      const decoded = decodeToken(token)
      const now = Date.now()
      const exp = decoded?.exp ? decoded.exp * 1000 : 0

      if (decoded && exp > now) {
        set({
          user: {
            id: decoded.user_id,
            email: decoded.email,
            gender: decoded.gender,
            name: name || undefined,
          },
          accessToken: token,
          refreshToken: refresh || null,
          isLoading: false,
          initialized: true,
        })
        return
      }

      // try refreshing if token expired
      const refreshed = await get().tryRefresh()
      if (refreshed) {
        set({ isLoading: false, initialized: true })
        return
      }
    }

    // if no valid tokens
    set({ isLoading: false, initialized: true })
  },
}))
