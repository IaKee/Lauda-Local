import { LaudaAPI } from '../electron/preload';

declare global {
  interface Window {
    laudaAPI?: LaudaAPI;
  }
}

export type PageKey =
  | 'job'
  | 'report'
  | 'log'
  | 'transcript'
  | 'subtitles'
  | 'files'
  | 'limits'
  | 'settings'
  | 'help';

export interface JobOptions {
  source_path: string;
  output_dir: string;
  model: string;
  language: string | null;
  device: string;
  compute_type: string;
  beam_size: number;
  temperature: number;
  diarize: boolean;
  num_speakers?: number | null;
  speaker_threshold?: number;
  diarize_backend?: string;
  summarize: boolean;
  visual: boolean;
  cue_density: 'curta' | 'equilibrada' | 'longa';
  initial_prompt?: string;
}

export interface ProgressState {
  isProcessing: boolean;
  stage: string;
  fraction: number;
  message: string;
  error?: string;
  doneResult?: string;
}

export interface HistoryItem {
  name: string;
  path: string;
  output_dir: string;
  processed_at: string;
  duration_seconds: number;
  language: string;
  model: string;
  device: string;
  status: string;
}

export interface OutputFileEntry {
  path: string;
  name: string;
  type: string;
}
