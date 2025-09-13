import React from "react";
import { Layout } from "./components/Layout";
import { NoteEditorPage } from "./pages/NoteEditorPage";
import { SettingsPage } from "./pages/SettingsPage";
import { useAppStore } from "./store";

function App() {
  const currentView = useAppStore((state) => state.currentView);

  const renderCurrentPage = () => {
    switch (currentView) {
      case "settings":
        return <SettingsPage />;
      case "editor":
      default:
        return <NoteEditorPage />;
    }
  };

  return <Layout>{renderCurrentPage()}</Layout>;
}

export default App;
