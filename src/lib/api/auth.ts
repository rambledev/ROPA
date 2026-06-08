import { apiClient } from "./client"

export const authApi = {
  login: async (email: string, password: string) => {
    const res = await apiClient.post("/auth/login", { email, password })
    return res.data.data
  },
  logout: async (refreshToken: string) => {
    await apiClient.post("/auth/logout", { refreshToken })
  },
}
