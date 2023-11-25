interface SidebarOverlayProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const SidebarOverlay: React.FC<SidebarOverlayProps> = ({ isSidebarOpen, toggleSidebar }) => {
  if (!isSidebarOpen) return null;
  return (
    <div
      className="fixed inset-0 bg-black opacity-40 z-40 md:hidden"
      onClick={toggleSidebar}
    ></div>
  );
};

export default SidebarOverlay;
