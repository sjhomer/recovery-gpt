import React from 'react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import {StickyNote} from "lucide-react"

const SplashPage: React.FC<{ action: JSX.Element }> = ({ action }) => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="w-full max-w-[800px] px-8 py-12 bg-gray-800 shadow-md rounded-md text-white">
        <h1 className="text-3xl font-semibold mb-2">Recovery GPT</h1>
        <h3 className="text-lg font-medium mb-2">Restore your exported GTP conversations privately, and in style!</h3>
        <p className="text-gray-300 mb-6">
          With the default exports lacking all the usability you
          originally had inside ChatGPT, this humble application allows you to privately load your past exported
          conversations and access them easily in a UI inspired by ChatGPT.
        </p>
        <p className="text-gray-300 mb-6">
          All you need to do is click on the &quot;Select a file&quot; button below to begin. You can switch files afterward easily from the
          button in the sidebar too.
        </p>
        <Alert>
          <StickyNote className="h-4 w-4" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            NOTE: You must select an exported &quot;conversation.json&quot;   to load.
          </AlertDescription>
        </Alert>
        <p className="text-gray-300">Enjoy reviewing your old conversions easily, and safely!</p>

        <div className="mt-8 w-1/2 mx-auto">{action}</div>
      </div>
    </div>
  );
};

export default SplashPage;
