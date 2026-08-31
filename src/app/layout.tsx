import type { Metadata } from "next"
import { Varela } from "next/font/google"
import Script from "next/script"
import "@/shared/ui/globals.css"

const varelaSans = Varela({ weight: ["400"] })

export const metadata: Metadata = {
  title: "Go with me",
  description: "Your travel diary",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className={`${varelaSans.className} h-full antialiased`}>
      <body className="flex h-full flex-col">
        {children}
        <Script
          src={`https://api-maps.yandex.ru/v3/?apikey=${process.env.YANDEX_MAPS_API_KEY}&lang=ru_RU`}
          strategy="beforeInteractive"
        />
      </body>
    </html>
  )
}
