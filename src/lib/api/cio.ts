import { apiClient } from "./client"

export const cioApi = {
  getDashboard: () => apiClient.get("/cio/dashboard").then(r => r.data.data),
  getPending:   () => apiClient.get("/cio/ropa/pending").then(r => r.data.data),
  getAll: (status?: string) =>
    apiClient.get("/cio/ropa", { params: status ? { status } : {} }).then(r => r.data.data),
  getById: (id: string) => apiClient.get(`/cio/ropa/${id}`).then(r => r.data.data),
  review: (id: string, decision: "approved" | "rejected", comment?: string) =>
    apiClient.post(`/cio/ropa/${id}/review`, { decision, comment }).then(r => r.data),
}
