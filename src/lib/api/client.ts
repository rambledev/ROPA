import axios from "axios"
import { getSession } from "next-auth/react"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
})

let cachedToken: string | null = null
let tokenExpiry: number = 0

apiClient.interceptors.request.use(async (config) => {
  const now = Date.now()
  
  if (!cachedToken || now > tokenExpiry) {
    const session = await getSession()
    if (session?.user?.email) {
      try {
        const res = await axios.post(`${API_URL}/auth/google`, {
          email:   session.user.email,
          name:    session.user.name ?? session.user.email,
          googleId: session.user.email,
          isAdmin: session.user.role === "admin",
        })
        cachedToken = res.data.data.accessToken
        tokenExpiry = now + 7 * 60 * 60 * 1000 // 7 hours
      } catch (err) {
        console.error("Backend sync failed:", err)
      }
    }
  }
  
  if (cachedToken) {
    config.headers.Authorization = `Bearer ${cachedToken}`
  }
  return config
})

apiClient.interceptors.response.use(
  res => res,
  async (error) => {
    if (error.response?.status === 401) {
      cachedToken = null
      tokenExpiry = 0
    }
    return Promise.reject(error)
  }
)
