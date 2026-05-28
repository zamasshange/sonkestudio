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
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    setIndex(0)
    setLoaded(false)
    setRetryCount(0)
  }, [sources.join('|')])

  const current = sources[index]
  const hasMore = index < sources.length - 1
  const retryable = Boolean(current)

  return (
    <span className={`relative block overflow-hidden ${className}`}>
      {!loaded && current ? <span className="absolute inset-0 animate-pulse bg-muted" /> : null}
      {current ? (
        <img
          key={`${current}-${retryCount}`}
          src={current}
          alt={alt}
          className={`h-full w-full transition duration-500 ${loaded ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => {
            setLoaded(false)
            if (hasMore) {
              setIndex((value) => value + 1)
              setRetryCount(0)
              return
            }
            if (retryCount < 2) {
              window.setTimeout(() => setRetryCount((value) => value + 1), 250 * (retryCount + 1))
              return
            }
            setIndex(sources.length)
          }}
        />
      ) : (
        fallbackContent
      )}
      {retryable && !hasMore && retryCount > 0 && !loaded && fallbackContent ? (
        <span className="sr-only">Image retry in progress</span>
      ) : null}
    </span>
  )
}
