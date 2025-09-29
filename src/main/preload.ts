import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  getVersion: () => process.versions.electron,

  store: {
    get: async (key: string, defaultValue?: any) => {
      return await ipcRenderer.invoke("storage:get", key, defaultValue);
    },

    set: async (key: string, value: any) => {
      const result = await ipcRenderer.invoke("storage:set", key, value);
      return result.success;
    },

    getStorePath: async () => {
      return await ipcRenderer.invoke("storage:getPath");
    },
  },
});
