import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { spawn, ChildProcess } from 'child_process';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;
let currentWorkerProcess: ChildProcess | null = null;

const IS_DEV = process.env.NODE_ENV === 'development' || !app.isPackaged;
const ROOT_DIR = path.resolve(__dirname, '../../');
const USER_LAUDA_DIR = path.join(os.homedir(), '.lauda');
const PREFS_PATH = path.join(USER_LAUDA_DIR, 'ui.json');
const HISTORY_PATH = path.join(USER_LAUDA_DIR, 'history.json');
const LOGS_DIR = path.join(USER_LAUDA_DIR, 'logs');

function getPythonPath(): string {
  const venvWin = path.join(ROOT_DIR, '.venv', 'Scripts', 'python.exe');
  if (fs.existsSync(venvWin)) return venvWin;
  const venvUnix = path.join(ROOT_DIR, '.venv', 'bin', 'python');
  if (fs.existsSync(venvUnix)) return venvUnix;
  return 'python';
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 960,
    minHeight: 640,
    title: 'Lauda Local',
    autoHideMenuBar: true,
    backgroundColor: '#0F1218',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (IS_DEV && process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else if (IS_DEV) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// IPC Handlers

ipcMain.handle('select-file', async (_, filters) => {
  if (!mainWindow) return null;
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: filters || [
      { name: 'Arquivos de Mídia', extensions: ['mp4', 'mkv', 'avi', 'mov', 'webm', 'mp3', 'wav', 'm4a', 'flac', 'ogg'] },
      { name: 'Todos os Arquivos', extensions: ['*'] }
    ]
  });
  if (result.canceled || result.filePaths.length === 0) return null;
  return result.filePaths[0];
});

ipcMain.handle('select-folder', async () => {
  if (!mainWindow) return null;
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  if (result.canceled || result.filePaths.length === 0) return null;
  return result.filePaths[0];
});

