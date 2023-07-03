import {useLayoutEffect, useRef} from "react"
import {marked} from "marked"

interface RenderedMessage {
  author: string;
  text: string;
}

export const MarkdownCodeSnippets: React.FC<{ message: RenderedMessage }> = ({
  message,
}) => {
  const ref = useRef<HTMLDivElement>(null)
  let isUser = /user/i.test(message.author)

  const codeToPre = (str: string) => {
    // The regular expression to find code blocks.
    let regex = /```([\s\S]*?)```/g

    let newStr = str.replace(regex, function (match, p1) {
      return "<pre><code>" + p1 + "</code></pre>"
    })

    return newStr
  }

  let html = marked.parse(
    isUser ? codeToPre(message.text) : message.text
  )

  useLayoutEffect(() => {
    // For the ref, add an upload button to all 'pre code' blocks so the user can copy them
    if (ref.current) {
      const codeBlocks = ref.current.querySelectorAll("pre:not(.copyableContainer) code")
      codeBlocks.forEach((block) => {
        // Check if the parent 'pre' element has already been processed
        let preContainer = block.parentElement
        if (!preContainer) {
          return
        }
        // Instead of copying the message.text, here we want to copy the context of the code block
        const buttonContainer = document.createElement("div")
        buttonContainer.className =
          "text-gray-400 flex self-end lg:self-center justify-center gap-2 md:gap-3 lg:gap-1 absolute top-2 right-2 lg:pl-2 visible"
        const copyButton = document.createElement("button")
        copyButton.className =
          "flex ml-auto gap-2 rounded-md p-1 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400"
        copyButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect><path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"></path><path d="M16 4h2a2 2 0 0 1 2 2v4"></path><path d="M21 14H11"></path><path d="m15 10-4 4 4 4"></path></svg>`
        copyButton.onclick = () => {
          const originalIcon = copyButton.innerHTML
          const originalClass = copyButton.className
          navigator.clipboard.writeText(block.textContent ?? "").then(() => {
            copyButton.className =
              "flex ml-auto gap-2 rounded-md p-1  dark:text-gray-400 disabled:dark:hover:text-gray-400 cursor-default"
            copyButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`
            const tooltip = document.createElement("div")
            tooltip.className =
              "absolute bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-md text-xs top-7 right-0 w-40"
            tooltip.textContent = "Copied to clipboard"
            buttonContainer.appendChild(tooltip)

            setTimeout(() => {
              copyButton.innerHTML = originalIcon
              buttonContainer.removeChild(tooltip)
            }, 3000)
          })
        }
        buttonContainer.appendChild(copyButton)

        preContainer.classList.add("relative", "copyableContainer")
        preContainer.insertBefore(buttonContainer, preContainer.firstChild)
      })
    }
  }, [ref])

  return <div
    ref={ref}
    className="markdown prose w-full break-words dark:prose-invert light"
    dangerouslySetInnerHTML={{
      __html: html,
    }}
  />
}
