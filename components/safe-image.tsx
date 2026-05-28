"use client"

import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

type SafeImageProps = {
  src?: string
  fallbacks?: string[]
  alt: string
  className?: string
  imgClassName?: string
  fallbackContent?: ReactNode
}

export function SafeImage({
  src,
  fallbacks = [],
  alt,
  className = '',
  imgClassName = '',
  fallbackContent,
}: SafeImageProps) {
  const sources = useMemo(() => [src, ...fallbacks].filter(Boolean) as string[], [src, fallbacks])
  const [index, setIndex] = useState(0)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setIndex(0)
    setLoaded(false)
  }, [sources.join('|')])

  const current = sources[index]

  return (
    <span className={`relative block overflow-hidden ${className}`}>
      {!loaded && current ? <span className="absolute inset-0 animate-pulse bg-muted" /> : null}
      {current ? (
        <img
          src={current}
          alt={alt}
          className={`h-full w-full transition duration-500 ${loaded ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => {
            setLoaded(false)
            setIndex((value) => value + 1)
          }}
        />
      ) : (
        fallbackContent
      )}
      {!current && fallbackContent}
    </span>
  )
}
