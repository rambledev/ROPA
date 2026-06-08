import { apiClient } from './client'

export const ropaApi = {
  getAll: () => apiClient.get('/ropa').then(r => r.data.data),

  create: (data: { title: string; ownerPosition?: string; ownerPhone?: string; ownerEmail?: string }) =>
    apiClient.post('/ropa', data).then(r => r.data.data),

  getById: (id: string) =>
    apiClient.get(`/ropa/${id}`).then(r => r.data.data),

  saveSection: (id: string, sectionNumber: number, data: unknown) =>
    apiClient.put(`/ropa/${id}/sections/${sectionNumber}`, data).then(r => r.data),

  submit: (id: string) =>
    apiClient.post(`/ropa/${id}/submit`).then(r => r.data),
}
