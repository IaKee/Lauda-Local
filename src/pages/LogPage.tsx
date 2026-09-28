import React, { useState, useEffect } from 'react';
import { Terminal, RefreshCw, Copy, Check } from 'lucide-react';

export const LogPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'app' | 'worker'>('worker');
  const [logs, setLogs] = useState<{ appLog: string; workerLog: string }>({ appLog: '', workerLog: '' });
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const fetchLogs = async () => {
    if (window.laudaAPI) {
      setLoading(true);
      try {
        const res = await window.laudaAPI.getLogs();
        setLogs(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const content = activeTab === 'worker' ? logs.workerLog : logs.appLog;

  const handleCopy = () => {
    if (content) {
      navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-lauda-ink flex items-center gap-2">
            <Terminal className="w-4 h-4 text-lauda-accent" />
            Logs do Sistema
          </h3>
          <p className="text-xs text-lauda-inkSoft">
            Registro em tempo real das operações da interface e do processo worker em Python.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchLogs}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-lauda-button hover:bg-lauda-buttonActive text-lauda-ink text-xs font-semibold rounded-lg border border-lauda-line transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-lauda-button hover:bg-lauda-buttonActive text-lauda-ink text-xs font-semibold rounded-lg border border-lauda-line transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-lauda-success" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiado!' : 'Copiar'}</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-lauda-line pb-2">
        <button
          onClick={() => setActiveTab('worker')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
            activeTab === 'worker'
              ? 'bg-lauda-accent text-lauda-primaryText border-lauda-accent'
              : 'bg-lauda-paper text-lauda-inkSoft hover:text-lauda-ink border-lauda-line'
          }`}
        >
          Processo Worker (lauda-worker.log)
        </button>
        <button
          onClick={() => setActiveTab('app')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
            activeTab === 'app'
              ? 'bg-lauda-accent text-lauda-primaryText border-lauda-accent'
              : 'bg-lauda-paper text-lauda-inkSoft hover:text-lauda-ink border-lauda-line'
          }`}
        >
          Interface (lauda.log)
        </button>
      </div>

      <div className="flex-1 min-h-[450px] bg-lauda-paper border border-lauda-line rounded-xl p-4 overflow-auto font-mono text-xs text-lauda-ink leading-relaxed whitespace-pre-wrap select-text shadow-inner">
        {content || 'Nenhum log registrado até o momento.'}
      </div>
    </div>
  );
};
