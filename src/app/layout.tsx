import "./globals.css"
import "highlight.js/styles/vs2015.css"
import {Inter} from "next/font/google"
import {Metadata} from "next"

const inter = Inter({subsets: ["latin"]})

export const metadata: Metadata = {
  title: "RecoveryGPT",
  description: "Restore your exported GPT conversations privately, and in style!",
  applicationName: "RecoveryGPT",
  keywords: "ChatGPT, OpenAI, GPT, Conversations, Review, Privacy, User-Friendly, Secure, Offline, Code Snippets",
  authors: {
    name: "SJ Homer",
    url: "https://github.com/sjhomer/recovery-gpt",
  },
  creator: "SJ Homer",
  colorScheme: "dark",
  icons: "/ringbouy.svg",
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
