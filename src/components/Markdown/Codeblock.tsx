import {useEffect, useRef, useState} from "react"
import {DownloadIcon} from "lucide-react"
import {CopyToClipboard} from "@/components/buttons/CopyToClipboard"
import {cn, downloadAsFile} from "@/lib"

interface CodeblockProps {
  language?: string;
  className?: string;
  filename: string;
  fileContents: string;
}

export const Codeblock: React.FC<CodeblockProps> = ({
  language,
  className,
  filename,
  fileContents,
  ...props
}) => {
  const handleDownload = () => {
    downloadAsFile(filename, fileContents)
  }

  const [isExpanded, setIsExpanded] = useState(false)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const codeRef = useRef<HTMLElement>(null)

  const toggleExpand = () => setIsExpanded(!isExpanded)

  useEffect(() => {
    if (codeRef.current && codeRef.current.scrollHeight > 18 * 16) {
      setIsOverflowing(true)
    }
  }, [codeRef])

  return (
    <div className={`markdown-codeblock relative z-0 ${isExpanded ? "" : "max-h-72 overflow-hidden"}`}>
      <div className="flex w-full items-center justify-between bg-zinc-800 px-6 py-2 pr-4 text-zinc-100">
        <span className="text-xs lowercase">{language || "code"}</span>
        <div className="codeblockActions flex items-center space-x-0.5">
          <button
            className="rounded-md p-1 text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            onClick={handleDownload}
          >
            <DownloadIcon className="w-4 h-4"/>
            <span className="sr-only">Download</span>
          </button>
          <CopyToClipboard
            className={{container: "relative mt-0 right-6 top-0 lg:top-0 md:right-6 lg:pl-1", tooltip: "w-52"}}
            contentToCopy={fileContents}
            contentType="Code"
          />
        </div>
      </div>
      <code ref={codeRef} {...props} className={cn("mkd-code", className)}>
        {fileContents.replace(/\n$/, "")}
      </code>
      {isOverflowing &&
        <div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-700 to-[#1e1e1e] z-50 flex justify-center p-2">
          <button
            onClick={toggleExpand}
            className="px-3 py-1 text-sm text-center text-gray-100 rounded-3xl shadow bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isExpanded ? "- Collapse <code>" : "+ Expand <code>"}
          </button>
        </div>
      }
    </div>
  )
}
