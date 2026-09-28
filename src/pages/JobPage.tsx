import React, { useState } from 'react';
import { JobOptions, ProgressState } from '../types';
import { DropZone } from '../components/DropZone';
import { ProgressBar } from '../components/ProgressBar';
import { Play, Settings2, Sparkles, Users, FileText, FolderOpen } from 'lucide-react';

interface JobPageProps {
  progressState: ProgressState;
  onStartJob: (options: JobOptions) => void;
  onCancelJob: () => void;
  defaultOutputDir: string;
}

const PRESETS = [
  { id: 'equilibrado', name: 'Equilibrado (Recomendado)', model: 'large-v3-turbo', desc: 'Melhor relação entre velocidade e precisão.' },
  { id: 'rapido', name: 'Rápido', model: 'medium', desc: 'Processamento mais veloz para áudios longos.' },
  { id: 'maximo', name: 'Máximo', model: 'large-v3', desc: 'Maior precisão em termos complexos e sotaques.' },
];

export const JobPage: React.FC<JobPageProps> = ({
  progressState,
  onStartJob,
  onCancelJob,
  defaultOutputDir,
}) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [outputDir, setOutputDir] = useState<string>(defaultOutputDir);
  const [selectedPreset, setSelectedPreset] = useState<string>('equilibrado');
  const [model, setModel] = useState<string>('large-v3-turbo');
  const [language, setLanguage] = useState<string>('auto');
  const [diarize, setDiarize] = useState<boolean>(false);
  const [summarize, setSummarize] = useState<boolean>(false);
  const [cueDensity, setCueDensity] = useState<'curta' | 'equilibrada' | 'longa'>('equilibrada');
  const [initialPrompt, setInitialPrompt] = useState<string>('');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const handleSelectFile = async () => {
    if (window.laudaAPI) {
      const filePath = await window.laudaAPI.selectFile();
      if (filePath) setSelectedFile(filePath);
    }
  };

  const handleSelectFolder = async () => {
    if (window.laudaAPI) {
      const folderPath = await window.laudaAPI.selectFolder();
      if (folderPath) setOutputDir(folderPath);
    }
  };

  const handlePresetChange = (presetId: string, modelName: string) => {
    setSelectedPreset(presetId);
    setModel(modelName);
  };

  const handleRun = () => {
    if (!selectedFile) return;

    const options: JobOptions = {
      source_path: selectedFile,
      output_dir: outputDir,
      model: model,
      language: language === 'auto' ? null : language,
      device: 'auto',
      compute_type: 'auto',
      beam_size: 5,
      temperature: 0.0,
      diarize: diarize,
      summarize: summarize,
      visual: false,
      cue_density: cueDensity,
      initial_prompt: initialPrompt || undefined,
    };

    onStartJob(options);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* Active Job Progress */}
      {progressState.isProcessing && (
        <ProgressBar
          stage={progressState.stage}
          fraction={progressState.fraction}
          message={progressState.message}
          onCancel={onCancelJob}
        />
      )}

      {/* Media Selection */}
      <DropZone
        selectedPath={selectedFile}
        onSelectFile={handleSelectFile}
        onDropPath={(path) => setSelectedFile(path)}
      />

      {/* Preset Cards */}
      <div className="bg-lauda-paper rounded-xl border border-lauda-line p-5 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-lauda-ink flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-lauda-accent" />
          Modo de Processamento
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PRESETS.map((preset) => {
            const isSelected = selectedPreset === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handlePresetChange(preset.id, preset.model)}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-lauda-accent bg-lauda-accent/5 ring-1 ring-lauda-accent'
                    : 'border-lauda-line bg-lauda-surface hover:border-lauda-muted'
                }`}
              >
                <div>
                  <h4 className="font-bold text-xs text-lauda-ink">{preset.name}</h4>
                  <p className="text-[11px] text-lauda-inkSoft mt-1 leading-snug">{preset.desc}</p>
                </div>
                <span className="text-[10px] font-mono text-lauda-accent mt-3 block font-semibold">
                  {preset.model}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Configuration Section */}
      <div className="bg-lauda-paper rounded-xl border border-lauda-line p-5 shadow-sm space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Language selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-lauda-ink">Idioma do Áudio</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-lauda-field text-lauda-ink text-xs font-medium rounded-lg border border-lauda-line p-2.5 outline-none focus:border-lauda-accent"
            >
              <option value="auto">Detectar Automaticamente (Recomendado)</option>
              <option value="pt">Português (pt)</option>
              <option value="en">Inglês (en)</option>
              <option value="es">Espanhol (es)</option>
              <option value="fr">Francês (fr)</option>
              <option value="de">Alemão (de)</option>
              <option value="it">Italiano (it)</option>
            </select>
          </div>

          {/* Model selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-lauda-ink">Modelo Whisper</label>
            <select
              value={model}
              onChange={(e) => {
                setModel(e.target.value);
                setSelectedPreset('custom');
              }}
              className="w-full bg-lauda-field text-lauda-ink text-xs font-medium rounded-lg border border-lauda-line p-2.5 outline-none focus:border-lauda-accent"
            >
              <option value="large-v3-turbo">large-v3-turbo (Rápido + Raciocínio)</option>
              <option value="large-v3">large-v3 (Precisão máxima)</option>
              <option value="distil-large-v3">distil-large-v3 (Leve)</option>
              <option value="medium">medium (Leve e rápido)</option>
              <option value="small">small (Básico)</option>
              <option value="tiny">tiny (Ultra ultra rápido)</option>
            </select>
          </div>
        </div>

        {/* Features toggles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-lauda-line/60">
          <label className="flex items-center gap-3 p-3 rounded-lg border border-lauda-line bg-lauda-surface cursor-pointer hover:bg-lauda-surface/80">
            <input
              type="checkbox"
              checked={diarize}
              onChange={(e) => setDiarize(e.target.checked)}
              className="w-4 h-4 accent-lauda-accent rounded"
            />
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-lauda-accent" />
              <div>
                <span className="text-xs font-bold text-lauda-ink block">Identificar quem fala</span>
                <span className="text-[10px] text-lauda-inkSoft">Diarização de falantes (FALANTE 1, FALANTE 2)</span>
              </div>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-lg border border-lauda-line bg-lauda-surface cursor-pointer hover:bg-lauda-surface/80">
            <input
              type="checkbox"
              checked={summarize}
              onChange={(e) => setSummarize(e.target.checked)}
              className="w-4 h-4 accent-lauda-accent rounded"
            />
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-lauda-accent" />
              <div>
                <span className="text-xs font-bold text-lauda-ink block">Resumo com IA (Ollama)</span>
                <span className="text-[10px] text-lauda-inkSoft">Gera ata e pontos principais localmente</span>
              </div>
            </div>
          </label>
        </div>

        {/* Output Directory */}
        <div className="space-y-1.5 pt-2 border-t border-lauda-line/60">
          <label className="text-xs font-semibold text-lauda-ink">Pasta de Saída dos Arquivos</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={outputDir}
              onChange={(e) => setOutputDir(e.target.value)}
              className="flex-1 bg-lauda-field text-lauda-ink text-xs font-mono rounded-lg border border-lauda-line p-2.5 outline-none"
            />
            <button
              onClick={handleSelectFolder}
              className="px-3 py-2 bg-lauda-button hover:bg-lauda-buttonActive text-lauda-ink text-xs font-semibold rounded-lg border border-lauda-line flex items-center gap-1.5"
            >
              <FolderOpen className="w-4 h-4 text-lauda-accent" />
              <span>Alterar</span>
            </button>
          </div>
        </div>

        {/* Advanced Accordion */}
        <div className="pt-2 border-t border-lauda-line/60">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-xs font-semibold text-lauda-inkSoft hover:text-lauda-ink transition-colors"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>{showAdvanced ? 'Ocultar opções avançadas' : 'Sobre este arquivo (Glossário e Legendas)'}</span>
          </button>

          {showAdvanced && (
            <div className="mt-4 space-y-4 bg-lauda-surface p-4 rounded-xl border border-lauda-line">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-lauda-ink">Glossário (Nomes próprios, siglas, termos técnicos)</label>
                <textarea
                  value={initialPrompt}
                  onChange={(e) => setInitialPrompt(e.target.value)}
                  placeholder="Ex: Kubernetes, TensorFlow, Lauda Local..."
                  className="w-full bg-lauda-field text-lauda-ink text-xs rounded-lg border border-lauda-line p-2.5 h-20 outline-none resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-lauda-ink">Densidade das Legendas (.srt / .vtt)</label>
                <select
                  value={cueDensity}
                  onChange={(e) => setCueDensity(e.target.value as any)}
                  className="w-full bg-lauda-field text-lauda-ink text-xs font-medium rounded-lg border border-lauda-line p-2.5 outline-none"
                >
                  <option value="curta">Curta (Frases concisas por legenda)</option>
                  <option value="equilibrada">Equilibrada (Padrão para vídeos)</option>
                  <option value="longa">Longa (Blocos maiores de leitura)</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Start Button */}
      <div className="flex justify-end">
        <button
          onClick={handleRun}
          disabled={!selectedFile || progressState.isProcessing}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm shadow-md transition-all ${
            !selectedFile || progressState.isProcessing
              ? 'bg-lauda-muted text-lauda-inkSoft cursor-not-allowed opacity-60'
              : 'bg-lauda-primary hover:bg-lauda-primaryActive text-lauda-primaryText scale-100 hover:scale-[1.02]'
          }`}
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{progressState.isProcessing ? 'Processando...' : 'Iniciar Processamento'}</span>
        </button>
      </div>
    </div>
  );
};
