import {OpenAiChatImage} from "./OpenAiChatImage"
import OpenAiUserImage from "./OpenAiUserImage"
import {marked} from "marked"
import OpenAiAvatar from "./OpenAiAvatar"

interface RenderedMessage {
  author: string;
  text: string;
}

export const OpenAiMessage: React.FC<{ message: RenderedMessage }> = ({message}) => {
  let isUser = /user/i.test(message.author)

  return <div
    className={isUser ? "group w-full text-gray-800 dark:text-gray-100 border-b border-black/10 dark:border-gray-900/50 dark:bg-gray-800" : "group w-full text-gray-800 dark:text-gray-100 border-b border-gray-900/50 bg-[#444654]"}>
    <div
      className="convoInner flex p-4 gap-4 text-base md:gap-6 md:max-w-2xl lg:max-w-4xl xl:max-w-5xl md:py-6 lg:px-0 m-auto">
      <div className="userImage flex-shrink-0 flex flex-col relative items-end">
        <div className="w-12">
          <div className="relative flex">
            <span
              className="box-border inline-block overflow-hidden w-initial h-initial bg-none opacity-100 border-0 m-0 p-0 relative max-w-full">
              <OpenAiAvatar name={message.author} />
            </span>
          </div>
        </div>
      </div>
      <div className="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)] text-white  whitespace-pre-wrap" dangerouslySetInnerHTML={{__html: marked.parse(message.text)}}/>
    </div>
  </div>
}
