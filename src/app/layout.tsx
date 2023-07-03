import "./globals.css"
import "highlight.js/styles/vs2015.css"
import {Inter} from "next/font/google"

const inter = Inter({subsets: ["latin"]})

export const metadata = {
  title: "Recovery GTP",
  description: "Restore your exported GTP conversations privately, and in style!",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
    <body className={`${inter.className}`}>
    {children}
    </body>
    </html>
  )
}
