import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  // 在这里暴露安全的 API 给渲染进程
  getVersion: () => process.versions.electron,
});
