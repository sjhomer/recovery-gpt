import React, {ChangeEvent, FormEvent, useState} from "react"
import {Conversations} from "@/ui/OpenAiContentPane"

interface FileFormProps {
  handleFileChange: (fileData: Conversations, filename: string) => void;
  fileName: string;
  setFileName:  React.Dispatch<React.SetStateAction<string>>;
}

const LoadConversation: React.FC<FileFormProps> = ({handleFileChange, fileName, setFileName}) => {
  const [fileContent, setFileContent] = useState<Conversations>([])

  const loadFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const contents = e.target?.result as string
        const parsedFileData = JSON.parse(contents) as Conversations
        setFileContent(parsedFileData)
        const filename = generateFilename(parsedFileData)
        handleFileChange(parsedFileData, filename)
        setFileName(filename)
      }
      reader.readAsText(file)
    } else {
      setFileContent([])
      setFileName("Select a file")
    }
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    // Process the file content here
    console.log(fileContent)
  }

  const convertUnixTimestampToDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const generateFilename = (parsedFileData: Conversations) => {
    const firstConversation = parsedFileData[0]
    if (firstConversation && firstConversation.create_time) {
      const unixTimestamp = firstConversation.create_time
      const formattedDate = convertUnixTimestampToDate(unixTimestamp)
      return `${formattedDate} (${parsedFileData.length})`
    }
    return "Select a file"
  }

  return (
    <form onSubmit={handleSubmit}>
      <label
        className="flex p-3 items-center gap-3 transition-colors duration-200 text-white cursor-pointer text-sm rounded-md border border-white/20 hover:bg-gray-500/10 h-11 flex-shrink-0 flex-auto">
        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round"
             strokeLinejoin="round" className="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <span className="text-gray-300">{fileName}</span>
        <input type="file" className="hidden" onChange={loadFile}/>
      </label>
    </form>
  )
}

export default LoadConversation
