"use client"
import {Alert, AlertTitle,} from "@/components/shadcn/alert"
import {BadgeInfo, Flag, Share} from "lucide-react"
import {ShareButtons} from "@/components/buttons/ShareButtons"

const SplashPage: React.FC<{ action: JSX.Element }> = ({action}) => {
  return (
    <div className="flex justify-center w-screen h-screen text-lg">
      <div
        className="flex flex-col gap-4 w-full max-w-[800px] lg:my-auto px-8 py-12 bg-gray-800 shadow-md rounded-md text-white overflow-y-scroll">
        <h1 className="text-3xl font-semibold flex items-center gap-2">🛟 RecoveryGPT</h1>
        <h3 className="text-xl font-medium">Revive your ChatGPT conversations with elegance and full privacy!</h3>
        <p className="text-gray-300">
          Tired of the lacking user-friendly approach of default ChatGPT exports? RecoveryGPT empowers you
          to <strong>privately</strong> access your past conversations and <strong>review them seamlessly</strong> in a
          ChatGPT inspired UI.
        </p>
        <ul className="list-disc pl-4 space-y-4 leading-snug">
          <li>🔐 <strong>Secure</strong> - Operates with total respect for your privacy. No file uploads, no tracking,
            and fully functional offline.
          </li>
          <li>😌 <strong>Convenient</strong> - Enhanced usability allows you to review your old conversations more
            intuitively than in the ChatGPT interface.
          </li>
          <li>🏄 <strong>Effortless Recovery</strong> - In-built copy buttons enable you to retrieve your past text or
            code snippets with just one click.
          </li>
        </ul>
        <h4 className="text-2xl  flex items-center gap-2"><Flag/> Start reviewing your conversations!</h4>
        <div className="mt-4 lg:w-1/2 mx-auto">{action}</div>
        <p className="text-gray-300">
          Just hit the button to get started. <strong>Select a single file or many files to review your past conversations!</strong> You can effortlessly switch between files from the sidebar anytime you
          want to review a different conversations.
        </p>
        <h4 className="text-2xl  flex items-center gap-2">📚 Getting Your Exported Data</h4>
        <p className="text-gray-300 ">
          Exporting your data from ChatGPT is simple. Follow <a className="underline"
          href="https://help.openai.com/en/articles/7260999-how-do-i-export-my-chatgpt-history-and-data"
          target="_blank">OpenAI&apos;s step-by-step guide.</a> After
          that, unzip the downloaded file and choose it below.
        </p>
        <Alert className="bg-green-700 text-slate-200 border-green-700 lg:text-justify">
          <BadgeInfo className="h-5 w-5 stroke-slate-200 mt-1"/>
          <AlertTitle className="leading-normal">Note! You must select a <code>conversation.json</code> file, or series of these, from your ChatGPT exports. The other files will not work, only <code>conversation.json</code> files.</AlertTitle>
        </Alert>
        <h5 className="text-2xl flex items-center gap-2"><Share/> Share RecoveryGPT with others!</h5>
        <p className="text-gray-300 ">
          Think this tool might be helpful for someone you know? Use the share buttons below to spread the word!
        </p>
        <div className="flex justify-center gap-3 ">
          <ShareButtons/>
        </div>
        <p className="text-gray-300 ">
          Check out the project on <a className="underline" href="https://github.com/sjhomer/recovery-gpt"
          target="_blank">GitHub</a> to explore
          the secure and open source codebase behind RecoveryGPT.
        </p>
      </div>
    </div>
  )
}

export default SplashPage
