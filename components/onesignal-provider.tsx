'use client'

import { useEffect } from 'react'

const ONE_SIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID

export function OneSignalProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!ONE_SIGNAL_APP_ID) return
    if (typeof window === 'undefined') return

    // Avoid double-init
    if ((window as any).OneSignal) return

    const script = document.createElement('script')
    script.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js'
    script.defer = true
    script.onload = () => {
      try {
        ;(window as any).OneSignalDeferred = (window as any).OneSignalDeferred || []
        ;(window as any).OneSignalDeferred.push(function (OneSignal: any) {
          OneSignal.init({
            appId: ONE_SIGNAL_APP_ID,
            allowLocalhostAsSecureOrigin: process.env.NODE_ENV === 'development',
            notifyButton: {
              enable: false, // Custom trigger only
            },
            serviceWorkerParam: { scope: '/push/onesignal/' },
            serviceWorkerPath: 'push/onesignal/OneSignalSDKWorker.js',
          })
        })
      } catch {
        // OneSignal init failed
      }
    }
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  return <>{children}</>
}

export async function requestNotificationPermission() {
  if (typeof window === 'undefined') return false
  const OneSignal = (window as any).OneSignal
  if (!OneSignal) return false

  try {
    await OneSignal.Notifications.requestPermission()
    return OneSignal.Notifications.permission
  } catch {
    return false
  }
}

export async function sendNotificationTag(key: string, value: string) {
  if (typeof window === 'undefined') return
  const OneSignal = (window as any).OneSignal
  if (!OneSignal) return

  try {
    await OneSignal.User.addTag(key, value)
  } catch {
    // Tagging failed
  }
}
