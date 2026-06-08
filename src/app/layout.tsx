import type { Metadata } from 'next'
import { Sarabun } from 'next/font/google'
import './globals.css'

const sarabun = Sarabun({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sarabun',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ระบบ ROPA — มหาวิทยาลัยราชภัฏมหาสารคาม',
  description: 'บันทึกกิจกรรมการประมวลผลข้อมูลส่วนบุคคล (PDPA)',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className={sarabun.className} style={{ margin: 0, background: "#f5f5f5" }}>
        {children}
      </body>
    </html>
  )
}
