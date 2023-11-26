import Avatar from "./icons/Avatar"
import {CopyToClipboard} from "@/components/buttons/CopyToClipboard"
import {Markdown} from "@/components/Markdown"

interface RenderedMessage {
  author: string;
  text: string;
}

export const Message: React.FC<{ message: RenderedMessage }> = ({
  message,
}) => {
  let isUser = /user/i.test(message.author)

  return (
    <div
      className={
        isUser
          ? // User styles
          "group w-full text-gray-100 border-b border-gray-900/50 bg-gray-700"
          : // Assistant styles
          "group w-full text-gray-100 border-b border-gray-900/50 bg-slate-800"
      }
    >
      <div
        className="convoInner flex p-4 text-base gap-3 md:gap-6 md:max-w-2xl lg:max-w-4xl xl:max-w-5xl md:py-6 lg:px-4 m-auto">
        <div className="userImage flex-shrink-0 flex flex-col relative items-end">
          <div className="w-6 md:w-12">
            <div className="relative flex">
              <span
                className="box-border inline-block overflow-hidden w-initial h-initial bg-none opacity-100 border-0 m-0 p-0 relative max-w-full">
                <Avatar name={message.author}/>
              </span>
            </div>
          </div>
        </div>
        <div className="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)] overflow-y-visible">
          <div className="flex flex-grow flex-col gap-3  overflow-y-visible">
            <div className="flex justify-between lg:block">
              <CopyToClipboard contentToCopy={message.text}/>
            </div>
            <div
              className="min-h-[20px] flex items-start overflow-x-auto overflow-y-visible whitespace-pre-wrap break-words flex-col gap-4">
              <Markdown message={message}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
