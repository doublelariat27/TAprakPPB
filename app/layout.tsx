import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/auth-context"
import { ServiceWorkerProvider } from "@/components/service-worker-provider"
import { NotificationManager } from "@/components/notification-manager"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LombaKu - Info Jadwal Lomba & Kompetisi",
  description:
    "Platform informasi jadwal lomba dan kompetisi terlengkap di Indonesia. Temukan hackathon, business case, olimpiade sains, dan berbagai kompetisi lainnya.",
  generator: "v0.app",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "LombaKu",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="LombaKu" />
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`font-sans antialiased`}>
        <ServiceWorkerProvider>
          <AuthProvider>
            <NotificationManager />
            <main className="min-h-screen pb-20">{children}</main>
          </AuthProvider>
        </ServiceWorkerProvider>
        <Analytics />
      </body>
    </html>
  )
}
