"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { apiClient } from "@/lib/api/client"
import RopaForm, { type FormData } from "@/components/ropa/RopaForm"

type Section = { sectionNumber: number; data: Record<string, unknown> }
type RopaDetail = {
  id: string; ropaId: string; title: string; status: string
  ownerPosition: string | null; ownerPhone: string | null; ownerEmail: string | null
  sections: Section[]
}

export default function EditRopaPage() {
  const params = useParams()
  const router = useRouter()
  const { status } = useSession()
  const [ropa, setRopa] = useState<RopaDetail | null>(null)
  const [initialData, setInitialData] = useState<Record<number, FormData> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login")
  }, [status, router])

  useEffect(() => {
    if (params.id && status === "authenticated") {
      apiClient.get(`/ropa/${params.id}`)
        .then(res => {
          const data: RopaDetail = res.data.data
          if (data.status !== "draft" && data.status !== "revision") {
            alert("ไม่สามารถแก้ไข ROPA ที่ส่งแล้วได้")
            router.push(`/ropa/${params.id}`)
            return
          }
          setRopa(data)
          const formData: Record<number, FormData> = {
            1: {
              title: data.title,
              ownerPosition: data.ownerPosition ?? "",
              ownerPhone: data.ownerPhone ?? "",
              ownerEmail: data.ownerEmail ?? "",
            }
          }
          data.sections.forEach(s => {
            formData[s.sectionNumber] = s.data
          })
          setInitialData(formData)
        })
        .catch(() => router.push("/"))
        .finally(() => setLoading(false))
    }
  }, [params.id, status, router])

  if (loading || status === "loading") return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#666" }}>กำลังโหลด...</div>
  )
  if (!ropa || !initialData) return null

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <header style={{ background: "#f57f17", color: "#fff", padding: "12px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => router.push(`/ropa/${params.id}`)}
          style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", borderRadius: 6, padding: "5px 12px", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
          ← กลับ
        </button>
        <div>
          <div style={{ fontSize: 15, fontWeight: 500 }}>แก้ไข ROPA — {ropa.ropaId}</div>
          <div style={{ fontSize: 11, opacity: .75 }}>มหาวิทยาลัยราชภัฏมหาสารคาม</div>
        </div>
      </header>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "1.5rem 1rem" }}>
        <div style={{ background: "#fff", borderRadius: 10, border: "0.5px solid #e0e0e0", padding: "1.5rem" }}>
          <RopaForm
            editMode
            ropaId={params.id as string}
            initialData={initialData}
            onSuccess={() => router.push(`/ropa/${params.id}`)}
          />
        </div>
      </div>
    </div>
  )
}
