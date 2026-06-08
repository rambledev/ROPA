"use client"
import { useState } from "react"
import { G, Checkbox, type SectionProps } from "./shared"

export default function Section1({ data, onSave, onNext }: SectionProps) {
  const [form, setForm] = useState({
    departmentName: data.departmentName as string ?? "",
    title:          data.title          as string ?? "",
    ropaId:         data.ropaId         as string ?? "",
    ownerName:      data.ownerName      as string ?? "",
    ownerPosition:  data.ownerPosition  as string ?? "",
    ownerPhone:     data.ownerPhone     as string ?? "",
    ownerEmail:     data.ownerEmail     as string ?? "",
    createdDate:    data.createdDate    as string ?? "",
    updatedDate:    data.updatedDate    as string ?? "",
  })
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))
  const handleNext = () => { onSave(form); onNext?.() }

  return (
    <div>
      <div style={G.title}>ส่วนที่ 1 ข้อมูลทั่วไป</div>
      <div style={G.row}>
        <label style={G.label}>ชื่อหน่วยงาน <span style={{color:"#e53935"}}>*</span></label>
        <input style={G.input} value={form.departmentName} onChange={e => set("departmentName", e.target.value)} placeholder="ระบุชื่อหน่วยงาน" />
      </div>
      <div style={G.row}>
        <label style={G.label}>ชื่อกิจกรรมการประมวลผลข้อมูลส่วนบุคคล <span style={{color:"#e53935"}}>*</span></label>
        <input style={G.input} value={form.title} onChange={e => set("title", e.target.value)} placeholder="ระบุชื่อกิจกรรม" />
      </div>
      <div style={G.row}>
        <label style={G.label}>รหัสกิจกรรม (ROPA ID)</label>
        <input style={{...G.input, background:"#f9f9f9", color:"#999"}} value={form.ropaId} placeholder="ระบบจะสร้างให้อัตโนมัติ" readOnly />
      </div>
      <div style={{...G.row, background:"#f9fafb", borderRadius:8, padding:"1rem", border:"0.5px solid #e0e0e0"}}>
        <div style={{fontSize:14, fontWeight:500, color:"#444", marginBottom:12}}>ผู้รับผิดชอบกิจกรรม (Process Owner)</div>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>
          <div>
            <label style={G.label}>ชื่อ-สกุล <span style={{color:"#e53935"}}>*</span></label>
            <input style={G.input} value={form.ownerName} onChange={e => set("ownerName", e.target.value)} placeholder="ชื่อ-นามสกุล" />
          </div>
          <div>
            <label style={G.label}>ตำแหน่ง</label>
            <input style={G.input} value={form.ownerPosition} onChange={e => set("ownerPosition", e.target.value)} placeholder="ตำแหน่งงาน" />
          </div>
          <div>
            <label style={G.label}>โทรศัพท์</label>
            <input style={G.input} value={form.ownerPhone} onChange={e => set("ownerPhone", e.target.value)} placeholder="0x-xxxx-xxxx" />
          </div>
          <div>
            <label style={G.label}>E-mail</label>
            <input style={G.input} type="email" value={form.ownerEmail} onChange={e => set("ownerEmail", e.target.value)} placeholder="email@rmu.ac.th" />
          </div>
        </div>
      </div>
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:"1rem"}}>
        <div>
          <label style={G.label}>วันที่จัดทำ</label>
          <input style={G.input} type="date" value={form.createdDate} onChange={e => set("createdDate", e.target.value)} />
        </div>
        <div>
          <label style={G.label}>วันที่ปรับปรุงล่าสุด</label>
          <input style={G.input} type="date" value={form.updatedDate} onChange={e => set("updatedDate", e.target.value)} />
        </div>
      </div>
      <div style={G.btnRow}>
        <div />
        <button style={G.btnPrimary} onClick={handleNext}>บันทึกและถัดไป →</button>
      </div>
    </div>
  )
}
