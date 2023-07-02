import {MouseEventHandler} from "react"
import {useToast} from "@/components/ui/use-toast"

interface OpenAiCopyButtonProps {
  onClick: () => void;
}

export const OpenAiCopyButton: React.FC<OpenAiCopyButtonProps> = ({onClick}) => {
  const {toast} = useToast()

  const clickHandler = (e: MouseEventHandler<HTMLButtonElement> | undefined) => {
    toast({
      title: "✅ Copied message content to clipboard!",
    })
    if (onClick)
      onClick()
  }


  return <div
    className="text-gray-400 flex self-end lg:self-center justify-center mt-2 gap-2 md:gap-3 lg:gap-1 lg:absolute lg:top-0 lg:translate-x-full lg:right-0 lg:mt-0 lg:pl-2 visible">
    <button
      className="flex ml-auto gap-2 rounded-md p-1 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400"
      // @ts-ignore
      onClick={clickHandler}>
      <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round"
           strokeLinejoin="round" className="h-4 w-4" height="1em" width="1em"
           xmlns="http://www.w3.org/2000/svg">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
      </svg>
    </button>
  </div>
}
