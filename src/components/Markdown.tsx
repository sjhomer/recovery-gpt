import {useRef} from "react"
import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import {CopyToClipboard} from "@/components/buttons/CopyToClipboard"
import {generateRandomString, programmingLanguages} from "@/lib"
import {DownloadIcon} from "lucide-react"

interface CodeProps {
  node: HTMLElement;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const components = {
  h1({children}: { children: React.ReactNode }) {
    return <h1 className="text-3xl">{children}</h1>
  },
  h2({children}: { children: React.ReactNode }) {
    return <h2 className="text-2xl">{children}</h2>
  },
  h3({children}: { children: React.ReactNode }) {
    return <h3 className="text-xl">{children}</h3>
  },
  h4({children}: { children: React.ReactNode }) {
    return <h4 className="text-lg">{children}</h4>
  },
  h5({children}: { children: React.ReactNode }) {
    return <h5 className="text-md">{children}</h5>
  },
  h6({children}: { children: React.ReactNode }) {
    return <h6 className="text-sm">{children}</h6>
  },
  ol({children}: { children: React.ReactNode }) {
    return <ol className="list-decimal list-inside m-0 leading-8 whitespace-normal">{children}</ol>
  },
  ul({children}: { children: React.ReactNode }) {
    return <ul className="list-disc list-outside pl-4 leading-8 whitespace-normal">{children}</ul>
  },
  p({children}: { children: React.ReactNode }) {
    return <p className="">{children}</p>
  },
  code({node, inline, className, children, ...props}: CodeProps) {
    const match = /language-(\w+)/.exec(className || "")
    // Check if the children content has new lines
    let fileContents = children?.toString() ?? ''
    const containsNewLines = /\n/.test(fileContents ?? "")

    let language = match?.[1] ?? ''
    const fileExtension = programmingLanguages[language] || `.${language || 'file'}`
    const suggestedFileName = `file-${generateRandomString(
      3,
      true
    )}${fileExtension}`

    const downloadAsFile = () => {
      if (typeof window === 'undefined') {
        return
      }

      const downloadFileName = window.prompt('Enter file name' || '', suggestedFileName)

      if (!downloadFileName) {
        // User pressed cancel on prompt.
        return
      }

      const blob = new Blob([fileContents], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.download = downloadFileName
      link.href = url
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }

    let innerCode = <code {...props} className={`mkd-code ${className ?? ""}`}>
      {children}
    </code>

    let fullCode = <>
      <div className="markdown-codeblock relative z-0">
        <div className="flex w-full items-center justify-between bg-zinc-800 px-6 py-2 pr-4 text-zinc-100">
          <span className="text-xs lowercase">{language || 'code'}</span>
          <div className="flex items-center space-x-0.5">
            <button
              className="rounded-md p-1 text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              onClick={downloadAsFile}
            >
              <DownloadIcon className="w-4 h-4"/>
              <span className="sr-only">Download</span>
            </button>
            <CopyToClipboard
              className={{container: "relative mt-0 right-6 top-0 lg:top-0 md:right-6 lg:pl-1", tooltip: "w-52"}}
              contentToCopy={fileContents}
              contentType={"Code"}
            />
          </div>
        </div>
        <code  {...props} className={`mkd-code ${className ?? ""}`}>
          {fileContents.replace(/\n$/, "")}
        </code>
      </div>
    </>
    // If inline, there's a chance it's actually a hidden codeblock.
    return !inline && match ? fullCode : !containsNewLines ? innerCode : fullCode
  }
}

interface RenderedMessage {
  author: string;
  text: string;
}

export const Markdown: React.FC<{ message: RenderedMessage }> = ({
  message,
}) => {
  const ref = useRef<HTMLDivElement>(null)
  let isUser = /user/i.test(message.author)

  const codeToPre = (str: string) => {
    const regex = /```([\s\S]*?)```/g

    const newStr = str.replace(regex, (match, p1) => {
      const replaced = p1.replace(/</g, "&lt;").replace(/>/g, "&gt;")
      return `\n<pre><code>${replaced}</code></pre>\n`
    })

    return newStr
  }


  let markdownContent = isUser ? codeToPre(message.text) : message.text

  return <ReactMarkdown
    className="markdown prose w-full break-words dark:prose-invert light flex flex-col gap-4"
    // @ts-ignore
    components={components}
    rehypePlugins={[rehypeRaw, remarkMath, remarkGfm]}
  >{markdownContent}</ReactMarkdown>
}
