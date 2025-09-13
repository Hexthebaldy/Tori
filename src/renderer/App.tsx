import React, { useEffect } from "react";
import { Layout } from "./components/Layout";
import { NoteEditorPage } from "./pages/NoteEditorPage";
import { SettingsPage } from "./pages/SettingsPage";
import { useAppStore } from "./store";

function App() {
  const currentView = useAppStore((state) => state.currentView);
  const isLoading = useAppStore((state) => state.isLoading);
  const error = useAppStore((state) => state.error);
  const loadData = useAppStore((state) => state.loadData);
  const setError = useAppStore((state) => state.setError);

  // 应用启动时加载数据
  useEffect(() => {
    loadData();
  }, [loadData]);

  // 清除错误信息
  const clearError = () => {
    setError(null);
  };

  const renderCurrentPage = () => {
    switch (currentView) {
      case "settings":
        return <SettingsPage />;
      case "editor":
      default:
        return <NoteEditorPage />;
    }
  };

  // 显示加载状态
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full mb-4"></div>
          <p className="text-gray-600 text-lg">加载中...</p>
        </div>
      </div>
    );
  }

  // 显示错误信息
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">出现错误</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={clearError}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  return <Layout>{renderCurrentPage()}</Layout>;
}

export default App;
