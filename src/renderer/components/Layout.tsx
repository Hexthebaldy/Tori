import React, { useState } from "react";
import { useAppStore } from "../store";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const { currentView, setView } = useAppStore();

  const handleSettingsClick = () => {
    setView(currentView === "settings" ? "editor" : "settings");
  };

  const handleNotesClick = () => {
    setView("editor");
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar - Hidden by default for minimal UI */}
      {sidebarVisible && currentView === "editor" && (
        <div className="sidebar">
          <div className="p-4">
            <h2 className="text-sm font-medium text-gray-600 mb-4">Notes</h2>
            {/* Folder navigation will be implemented later */}
            <div className="text-sm text-gray-500">
              Folders will appear here...
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="main-content">
        {/* Minimal header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
          {/* Navigation buttons */}
          <div className="flex items-center gap-2">
            {currentView === "editor" && (
              <button
                onClick={handleNotesClick}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                aria-label="Toggle notes sidebar"
              >
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            )}

            {currentView === "settings" && (
              <button
                onClick={() => setView("editor")}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                aria-label="Back to editor"
              >
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Settings button */}
          <button
            onClick={handleSettingsClick}
            className={`p-2 hover:bg-gray-100 rounded-md transition-colors ${
              currentView === "settings" ? "bg-gray-100" : ""
            }`}
            aria-label="Settings"
          >
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col">{children}</div>
      </div>
    </div>
  );
};
