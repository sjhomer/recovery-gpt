import "./globals.css"
import "highlight.js/styles/vs2015.css"
import {Inter} from "next/font/google"
import {Metadata} from "next"

const inter = Inter({subsets: ["latin"]})

export const metadata: Metadata = {
  title: "RecoveryGPT",
  description: "Restore your exported GPT conversations privately, and in style! Tired of the lacking user-friendly approach of default ChatGPT exports? RecoveryGPT empowers you to privately access your past conversations and review them seamlessly in a ChatGPT inspired UI.",
  applicationName: "RecoveryGPT",
  keywords: "ChatGPT, OpenAI, GPT, Conversations, Review, Privacy, User-Friendly, Secure, Offline, Code Snippets",
  authors: {
    name: "SJ Homer",
    url: "https://github.com/sjhomer/recovery-gpt",
  },
  creator: "SJ Homer",
  colorScheme: "dark",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
    <body className={`${inter.className} dark`}>
    {children}
    </body>
    </html>
  )
}
