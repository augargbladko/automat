import { Header } from "@/components/Header"
import { PageSection } from "@/components/panels"
import { CookiesProvider } from "next-client-cookies/server"
import React from "react"
import "./globals.css"
import { Providers } from "./providers"

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000"

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Trade Analysis",
  description: "DEX trade analysis",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <CookiesProvider>
          <Providers>
            <div className="flex flex-col h-[100vh] w-[100vw] justify-start overflow-hidden">
              <Header />
              <PageSection>{children}</PageSection>
            </div>
          </Providers>
        </CookiesProvider>
      </body>
    </html>
  )
}
