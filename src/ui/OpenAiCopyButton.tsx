import {MouseEventHandler, useState} from "react"
import {CheckCircle, ClipboardCopy} from "lucide-react"

interface OpenAiCopyButtonProps {
  onClick: () => void;
}

export const OpenAiCopyButton: React.FC<OpenAiCopyButtonProps> = ({onClick}) => {
  const [copied, setCopied] = useState(false)

  const clickHandler: MouseEventHandler<HTMLButtonElement> = (e) => {
    if (onClick) {
      onClick()
      setCopied(true)

      // Reset the copied state after 3 seconds
      setTimeout(() => {
        setCopied(false)
      }, 3000)
    }
  }

  return (
    <div
      className="text-gray-400 flex self-center justify-center mt-2 gap-2 md:gap-3 lg:gap-1 absolute top-2 lg:top-4 translate-x-full right-2 md:right-0 lg:mt-0 lg:pl-2 visible">
      <button
        className={`flex ml-auto gap-2 rounded-md p-1 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400 ${copied ? 'cursor-default':'hover:bg-gray-100 hover:text-gray-700'}`}
        onClick={clickHandler}
      >
        {copied ? (
          <CheckCircle className="w-4 h-4"/>
        ) : (
          <ClipboardCopy className="w-4 h-4"/>
        )}
      </button>
      {copied && (
        <div
          className="absolute bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-md text-xs top-7 right-0 w-32">
          Copied to clipboard
        </div>
      )}
    </div>
  )
}
