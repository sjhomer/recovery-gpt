import {useRef} from "react"
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter"
import {vscDarkPlus} from "react-syntax-highlighter/dist/esm/styles/prism"
import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import {OpenAiCopyButton} from "@/ui/OpenAiCopyButton"
import {programmingLanguages} from "@/lib"

interface CodeProps {
  node: HTMLElement;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const components = {
  code({node, inline, className, children, ...props}: CodeProps) {
    const match = /language-(\w+)/.exec(className || "")
    return !inline && match ? (<div className="markdown-codeblock relative z-0">
      <OpenAiCopyButton
        className={{container: "right-7 top-0 lg:top-2 md:right-9 z-[999]", tooltip: "w-40"}}
        text={node.innerText}/>
      <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" {...props}>
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    </div>) : (<code {...props} className={`${className}`}>
      {children}
    </code>)
  }
}

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
    const regex = /```([\s\S]*?)```/g;

    const newStr = str.replace(regex, (match, p1) => {
      const replaced = p1.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return `<pre><code>${replaced}</code></pre>`;
    });

    return newStr;
  };


  let markdownContent = isUser ? codeToPre(message.text) : message.text

  return <ReactMarkdown
    className="markdown prose w-full break-words dark:prose-invert light"
    // @ts-ignore
    components={components}
    rehypePlugins={[rehypeRaw]}
  >{markdownContent}</ReactMarkdown>
}
