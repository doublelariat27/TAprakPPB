"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Bell } from "lucide-react"

export function PushNotificationTester() {
  const [title, setTitle] = useState("Lomba Baru!")
  const [body, setBody] = useState("Cek lomba terbaru yang cocok untuk Anda")
  const [isLoading, setIsLoading] = useState(false)

  const sendTestNotification = async () => {
    if (!("serviceWorker" in navigator)) {
      alert("Service Worker tidak tersedia")
      return
    }

    setIsLoading(true)
    try {
      const registration = await navigator.serviceWorker.ready

      // Send notification via service worker
      if (registration.active) {
        registration.active.postMessage({
          type: "SEND_NOTIFICATION",
          data: {
            title: title || "LombaKu",
            body: body || "Notifikasi dari LombaKu",
          },
        })
      }

      // Also try using Notification API directly
      if (Notification.permission === "granted") {
        new Notification(title || "LombaKu", {
          body: body || "Notifikasi dari LombaKu",
          icon: "/icon-192.png",
          badge: "/icon-192.png",
          tag: "test-notification",
        })
      }
    } catch (error) {
      console.error("[v0] Notification error:", error)
      alert("Gagal mengirim notifikasi")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Test Notifikasi (Dev Only)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <label className="text-sm font-medium">Judul</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Judul notifikasi" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Pesan</label>
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Isi pesan notifikasi"
            rows={3}
          />
        </div>
        <Button onClick={sendTestNotification} disabled={isLoading} className="w-full" size="sm">
          {isLoading ? "Mengirim..." : "Kirim Notifikasi Test"}
        </Button>
      </CardContent>
    </Card>
  )
}
