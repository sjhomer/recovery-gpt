import { SidebarToggle } from "@/components/Sidebar/SidebarToggle";
import { useState } from 'react';

interface SidebarHeaderProps {
  selection: JSX.Element;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  onSearchChange: (searchTerm: string) => void;
  searchInput: string;
}

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5" // This sets the height and width to Tailwind's size scale of 5
 viewBox="0 0 24 24" fill="none">
    <path d="M11 6C13.7614 6 16 8.23858 16 11M16.6588 16.6549L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <script/></svg>
);

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4" // Adjust size as needed
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  selection,
  isSidebarOpen,
  toggleSidebar,
  onSearchChange,
  searchInput
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onSearchChange(newValue);
  };

  const clearSearch = () => {
    onSearchChange('');
  };

  return (
    <>
      <div className="mb-1 flex flex-row gap-2 text-white">
        {selection}
        <SidebarToggle isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>
      <div className="mb-1 flex flex-row gap-2 text-white items-center">
        <div className="relative flex items-center w-full">
          <div className="absolute left-3">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchInput}
            onChange={handleSearchChange}
            className="pl-10 w-full px-4 py-2 rounded-md border border-white/20 bg-transparent text-white focus:outline-none focus:border-indigo-500" // Update with Tailwind classes to match your design
          />
          {searchInput && (
            <button
              onClick={clearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-600 rounded-full p-1 text-white hover:bg-white hover:text-gray-600 focus:outline-none focus:bg-white focus:text-gray-600"
            >
              <CloseIcon />
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default SidebarHeader;
