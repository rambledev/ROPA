"use client"
import { useState } from "react"
import { G, type SectionProps } from "./shared"

export default function Section13({ data, onSave, onPrev, onSubmit }: SectionProps) {
  const [maker, setMaker] = useState({
    name: data.makerName as string ?? "",
    position: data.makerPosition as string ?? "",
    date: data.makerDate as string ?? ""
  })
  const [supervisor, setSupervisor] = useState({
    name: data.supervisorName as string ?? "",
    position: data.supervisorPosition as string ?? "",
    date: data.supervisorDate as string ?? ""
  })
  const [dpo, setDpo] = useState({
    name: data.dpoName as string ?? "",
    date: data.dpoDate as string ?? ""
  })
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!maker.name.trim())      e.makerName      = "กรุณาระบุชื่อ-สกุลผู้จัดทำ"
    if (!maker.position.trim())  e.makerPosition  = "กรุณาระบุตำแหน่งผู้จัดทำ"
    if (!maker.date)             e.makerDate      = "กรุณาระบุวันที่"
    if (!supervisor.name.trim()) e.supervisorName = "กรุณาระบุชื่อ-สกุลผู้บังคับบัญชา"
    if (!supervisor.date)        e.supervisorDate = "กรุณาระบุวันที่"
    if (!dpo.name.trim())        e.dpoName        = "กรุณาระบุชื่อ-สกุล DPO"
    if (!dpo.date)               e.dpoDate        = "กรุณาระบุวันที่"
    if (!consent)                e.consent        = "กรุณายืนยันการรับรองข้อมูล"
    return e
  }

  const handleSubmit = () => {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    const submitData = {
      makerName: maker.name, makerPosition: maker.position, makerDate: maker.date,
      supervisorName: supervisor.name, supervisorPosition: supervisor.position, supervisorDate: supervisor.date,
      dpoName: dpo.name, dpoDate: dpo.date
    }
    onSave(submitData)
    onSubmit?.()
  }

  const Err = ({ field }: { field: string }) =>
    errors[field] ? <div style={{ fontSize: 12, color: "#e53935", marginTop: 4 }}>{errors[field]}</div> : null

  const inp = (field: string) => ({
    ...G.input, border: errors[field] ? "1px solid #e53935" : G.input.border
  })

  const Box = ({
    title, vals, fields, onChange, prefix
  }: {
    title: string
    vals: Record<string, string>
    fields: { k: string; l: string; t?: string; required?: boolean }[]
    onChange: (k: string, v: string) => void
    prefix: string
  }) => (
    <div style={{ border: "0.5px solid #e0e0e0", borderRadius: 8, padding: "1rem", flex: 1, minWidth: 200 }}>
      <div style={{ fontSize: 14, fontWeight: 500, color: "#2e7d32", marginBottom: 12, textAlign: "center" }}>{title}</div>
      {fields.map(f => (
        <div key={f.k} style={{ marginBottom: 8 }}>
          <label style={{ ...G.label, fontSize: 12 }}>
            {f.l} {f.required && <span style={{ color: "#e53935" }}>*</span>}
          </label>
          <input
            style={inp(prefix + f.k.charAt(0).toUpperCase() + f.k.slice(1))}
            type={f.t ?? "text"}
            value={vals[f.k] ?? ""}
            onChange={e => { onChange(f.k, e.target.value); setErrors(p => ({ ...p, [prefix + f.k.charAt(0).toUpperCase() + f.k.slice(1)]: "" })) }}
          />
          <Err field={prefix + f.k.charAt(0).toUpperCase() + f.k.slice(1)} />
        </div>
      ))}
    </div>
  )

  return (
    <div>
      <div style={G.title}>ส่วนที่ 13 การรับรองข้อมูล</div>
      <div style={{ display: "flex", gap: 12, marginBottom: "1rem", flexWrap: "wrap" }}>
        <Box title="ผู้จัดทำ" vals={maker} prefix="maker"
          fields={[
            { k: "name",     l: "ชื่อ-สกุล", required: true },
            { k: "position", l: "ตำแหน่ง",   required: true },
            { k: "date",     l: "วันที่",     t: "date", required: true }
          ]}
          onChange={(k, v) => setMaker(p => ({ ...p, [k]: v }))}
        />
        <Box title="ผู้บังคับบัญชาหน่วยงาน" vals={supervisor} prefix="supervisor"
          fields={[
            { k: "name",     l: "ชื่อ-สกุล", required: true },
            { k: "position", l: "ตำแหน่ง" ,required: true },
            { k: "date",     l: "วันที่",     t: "date", required: true }
          ]}
          onChange={(k, v) => setSupervisor(p => ({ ...p, [k]: v }))}
        />
        <Box title="เจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคล (DPO)" vals={dpo} prefix="dpo"
          fields={[
            { k: "name", l: "ชื่อ-สกุล", required: true },
            { k: "date", l: "วันที่",     t: "date", required: true }
          ]}
          onChange={(k, v) => setDpo(p => ({ ...p, [k]: v }))}
        />
      </div>

      <div style={{ background: "#f9fafb", border: errors.consent ? "1px solid #e53935" : "0.5px solid #e0e0e0", borderRadius: 8, padding: "1rem", marginBottom: "1rem" }}>
        <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", fontSize: 14 }}>
          <input type="checkbox" checked={consent}
            onChange={e => { setConsent(e.target.checked); if (errors.consent) setErrors(p => ({ ...p, consent: "" })) }}
            style={{ width: 16, height: 16, marginTop: 2, accentColor: "#2e7d32", flexShrink: 0 }} />
          <span>
            <span style={{ color: "#e53935" }}>* </span>
            ข้าพเจ้าขอรับรองว่าข้อมูลที่กรอกในแบบฟอร์มนี้ถูกต้องและครบถ้วน และยินยอมให้มหาวิทยาลัยราชภัฏมหาสารคามเก็บรักษาข้อมูลดังกล่าวตามนโยบาย PDPA
          </span>
        </label>
        {errors.consent && <div style={{ fontSize: 12, color: "#e53935", marginTop: 6 }}>{errors.consent}</div>}
      </div>

      <div style={G.btnRow}>
        <button style={G.btnOutline} onClick={onPrev}>← ก่อนหน้า</button>
        <button style={G.btnPrimary} onClick={handleSubmit}>ส่งแบบฟอร์ม ✓</button>
      </div>
    </div>
  )
}
