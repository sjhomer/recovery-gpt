import React from 'react';

const ConversationListWrapper: React.FC<{children: JSX.Element}> = ({children}) => {
  return (
    <div className="relative flex h-full max-w-full flex-1 overflow-hidden bg-gray-800 text-white">
      <div className="flex h-full max-w-full flex-1 flex-col">
        <main className="relative h-full w-full transition-width flex flex-col overflow-auto items-stretch flex-1">
          <div className="absolute right-4 top-2 z-10 hidden flex-col gap-2 md:flex"></div>
          <div className="flex-1 overflow-hidden">
            <div className="react-scroll-to-bottom--css-ggavj-79elbk h-full dark:bg-gray-800">
              <div className="react-scroll-to-bottom--css-ggavj-1n7m0yu">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ConversationListWrapper;
