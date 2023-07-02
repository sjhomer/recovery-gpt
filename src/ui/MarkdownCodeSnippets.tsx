import {useToast} from "@/components/ui/use-toast"
import {useRef} from "react"
import {marked} from "marked"
import {useInterval} from "usehooks-ts"

interface RenderedMessage {
  author: string;
  text: string;
}

export const MarkdownCodeSnippets: React.FC<{ message: RenderedMessage }> = ({
  message,
}) => {
  const {toast} = useToast()
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

  useInterval(() => {
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
        copyButton.onclick = () => {
          navigator.clipboard.writeText(block.textContent ?? "")
          toast({
            title: "🧑🏻‍💻 Copied code snippet to clipboard!",
          })
        }
        copyButton.innerHTML = `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round"
         stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em"
         xmlns="http://www.w3.org/2000/svg">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
    </svg>`
        buttonContainer.appendChild(copyButton)

        preContainer.classList.add("relative", "copyableContainer")
        preContainer.insertBefore(buttonContainer, preContainer.firstChild)
      })
    }
  }, 10)

  return <div
    ref={ref}
    className="markdown prose w-full break-words dark:prose-invert light"
    dangerouslySetInnerHTML={{
      __html: html,
    }}
  />
}
