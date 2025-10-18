'use client'

import { TopNav } from '@/components/design/TopNav'
import { Footer } from '@/components/design/Footer'

export default function DesignLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNav sticky />
      <main>{children}</main>
      <Footer />
    </>
  )
}
