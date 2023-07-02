import React from "react"
import {Alert, AlertTitle,} from "@/components/ui/alert"
import {StickyNote} from "lucide-react"

const SplashPage: React.FC<{ action: JSX.Element }> = ({action}) => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-lg">
      <div className="w-full max-w-[800px] px-8 py-12 bg-gray-800 shadow-md rounded-md text-white">
        <h1 className="text-3xl font-semibold mb-2">Recovery GPT</h1>
        <h3 className="text-lg font-medium mb-2">Restore your exported GTP conversations privately, and in style!</h3>
        <p className="text-gray-300 mb-6">
          With the default exports lacking all the usability you
          originally had inside ChatGPT, this humble application allows you to <strong>privately</strong> load your past exported
          conversations and <strong>review them easily</strong> in a UI inspired by ChatGPT.
        </p>
        <h4 className="text-2xl mb-2">Obtaining your Exported Data</h4>
        <p className="text-gray-300 mb-6">
          To export your data from ChatGPT, <a className="underline" href="https://help.openai.com/en/articles/7260999-how-do-i-export-my-chatgpt-history-and-data" target="_blank">follow these steps from OpenAI themselves.</a> Once you have, simply extract the ZIP file and select it below.
        </p>
        <Alert className="bg-green-700 text-gray-100 border-green-700 text-justify">
          <StickyNote className="h-4 w-4 fill-white"/>
          <AlertTitle>NOTE! You must select and load the <code>conversation.json</code> from an export.</AlertTitle>
        </Alert>
        <h4 className="text-2xl my-3">Enjoy reviewing your old conversions easily, and safely!</h4>
        <p className="text-gray-300 mb-6">
          Click the button below to begin. You&apos;ll be able to switch files afterward easily from the button in the sidebar too.
        </p>
        <div className="mt-4 w-1/2 mx-auto">{action}</div>
      </div>
    </div>
  )
}

export default SplashPage
