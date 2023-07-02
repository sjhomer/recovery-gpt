import React from 'react';

const SplashPage: React.FC<{ action: JSX.Element }> = ({ action }) => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="w-full max-w-xl px-8 py-12 bg-gray-800 shadow-md rounded-md">
        <h1 className="text-3xl font-semibold text-white mb-4">Recovery GPT</h1>
        <p className="text-gray-300 mb-6">
          Restore your exported GTP conversations in style! With the default exports lacking all the usability you
          originally had inside ChatGPT, this humble application allows you to privately load your past exported
          conversations and access them easily in a UI inspired by ChatGPT.
        </p>
        <p className="text-gray-300 mb-6">
          All you need to do is click on the "Read File" button below to begin. You can switch files afterward from the
          button in the sidebar.
        </p>
        <p className="text-red-500 font-medium mb-6">You must select an exported "conversation.json" to load.</p>
        <p className="text-gray-300">Enjoy reviewing your old chats easily and safely!</p>

        {action}
      </div>
    </div>
  );
};

export default SplashPage;
