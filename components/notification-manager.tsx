"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"

export function NotificationManager() {
  const { user } = useAuth()
  const [isSubscribed, setIsSubscribed] = useState(false)

  useEffect(() => {
    // Check notification permission and subscription
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      return
    }

    checkNotificationSubscription()
  }, [])

  const checkNotificationSubscription = async () => {
    try {
      if (Notification.permission === "granted") {
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.getSubscription()
        setIsSubscribed(!!subscription)
      }
    } catch (error) {
      console.error("[v0] Notification check error:", error)
    }
  }

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      alert("Browser Anda tidak mendukung notifikasi")
      return
    }

    if (Notification.permission === "granted") {
      setIsSubscribed(true)
      return
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission()
      if (permission === "granted") {
        try {
          const registration = await navigator.serviceWorker.ready
          // Note: Untuk push notification real, Anda perlu VAPID key
          // Implementasi ini hanya untuk siap menerima notifikasi
          const subscription = await registration.pushManager.getSubscription()
          setIsSubscribed(!!subscription)
        } catch (error) {
          console.error("[v0] Push subscription error:", error)
        }
      }
    }
  }

  return (
    <div className="hidden">
      {/* Notification manager runs in background */}
      {!isSubscribed && user && requestNotificationPermission()}
    </div>
  )
}
