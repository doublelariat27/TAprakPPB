"use client"

import type React from "react"
import { useEffect, useState } from "react"

export function ServiceWorkerProvider({ children }: { children: React.ReactNode }) {
  const [isInstalled, setIsInstalled] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    // Service workers work best in production deployments
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker
        .register("/api/sw", { scope: "/" })
        .then((registration) => {
          console.log("[v0] Service Worker registered successfully:", registration)
        })
        .catch((error) => {
          console.error("[v0] Service Worker registration failed:", error)
        })
    } else {
      console.log("[v0] Service Worker registration skipped (development/preview mode)")
    }

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true)
      setDeferredPrompt(null)
    })

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", () => {})
    }
  }, [])

  return <>{children}</>
}
