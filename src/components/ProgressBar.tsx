import React from 'react';

interface ProgressBarProps {
  stage: string;
  fraction: number;
  message: string;
  onCancel?: () => void;
}

const STAGE_LABELS: Record<string, string> = {
  probe: 'Analisando mídia',
  extract: 'Extraindo áudio WAV',
  vad: 'Verificando voz e volume',
  asr: 'Transcrevendo áudio (STT)',
  align: 'Alinhando palavras',
  diarize: 'Identificando falantes',
  summarize: 'Gerando resumo (Ollama)',
  visual: 'Gerando miniaturas de vídeo',
  render: 'Gerando relatórios e legendas',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  stage,
  fraction,
  message,
  onCancel,
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((fraction || 0) * 100)));
  const stageName = STAGE_LABELS[stage] || stage || 'Processando';

  return (
    <div className="bg-lauda-paper rounded-xl border border-lauda-line p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-lauda-accent uppercase tracking-wider">
            Etapa Atual: {stageName}
          </span>
          <p className="text-sm font-medium text-lauda-ink mt-0.5 truncate max-w-lg">
            {message || 'Aguarde o encerramento do processamento...'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-lauda-ink font-mono">{percentage}%</span>
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-3 py-1.5 bg-lauda-danger/10 text-lauda-danger hover:bg-lauda-danger/20 text-xs font-semibold rounded-lg transition-colors border border-lauda-danger/20"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>

      <div className="w-full bg-lauda-surface h-3 rounded-full overflow-hidden border border-lauda-line/60">
        <div
          className="bg-lauda-accent h-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
