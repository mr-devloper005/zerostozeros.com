'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

/*
  Scroll-triggered fade + rise for premium section entrances.

  - Hidden state is applied AFTER mount, so JS-off / SSR visitors still see
    content immediately.
  - Uses IntersectionObserver; once revealed, the observer disconnects.
  - `index` drives a small per-item stagger via inline transitionDelay.
  - Respects `prefers-reduced-motion` (handled inside editable-global.css).
*/

type Props = {
  children: ReactNode
  /** Stagger index — larger indexes wait proportionally longer to reveal. */
  index?: number
  /** Delay-per-index in ms (default 70ms). */
  step?: number
  /** Root-margin adjustment for the observer. */
  rootMargin?: string
  /** Optional className merged with the reveal wrapper. */
  className?: string
  /** Render as a specific tag (default div). */
  as?: 'div' | 'section' | 'li' | 'article' | 'header' | 'span'
  style?: CSSProperties
}

export function EditableReveal({
  children,
  index = 0,
  step = 70,
  rootMargin = '0px 0px -8% 0px',
  className = '',
  as = 'div',
  style,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const node = ref.current
    if (!node) return
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.disconnect()
          }
        })
      },
      { rootMargin, threshold: 0.05 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [mounted, rootMargin])

  const stateClass = !mounted ? '' : visible ? 'is-visible' : 'is-hidden'
  const Tag = as as unknown as 'div'
  const delay = Math.max(0, index) * step
  const mergedStyle: CSSProperties = { transitionDelay: `${delay}ms`, ...style }

  return (
    <Tag
      ref={ref as never}
      className={`editable-reveal ${stateClass} ${className}`.trim()}
      style={mergedStyle}
    >
      {children}
    </Tag>
  )
}
