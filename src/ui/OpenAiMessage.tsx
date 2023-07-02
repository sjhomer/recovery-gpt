import {OpenAiChatImage} from "./OpenAiChatImage"
import OpenAiUserImage from "./OpenAiUserImage"

interface RenderedMessage {
  author: string;
  text: string;
}

export const OpenAiMessage: React.FC<{ message: RenderedMessage }> = ({message}) => {
  let isUser = message.author === "user"
  const classes = isUser ? "group w-full text-gray-800 dark:text-gray-100 border-b border-black/10 dark:border-gray-900/50 dark:bg-gray-800" : "group w-full text-gray-800 dark:text-gray-100 border-b border-black/10 dark:border-gray-900/50 bg-gray-50 dark:bg-[#444654]"
  let icon = isUser ? <OpenAiUserImage/> : <OpenAiChatImage/>
  return <div
    className={classes}>
    <div
      className="convoInner flex p-4 gap-4 text-base md:gap-6 md:max-w-2xl lg:max-w-[38rem] xl:max-w-3xl md:py-6 lg:px-0 m-auto">
      <div className="userImage flex-shrink-0 flex flex-col relative items-end">
        <div className="w-[30px]">
          <div className="relative flex">
            <span
              className="box-border inline-block overflow-hidden w-initial h-initial bg-none opacity-100 border-0 m-0 p-0 relative max-w-full">
                <span className="box-border block w-initial h-initial bg-none opacity-100 border-0 m-0 p-0 max-w-full">
                  <img
                    alt=""
                    aria-hidden="true"
                    src="data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20version=%271.1%27%20width=%2738%27%20height=%2738%27/%3e"
                    className="block max-w-full w-initial h-initial bg-none opacity-100 border-0 m-0 p-0"
                  />
                </span>
              {icon}
            </span>
          </div>
        </div>
      </div>
      <div className="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]">
        {message.text}
      </div>
    </div>
  </div>
}
