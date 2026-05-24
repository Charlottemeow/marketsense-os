import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { cn } from "@/lib/utils"
import { LanguageProvider } from "@/lib/i18n/context"
import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "Marketsense OS",
  description: "Research operating system for macro-minded investors",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={cn(inter.variable, "font-sans antialiased")}>
        <LanguageProvider>
          <Sidebar />
          <div className="pl-56 min-h-screen flex flex-col">
            <Topbar />
            <main className="flex-1 p-6">{children}</main>
          </div>
        </LanguageProvider>
      </body>
    </html>
  )
}
