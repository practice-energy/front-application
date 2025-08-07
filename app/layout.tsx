import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/contexts/sidebar-context"
import { SidebarLayout } from "@/components/sidebar-layout"
import { Header } from "@/components/header/index"
import { useAuth } from "@/hooks/use-auth"
import { usePathname } from "next/navigation"
import { useIsMobile } from "@/hooks/use-mobile"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Practice App",
  description: "A practice application",
    generator: 'v0.dev'
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  const pathname = usePathname()
  const isMobile = useIsMobile()

  // Определяем нужно ли показывать header
  const shouldShowHeader = () => {
    // На мобильных устройствах не показываем header на странице календаря
    if (isMobile) {
        return false
    }

    if (pathname === "/" && !isAuthenticated) {
      return false
    }
    // На всех остальных страницах показываем header
    return true
  }

  const showHeader = shouldShowHeader()

  return (
    <>
      {showHeader && <Header />}
      <SidebarLayout>{children}</SidebarLayout>
    </>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <LayoutContent>{children}</LayoutContent>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
