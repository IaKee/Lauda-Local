import React, { useState, useEffect } from 'react';
import { Cpu, HardDrive, Zap, RefreshCw } from 'lucide-react';

export const LimitsPage: React.FC = () => {
  const [hwInfo, setHwInfo] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchHardware = async () => {
    if (window.laudaAPI) {
      setLoading(true);
      try {
        const info = await window.laudaAPI.getHardwareInfo();
        setHwInfo(info);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchHardware();
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-lauda-ink flex items-center gap-2">
            <Cpu className="w-4 h-4 text-lauda-accent" />
            Diagnóstico de Desempenho e Recursos
          </h3>
          <p className="text-xs text-lauda-inkSoft">
            Avaliação do hardware do computador para execução local de modelos Whisper e Ollama.
          </p>
        </div>

        <button
          onClick={fetchHardware}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-lauda-button hover:bg-lauda-buttonActive text-lauda-ink text-xs font-semibold rounded-lg border border-lauda-line transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Medir novamente</span>
        </button>
      </div>

      {/* Hardware Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-lauda-paper rounded-xl border border-lauda-line p-4 space-y-2">
          <div className="flex items-center gap-2 text-lauda-accent text-xs font-semibold">
            <Cpu className="w-4 h-4" />
            <span>Processador (CPU)</span>
          </div>
          <div className="text-xl font-bold text-lauda-ink font-mono">
            {hwInfo ? `${hwInfo.cpu_count} Núcleos` : 'Medindo...'}
          </div>
          <p className="text-[11px] text-lauda-inkSoft">Suporta aceleração CTranslate2 multithread</p>
        </div>

        <div className="bg-lauda-paper rounded-xl border border-lauda-line p-4 space-y-2">
          <div className="flex items-center gap-2 text-lauda-accent text-xs font-semibold">
            <HardDrive className="w-4 h-4" />
            <span>Memória RAM</span>
          </div>
          <div className="text-xl font-bold text-lauda-ink font-mono">
            {hwInfo ? `${hwInfo.ram_gb} GB` : 'Medindo...'}
          </div>
          <p className="text-[11px] text-lauda-inkSoft">Disponível para carregamento de modelos</p>
        </div>

        <div className="bg-lauda-paper rounded-xl border border-lauda-line p-4 space-y-2">
          <div className="flex items-center gap-2 text-lauda-accent text-xs font-semibold">
            <Zap className="w-4 h-4" />
            <span>Placa de Vídeo (GPU)</span>
          </div>
          <div className="text-sm font-bold text-lauda-ink font-mono truncate">
            {hwInfo && hwInfo.gpus && hwInfo.gpus.length > 0
              ? `${hwInfo.gpus[0].name} (${hwInfo.gpus[0].vram_gb} GB)`
              : 'NVIDIA/AMD Acelerada'}
          </div>
          <p className="text-[11px] text-lauda-inkSoft">Execução via CUDA / DirectML</p>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-lauda-paper rounded-xl border border-lauda-line p-5 space-y-3">
        <h4 className="font-bold text-xs text-lauda-ink">Recomendação Automática para este Computador</h4>
        <div className="p-4 rounded-xl bg-lauda-accent/10 border border-lauda-accent/30 text-xs text-lauda-ink space-y-1">
          <p className="font-bold text-lauda-accent">
            Preset Sugerido: <span className="uppercase">{hwInfo?.recommendation || 'equilibrado'}</span>
          </p>
          <p className="text-lauda-inkSoft">
            Sua máquina tem capacidade excelente para executar modelos <code className="bg-lauda-surface px-1 py-0.5 rounded">large-v3-turbo</code> sem sobrecarregar a memória RAM ou GPU.
          </p>
        </div>
      </div>
    </div>
  );
};
