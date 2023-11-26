import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import {generateRandomString, languageFileTypes} from "@/lib"
import {Codeblock} from "@/components/Markdown/Codeblock"

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
    return <ol className="list-decimal list-inside m-0 leading-8 space-y-2 whitespace-normal">{children}</ol>
  },
  ul({children}: { children: React.ReactNode }) {
    return <ul className="list-disc list-outside pl-4 leading-8 space-y-2 whitespace-normal">{children}</ul>
  },
  span({children, className}: { children: React.ReactNode, className?: string }) {
    return <span className={className?.includes("highlight") ? "bg-indigo-700 text-white p-1 m-[-4px] rounded-lg shadow" : ""}>{children}</span>
  },
  table({children}: { children: React.ReactNode }) {
    return <table className="w-full table-auto shadow-md">{children}</table>
  },
  thead({children}: { children: React.ReactNode }) {
    return <thead>{children}</thead>
  },
  tbody({children}: { children: React.ReactNode }) {
    return <tbody className="divide-y divide-x">{children}</tbody>
  },
  tr({children}: { children: React.ReactNode }) {
    return <tr>{children}</tr>
  },
  th({children}: { children: React.ReactNode }) {
    return <th className="border border-gray-300 p-2 text-left text-sm bg-gray-100">{children}</th>
  },
  td({children}: { children: React.ReactNode }) {
    return <td className="border border-gray-300 p-2 text-sm bg-gray-800 hover:bg-gray-600">{children}</td>
  },
  code({node, inline, className, children, ...props}: CodeProps) {
    // Attempt to get the language of the codeblock
    const match = /language-(\w+)/.exec(className || "")
    const language = match?.[1] || ""
    // Extract the codeblock from the markdown, and check if it's inline
    let fileContents = children?.toString() ?? ""
    const containsNewLines = /\n/.test(fileContents ?? "")
    // Now we can check if the codeblock is truely inline or not
    const displayFullCodeblock = (!inline && language) || containsNewLines
    // From the matched language, get the file extension and suggested file name
    const fileExtension = languageFileTypes[language] || `.${language || "file"}`
    const suggestedFileName = /:(\S+?\.\S+?)(?=\s|$)/.exec(match?.input || "")?.[1] || `file-${generateRandomString(
      3,
      true
    )}${fileExtension}`

    // If this isn't inline code, or we have a "inline" that is actually multiline, display a codeblock
    return displayFullCodeblock ?
      <Codeblock
        filename={suggestedFileName}
        fileContents={fileContents}
        language={language}
        className={className}
        {...props}
      /> :
      // Else, display an inline codeblock
      <code {...props} className={`mkd-code ${className ?? ""}`}>
        {children}
      </code>
  }
}

interface RenderedMessage {
  author: string;
  text: string;
}

export const Markdown: React.FC<{ message: RenderedMessage }> = ({
  message,
}) => {
  let isUser = /user/i.test(message.author)

  /**
   * Find and convert all markdown codeblocks to pre/code tags so that they can
   * be properly syntax highlighted.
   * @param {string} str
   */
  const codeToPre = (str: string) => {
    return str.replace(/```([\s\S]*?)```/g, (match, p1) => {
      const replaced = p1.replace(/</g, "&lt;").replace(/>/g, "&gt;")
      // Give is space to ensure it doesn't bud up against other elements
      return `\n<pre><code>${replaced}</code></pre>\n`
    })
  }

  // We only want to convert the user's messages to pre/code tags, as the AI assistant
  // messages should correctly already be in pre/code tags.
  let markdownContent = isUser ? codeToPre(message.text) : message.text

  return <ReactMarkdown
    className="markdown prose w-full break-words dark:prose-invert light flex flex-col gap-4  overflow-y-visible"
    // @ts-ignore
    components={components}
    rehypePlugins={[rehypeRaw, remarkMath, remarkGfm]}
  >{markdownContent}</ReactMarkdown>
}
