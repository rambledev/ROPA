import { apiClient } from "./client"

export const adminApi = {
  getDashboard: () =>
    apiClient.get("/admin/dashboard").then(r => r.data.data),

  getAllRopa: () =>
    apiClient.get("/admin/ropa").then(r => r.data.data),

  getRopaDetail: (id: string) =>
    apiClient.get(`/admin/ropa/${id}`).then(r => r.data.data),
}
