import { ipcMain } from "electron";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

const STORAGE_DIR = path.join(
  os.homedir(),
  "Library",
  "Application Support",
  "Tori",
);
const STORAGE_FILE = path.join(STORAGE_DIR, "tori-data.json");

interface StorageData {
  [key: string]: any;
}

function ensureStorageDir() {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
  }
}

function readData(): StorageData {
  try {
    ensureStorageDir();
    if (!fs.existsSync(STORAGE_FILE)) {
      return {};
    }
    const content = fs.readFileSync(STORAGE_FILE, "utf8");
    return JSON.parse(content);
  } catch (error) {
    console.error("Error reading storage file:", error);
    return {};
  }
}

function writeData(data: StorageData): boolean {
  try {
    ensureStorageDir();
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Error writing storage file:", error);
    return false;
  }
}

export function setupStorageIPC() {
  ipcMain.handle(
    "storage:get",
    async (event, key: string, defaultValue?: any) => {
      const data = readData();
      return data[key] !== undefined ? data[key] : defaultValue;
    },
  );

  ipcMain.handle("storage:set", async (event, key: string, value: any) => {
    const data = readData();
    data[key] = value;
    const success = writeData(data);
    return { success };
  });

  ipcMain.handle("storage:delete", async (event, key: string) => {
    const data = readData();
    delete data[key];
    const success = writeData(data);
    return { success };
  });

  ipcMain.handle("storage:clear", async () => {
    const success = writeData({});
    return { success };
  });

  ipcMain.handle("storage:getPath", async () => {
    return STORAGE_FILE;
  });

  ipcMain.handle("storage:has", async (event, key: string) => {
    const data = readData();
    return data.hasOwnProperty(key);
  });
}
