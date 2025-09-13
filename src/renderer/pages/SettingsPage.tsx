import React from 'react';
import { useAppStore } from '../store';

export const SettingsPage: React.FC = () => {
  const { config, setConfig } = useAppStore();

  return (
    <div className="flex-1 p-8">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-semibold mb-8">Settings</h1>

        <div className="space-y-6">
          {/* API Configuration */}
          <div>
            <h2 className="text-lg font-medium mb-4">AI Configuration</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Provider
                </label>
                <select
                  value={config.apiProvider}
                  onChange={(e) => setConfig({ apiProvider: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="openai">OpenAI</option>
                  <option value="anthropic">Anthropic</option>
                  <option value="gemini">Google Gemini</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key
                </label>
                <input
                  type="password"
                  value={config.apiKey}
                  onChange={(e) => setConfig({ apiKey: e.target.value })}
                  placeholder="Enter your API key"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Your API key is stored securely on your device
                </p>
              </div>
            </div>
          </div>

          {/* Auto-save Settings */}
          <div>
            <h2 className="text-lg font-medium mb-4">Editor Settings</h2>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="autoSave"
                  checked={config.autoSave}
                  onChange={(e) => setConfig({ autoSave: e.target.checked })}
                  className="mr-3"
                />
                <label htmlFor="autoSave" className="text-sm font-medium text-gray-700">
                  Enable auto-save
                </label>
              </div>

              {config.autoSave && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Auto-save delay (seconds)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={config.autoSaveDelay / 1000}
                    onChange={(e) => setConfig({ autoSaveDelay: parseInt(e.target.value) * 1000 })}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