ipcMain.handle('get-prefs', async () => {
  try {
    if (fs.existsSync(PREFS_PATH)) {
      const content = fs.readFileSync(PREFS_PATH, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Erro ao ler prefs:', err);
  }
  return { theme: 'auto', options: {} };
});

ipcMain.handle('save-prefs', async (_, prefs) => {
  try {
    if (!fs.existsSync(USER_LAUDA_DIR)) {
      fs.mkdirSync(USER_LAUDA_DIR, { recursive: true });
    }
    fs.writeFileSync(PREFS_PATH, JSON.stringify(prefs, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Erro ao salvar prefs:', err);
    return false;
  }
});

ipcMain.handle('get-history', async () => {
  try {
    if (fs.existsSync(HISTORY_PATH)) {
      const content = fs.readFileSync(HISTORY_PATH, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Erro ao ler historico:', err);
  }
  return [];
});

ipcMain.handle('clear-history', async () => {
  try {
    if (fs.existsSync(HISTORY_PATH)) {
      fs.writeFileSync(HISTORY_PATH, JSON.stringify([]), 'utf-8');
    }
    return true;
  } catch (err) {
    console.error('Erro ao limpar historico:', err);
    return false;
  }
});

ipcMain.handle('get-hardware-info', async () => {
  return new Promise((resolve) => {
    const python = getPythonPath();
    const script = `
import json, sys
from lauda.hardware import detect_hardware, assess_machine
try:
    hw = detect_hardware()
    assessment = assess_machine(hw)
    res = {
        "cpu_count": hw.cpu_count,
        "ram_gb": round(hw.ram_gb, 1),
        "gpus": [{"name": g.name, "vram_gb": round(g.vram_gb, 1), "vendor": g.vendor} for g in hw.gpus],
        "primary_gpu": hw.primary_gpu.name if hw.primary_gpu else None,
        "recommendation": assessment.recommended_preset
    }
    print(json.dumps(res))
except Exception as e:
    print(json.dumps({"error": str(e)}))
`;
    const proc = spawn(python, ['-c', script], { cwd: ROOT_DIR });
    let output = '';
    proc.stdout.on('data', (d) => { output += d.toString(); });
    proc.on('close', () => {
      try {
        resolve(JSON.parse(output.trim()));
      } catch {
        resolve({ cpu_count: 8, ram_gb: 16, gpus: [], primary_gpu: null, recommendation: 'equilibrado' });
      }
    });
  });
});

ipcMain.handle('get-output-files', async (_, dirPath) => {
  try {
    if (!dirPath || !fs.existsSync(dirPath)) return [];
    const files = fs.readdirSync(dirPath);
    return files
      .filter((f) => f.endsWith('.txt') || f.endsWith('.srt') || f.endsWith('.vtt') || f.endsWith('.json'))
      .map((f) => ({
        path: path.join(dirPath, f),
        name: f,
        type: path.extname(f).replace('.', '')
      }));
  } catch (err) {
    console.error('Erro ao ler pasta de saida:', err);
    return [];
  }
});

ipcMain.handle('read-file', async (_, filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf-8');
    }
  } catch (err) {
    console.error('Erro ao ler arquivo:', err);
  }
  return '';
});

ipcMain.handle('open-path', async (_, targetPath) => {
  try {
    if (targetPath) {
      await shell.openPath(targetPath);
      return true;
    }
  } catch (err) {
    console.error('Erro ao abrir caminho:', err);
  }
  return false;
});

ipcMain.handle('get-logs', async () => {
  const appLogPath = path.join(LOGS_DIR, 'lauda.log');
  const workerLogPath = path.join(LOGS_DIR, 'lauda-worker.log');
  let appLog = '';
  let workerLog = '';
  try {
    if (fs.existsSync(appLogPath)) appLog = fs.readFileSync(appLogPath, 'utf-8');
    if (fs.existsSync(workerLogPath)) workerLog = fs.readFileSync(workerLogPath, 'utf-8');
  } catch {}
  return { appLog, workerLog };
});

ipcMain.handle('list-ollama-models', async () => {
  return new Promise((resolve) => {
    const python = getPythonPath();
    const script = `
import json
from lauda.summarize import list_models
try:
    models = list_models()
    print(json.dumps({"models": models, "available": True}))
except Exception as e:
    print(json.dumps({"models": [], "available": False}))
`;
    const proc = spawn(python, ['-c', script], { cwd: ROOT_DIR });
    let output = '';
    proc.stdout.on('data', (d) => { output += d.toString(); });
    proc.on('close', () => {
      try {
        resolve(JSON.parse(output.trim()));
      } catch {
        resolve({ models: [], available: false });
      }
    });
  });
});

ipcMain.handle('cancel-job', async () => {
  if (currentWorkerProcess) {
    try {
      currentWorkerProcess.kill('SIGTERM');
      currentWorkerProcess = null;
      return true;
    } catch {
      return false;
    }
  }
  return false;
});

ipcMain.handle('run-job', async (_, jobOptions) => {
  if (currentWorkerProcess) {
    return { success: false, error: 'Um trabalho já está em andamento.' };
  }

  const tempJobFile = path.join(os.tmpdir(), `lauda_job_${Date.now()}.json`);
  const tempResultFile = path.join(os.tmpdir(), `lauda_result_${Date.now()}.json`);

  const jobPayload = {
    options: jobOptions,
    result_path: tempResultFile,
    checkpoint_root: path.join(USER_LAUDA_DIR, 'checkpoints'),
    resume: true
  };

  fs.writeFileSync(tempJobFile, JSON.stringify(jobPayload, null, 2), 'utf-8');

  const python = getPythonPath();
  const proc = spawn(python, ['-m', 'lauda.worker', tempJobFile], {
    cwd: ROOT_DIR,
    env: { ...process.env, PYTHONUNBUFFERED: '1' }
  });

  currentWorkerProcess = proc;

  const rl = readline.createInterface({ input: proc.stdout });

  rl.on('line', (line) => {
    try {
      const event = JSON.parse(line.trim());
      if (event.t === 'progress') {
        mainWindow?.webContents.send('job-progress', event);
      } else if (event.t === 'done') {
        mainWindow?.webContents.send('job-done', event);
      } else if (event.t === 'error') {
        mainWindow?.webContents.send('job-error', event);
      }
    } catch {
      // Ignorar linhas nao JSON
    }
  });

  proc.on('close', (code) => {
    currentWorkerProcess = null;
    try {
      if (fs.existsSync(tempJobFile)) fs.unlinkSync(tempJobFile);
    } catch {}

    if (code !== 0 && code !== null) {
      mainWindow?.webContents.send('job-error', {
        t: 'error',
        message: `Processo finalizado com código ${code}`
      });
    }
  });

  return { success: true };
});
