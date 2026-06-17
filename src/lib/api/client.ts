import axios from "axios"
import { getSession, signOut } from "next-auth/react"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
})

apiClient.interceptors.request.use(async (config) => {
  const session = await getSession()
  if (session?.user?.accessToken) {
    config.headers.Authorization = `Bearer ${session.user.accessToken}`
  }
  return config
})

apiClient.interceptors.response.use(
  res => res,
  async (error) => {
    if (error.response?.status === 401) {
      // token หมดอายุ — ให้ login ใหม่
      await signOut({ callbackUrl: "/login" })
    }
    return Promise.reject(error)
  }
)
