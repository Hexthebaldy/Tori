import { app, BrowserWindow } from "electron";
import * as path from "path";
import { setupStorageIPC } from "./storage";

/**
 * 创建主窗口函数
 * Electron 应用由主进程和渲染进程组成：
 * - 主进程：控制应用生命周期，创建和管理渲染进程
 * - 渲染进程：显示用户界面，运行网页内容（React 应用）
 */
function createWindow(): void {
  // 创建浏览器窗口实例
  const mainWindow = new BrowserWindow({
    height: 800,
    width: 1200,
    // webPreferences: 配置渲染进程的安全和功能选项
    webPreferences: {
      // nodeIntegration: false - 禁用 Node.js 集成，提高安全性
      // 渲染进程无法直接访问 Node.js API
      nodeIntegration: false,

      // contextIsolation: true - 启用上下文隔离，进一步提高安全性
      // 主世界（网页）和隔离世界（preload 脚本）分离
      contextIsolation: true,

      // preload: 预加载脚本路径
      // 在网页加载前运行，可以安全地暴露 API 给渲染进程
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // 根据环境加载不同的内容
  if (process.env.NODE_ENV === "development") {
    // 开发模式：连接到 webpack-dev-server
    mainWindow.loadURL("http://localhost:3000");
    // 自动打开开发者工具
    mainWindow.webContents.openDevTools();
  } else {
    // 生产模式：加载打包后的静态文件
    mainWindow.loadFile(path.join(__dirname, "../index.html"));
  }
}

// 当 Electron 完成初始化并准备创建浏览器窗口时触发
// 某些 API 只能在此事件发生后使用
app.on("ready", () => {
  // 初始化存储 IPC 处理程序
  setupStorageIPC();

  createWindow();

  // macOS 特有行为：点击 dock 图标时重新创建窗口
  app.on("activate", function () {
    // 在 macOS 上，当点击 dock 图标且没有打开的窗口时，
    // 通常会重新创建一个窗口
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 当所有窗口都被关闭时触发
app.on("window-all-closed", () => {
  // 在 macOS 上，应用和菜单栏通常会保持活跃状态，
  // 直到用户显式地用 Cmd + Q 退出
  if (process.platform !== "darwin") {
    app.quit();
  }
});
