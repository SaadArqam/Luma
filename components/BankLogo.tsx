'use client'

import { useState } from 'react'
import { bankLogoUrl } from '@/lib/banks'
import { getCategoryColor } from '@/lib/category-colors'

/**
 * Bank logo with an initial-letter fallback.
 *
 * Never renders a broken-image icon: if there is no domain, no logo.dev token,
 * or the request fails, it swaps to a letter avatar tinted from the
 * chart-categorical palette (hashed off the account name, so a given account
 * keeps the same tone everywhere it appears).
 */
export function BankLogo({
  name,
  domain,
  size = 40,
}: {
  name: string
  domain?: string | null
  size?: number
}) {
  const [failed, setFailed] = useState(false)
  const url = bankLogoUrl(domain, size * 2)
  const initial = (name?.trim()?.[0] ?? '?').toUpperCase()

  if (url && !failed) {
    return (
      // Plain <img>, not next/image: these are 40px third-party logos. Routing
      // them through the image optimiser would need img.logo.dev in
      // next.config remotePatterns and add a proxy hop plus optimiser cost for
      // no visual gain at this size. Lazy-loaded so they never block the page.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt=""
        aria-hidden="true"
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className="shrink-0 rounded-[10px] object-contain"
        style={{
          width: size,
          height: size,
          // Logos arrive on white; a light plate keeps them legible on graphite
          // without punching a bright hole in the card.
          background: 'rgba(255,255,255,0.92)',
          padding: Math.round(size * 0.12),
        }}
      />
    )
  }

  return (
    <span
      aria-hidden="true"
      className="shrink-0 rounded-[10px] flex items-center justify-center font-fraunces font-semibold"
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.42),
        color: 'var(--luma-canvas)',
        backgroundColor: getCategoryColor(name || 'account'),
      }}
    >
      {initial}
    </span>
  )
}
