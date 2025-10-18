'use client'

import { Container } from './Container'

export interface FooterProps {
  minimal?: boolean
}

export function Footer({ minimal = true }: FooterProps) {
  if (minimal) {
    return (
      <footer className="py-12 border-t border-border/50">
        <Container size="xl" pad="md">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted">
            <p>© 2024 Cinematic Design System. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-text transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-text transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-text transition-colors">
                Contact
              </a>
            </div>
          </div>
        </Container>
      </footer>
    )
  }

  return (
    <footer className="py-16 border-t border-border/50">
      <Container size="xl" pad="md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow-primary">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold text-text">Cinematic</span>
            </div>
            <p className="text-sm text-muted">
              A modern, cinematic design system for Next.js applications.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-text mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                <a href="#" className="hover:text-text transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-text transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-text transition-colors">
                  Documentation
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-text mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                <a href="#" className="hover:text-text transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-text transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-text transition-colors">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-text mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                <a href="#" className="hover:text-text transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-text transition-colors">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-text transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/50 text-center text-sm text-muted">
          © 2024 Cinematic Design System. All rights reserved.
        </div>
      </Container>
    </footer>
  )
}
