import { contextBridge, ipcRenderer } from 'electron';

export interface LaudaAPI {
  selectFile: (filters?: { name: string; extensions: string[] }[]) => Promise<string | null>;
  selectFolder: () => Promise<string | null>;
  getHardwareInfo: () => Promise<any>;
  getPrefs: () => Promise<any>;
  savePrefs: (prefs: any) => Promise<boolean>;
  getHistory: () => Promise<any[]>;
  clearHistory: () => Promise<boolean>;
  getOutputFiles: (dirPath: string) => Promise<{ path: string; name: string; type: string }[]>;
  readFile: (filePath: string) => Promise<string>;
  openPath: (path: string) => Promise<boolean>;
  runJob: (options: any) => Promise<{ success: boolean; jobId?: string; error?: string }>;
  cancelJob: () => Promise<boolean>;
  onJobProgress: (callback: (event: any) => void) => () => void;
  onJobDone: (callback: (result: any) => void) => () => void;
  onJobError: (callback: (error: any) => void) => () => void;
  getLogs: () => Promise<{ appLog: string; workerLog: string }>;
  listOllamaModels: () => Promise<{ models: string[]; available: boolean }>;
}

const api: LaudaAPI = {
  selectFile: (filters) => ipcRenderer.invoke('select-file', filters),
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  getHardwareInfo: () => ipcRenderer.invoke('get-hardware-info'),
  getPrefs: () => ipcRenderer.invoke('get-prefs'),
  savePrefs: (prefs) => ipcRenderer.invoke('save-prefs', prefs),
  getHistory: () => ipcRenderer.invoke('get-history'),
  clearHistory: () => ipcRenderer.invoke('clear-history'),
  getOutputFiles: (dirPath) => ipcRenderer.invoke('get-output-files', dirPath),
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
  openPath: (path) => ipcRenderer.invoke('open-path', path),
  runJob: (options) => ipcRenderer.invoke('run-job', options),
  cancelJob: () => ipcRenderer.invoke('cancel-job'),
  onJobProgress: (callback) => {
    const listener = (_: any, data: any) => callback(data);
    ipcRenderer.on('job-progress', listener);
    return () => ipcRenderer.removeListener('job-progress', listener);
  },
  onJobDone: (callback) => {
    const listener = (_: any, data: any) => callback(data);
    ipcRenderer.on('job-done', listener);
    return () => ipcRenderer.removeListener('job-done', listener);
  },
  onJobError: (callback) => {
    const listener = (_: any, data: any) => callback(data);
    ipcRenderer.on('job-error', listener);
    return () => ipcRenderer.removeListener('job-error', listener);
  },
  getLogs: () => ipcRenderer.invoke('get-logs'),
  listOllamaModels: () => ipcRenderer.invoke('list-ollama-models'),
};

contextBridge.exposeInMainWorld('laudaAPI', api);
