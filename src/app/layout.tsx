import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/src/hooks/use-auth"
import { SidebarProvider } from "@/src/contexts/sidebar-context"
import { SidebarLayout } from "@/src/components/sidebar-layout"

// Load Inter with all subsets needed
const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Practice Energy - Find Your Perfect Specialist",
  description: "Connect with experts in astrology, coaching, wellness, and more",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className={`font-sans bg-theme-light-bg text-neutral-900`}>
            <AuthProvider>
              <SidebarProvider>
                <SidebarLayout>{children}</SidebarLayout>
              </SidebarProvider>
            </AuthProvider>
      </body>
    </html>
  )
}
