import { contextBridge } from "electron";

// 使用 require 方式导入 electron-store 来避免类型问题
const Store = require("electron-store");

// 创建 electron-store 实例
const store = new Store({
  name: "tori-data",
  fileExtension: "json",
  clearInvalidConfig: true,
});

// 暴露安全的 API 给渲染进程
contextBridge.exposeInMainWorld("electronAPI", {
  // 应用版本信息
  getVersion: () => process.versions.electron,

  // 存储 API - 提供安全的存储访问
  store: {
    // 获取存储值
    get: (key: string, defaultValue?: any) => {
      try {
        return store.get(key, defaultValue);
      } catch (error) {
        console.error("Store get error:", error);
        return defaultValue;
      }
    },

    // 设置存储值
    set: (key: string, value: any) => {
      try {
        store.set(key, value);
        return true;
      } catch (error) {
        console.error("Store set error:", error);
        return false;
      }
    },

    // 删除存储值
    delete: (key: string) => {
      try {
        store.delete(key);
        return true;
      } catch (error) {
        console.error("Store delete error:", error);
        return false;
      }
    },

    // 检查键是否存在
    has: (key: string) => {
      try {
        return store.has(key);
      } catch (error) {
        console.error("Store has error:", error);
        return false;
      }
    },

    // 清空所有存储
    clear: () => {
      try {
        store.clear();
        return true;
      } catch (error) {
        console.error("Store clear error:", error);
        return false;
      }
    },

    // 获取存储文件路径（用于调试）
    getStorePath: () => {
      try {
        return store.path;
      } catch (error) {
        console.error("Store path error:", error);
        return "";
      }
    },
  },

  // 文件系统相关 API（如果后续需要文件操作）
  fs: {
    // 预留给文件系统操作使用
    // 例如：导出笔记为文件，导入文件等
  },
});
