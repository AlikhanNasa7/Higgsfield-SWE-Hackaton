'use client'

import { HeroCinematic } from '@/components/sections/HeroCinematic'
import { CapabilitiesGrid } from '@/components/sections/CapabilitiesGrid'
import { Steps } from '@/components/sections/Steps'
import { GalleryGrid } from '@/components/sections/GalleryGrid'
import { CTASection } from '@/components/sections/CTASection'

export default function LandingPage() {
  return (
    <>
      <HeroCinematic />
      <CapabilitiesGrid />
      <Steps />
      <GalleryGrid />
      <CTASection />
    </>
  )
}
