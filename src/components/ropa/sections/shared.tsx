export type FormData = Record<string, unknown>

export const G = {
  label: { fontSize: 14, color: "#444", marginBottom: 6, display: "block", fontWeight: 500 } as React.CSSProperties,
  input: { width: "100%", padding: "9px 12px", border: "0.5px solid #e0e0e0", borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" } as React.CSSProperties,
  textarea: { width: "100%", padding: "9px 12px", border: "0.5px solid #e0e0e0", borderRadius: 8, fontSize: 14, outline: "none", resize: "vertical", minHeight: 80, boxSizing: "border-box", fontFamily: "inherit" } as React.CSSProperties,
  row: { marginBottom: "1rem" } as React.CSSProperties,
  title: { fontSize: 16, fontWeight: 600, color: "#2e7d32", marginBottom: "1.25rem", paddingBottom: 10, borderBottom: "2px solid #e8f5e9" } as React.CSSProperties,
  btnRow: { display: "flex", gap: 8, marginTop: "1.5rem", justifyContent: "space-between" } as React.CSSProperties,
  btnPrimary: { background: "#2e7d32", color: "#fff", border: "none", borderRadius: 8, padding: "9px 24px", fontSize: 14, cursor: "pointer", fontFamily: "inherit" } as React.CSSProperties,
  btnOutline: { background: "#fff", color: "#2e7d32", border: "1px solid #2e7d32", borderRadius: 8, padding: "9px 24px", fontSize: 14, cursor: "pointer", fontFamily: "inherit" } as React.CSSProperties,
  btnDanger: { background: "#e53935", color: "#fff", border: "none", borderRadius: 8, padding: "9px 24px", fontSize: 14, cursor: "pointer", fontFamily: "inherit" } as React.CSSProperties,
}

export type SectionProps = {
  data: FormData
  onSave: (data: FormData) => void
  onNext?: () => void
  onPrev?: () => void
  onSubmit?: () => void
}

export function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", cursor: "pointer", fontSize: 14 }}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)}
        style={{ width: 16, height: 16, accentColor: "#2e7d32", cursor: "pointer" }} />
      {label}
    </label>
  )
}
