'use client'

import { useEffect, useRef, useState } from 'react'

interface ReCaptchaProps {
  onTokenChange: (token: string | null) => void
  onVerified?: (verified: boolean) => void
}

export default function ReCaptcha({ onTokenChange, onVerified }: ReCaptchaProps) {
  const [loading, setLoading] = useState(false)
  const recaptchaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
    if (!siteKey) return

    const script = document.createElement('script')
    script.src = 'https://www.google.com/recaptcha/api.js'
    script.async = true
    script.defer = true
    document.head.appendChild(script)

    window.grecaptcha && grecaptcha.ready(() => {
      if (recaptchaRef.current) {
        grecaptcha.render(recaptchaRef.current, {
          sitekey: siteKey,
          callback: handleCallback,
          'expired-callback': handleExpired,
        })
      }
    })

    return () => {
      script.remove()
    }
  }, [])

  const handleCallback = async (token: string) => {
    setLoading(true)
    onTokenChange(token)

    try {
      const response = await fetch('/api/recaptcha/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()
      onVerified?.(data.success)
    } catch (error) {
      console.error('reCAPTCHA verification error:', error)
      onVerified?.(false)
    } finally {
      setLoading(false)
    }
  }

  const handleExpired = () => {
    onTokenChange(null)
    onVerified?.(false)
  }

  if (!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
    return null
  }

  return (
    <div ref={recaptchaRef} className="mb-6">
      {loading && <p className="text-xs text-gray-600 mt-2">Verificando...</p>}
    </div>
  )
}

declare global {
  interface Window {
    grecaptcha: any
  }
}
