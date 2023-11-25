import React, {ChangeEvent, FormEvent, useState} from "react"
import {convertUnixTimestampToDate} from "@/lib"

interface FileFormProps {
  handleFileChange: (fileData: RecoveryGPT.Conversations, filename: string) => void;
  fileName: string;
  setFileName:  React.Dispatch<React.SetStateAction<string>>;
}

const LoadConversation: React.FC<FileFormProps> = ({handleFileChange, fileName, setFileName}) => {
  const [fileContent, setFileContent] = useState<RecoveryGPT.Conversations>([])

  const loadFile = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const filePromises = Array.from(files).map((file) => {
        return new Promise<RecoveryGPT.Conversations>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = (e) => {
            const contents = e.target?.result as string
            const parsedFileData = JSON.parse(contents) as RecoveryGPT.Conversations
            resolve(parsedFileData)
          }
          reader.onerror = (e) => {
            reject(e)
          }
          reader.readAsText(file)
        })
      })

      Promise.all(filePromises)
        .then((results) => {
          const combinedFileData = results.flat()
          setFileContent(combinedFileData)
          const filename = generateFilename(combinedFileData)
          handleFileChange(combinedFileData, filename)
          setFileName(filename)
        })
        .catch((error) => {
          console.error("Error loading files:", error)
        })
    } else {
      setFileContent([])
      setFileName("Select 'conversions.json' files to review")
    }
  }

  // Ignore submit, as everything is handled by the file input
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
  }

  const generateFilename = (parsedFileData: RecoveryGPT.Conversations) => {
    if (parsedFileData.length === 1) {
      const firstConversation = parsedFileData[0]
      if (firstConversation && firstConversation.create_time) {
        const unixTimestamp = firstConversation.create_time
        const formattedDate = convertUnixTimestampToDate(unixTimestamp)
        return `${formattedDate} (${parsedFileData.length})`
      }
      return "Select a file"
    } else {
      const sortedConversations = parsedFileData.sort((a, b) => a.create_time - b.create_time)
      const firstConversation = sortedConversations[0]
      const lastConversation = sortedConversations[sortedConversations.length - 1]
      const from = convertUnixTimestampToDate(firstConversation.create_time)
      const until = convertUnixTimestampToDate(lastConversation.create_time)
      return `${from} - ${until}`
    }
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
        <input type="file" className="hidden" accept=".json" multiple onChange={loadFile}/>
      </label>
    </form>
  )
}

export default LoadConversation
