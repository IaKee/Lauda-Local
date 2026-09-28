import React, { useState, useEffect } from 'react';
import { HistoryItem } from '../types';
import { FolderKanban, Trash2, ExternalLink, RefreshCw, FileAudio } from 'lucide-react';

export const FilesPage: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');

  const loadHistory = async () => {
    if (window.laudaAPI) {
      setLoading(true);
      try {
        const items = await window.laudaAPI.getHistory();
        setHistory(items);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleClearHistory = async () => {
    if (window.laudaAPI && confirm('Deseja realmente limpar todo o histórico?')) {
      await window.laudaAPI.clearHistory();
      setHistory([]);
    }
  };

  const handleOpenPath = (pathStr: string) => {
    if (window.laudaAPI) {
      window.laudaAPI.openPath(pathStr);
    }
  };

  const filteredItems = history.filter((item) =>
    (item.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.path || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-lauda-ink flex items-center gap-2">
            <FolderKanban className="w-4 h-4 text-lauda-accent" />
            Histórico de Trabalhos
          </h3>
          <p className="text-xs text-lauda-inkSoft">
            Lista dos últimos arquivos processados nesta máquina.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-lauda-button hover:bg-lauda-buttonActive text-lauda-ink text-xs font-semibold rounded-lg border border-lauda-line transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </button>
          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-lauda-danger/10 hover:bg-lauda-danger/20 text-lauda-danger text-xs font-semibold rounded-lg border border-lauda-danger/20 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar histórico</span>
            </button>
          )}
        </div>
      </div>

      <input
        type="text"
        placeholder="Buscar nos arquivos processados..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-lauda-field text-lauda-ink text-xs rounded-xl border border-lauda-line p-2.5 outline-none"
      />

      {filteredItems.length === 0 ? (
        <div className="bg-lauda-paper rounded-xl border border-lauda-line p-8 text-center text-xs text-lauda-inkSoft">
          Nenhum histórico registrado.
        </div>
      ) : (
        <div className="flex-1 overflow-auto space-y-2">
          {filteredItems.map((item, idx) => (
            <div
              key={idx}
              className="bg-lauda-paper border border-lauda-line rounded-xl p-4 flex items-center justify-between hover:border-lauda-muted transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-lauda-surface flex items-center justify-center border border-lauda-line">
                  <FileAudio className="w-4 h-4 text-lauda-accent" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-lauda-ink">{item.name || item.path}</h4>
                  <p className="text-[11px] text-lauda-inkSoft mt-0.5">
                    Modelo: <span className="font-mono text-lauda-accent">{item.model}</span> • Idioma: {item.language || 'auto'} • Processado em: {item.processed_at || 'Data desconhecida'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {item.output_dir && (
                  <button
                    onClick={() => handleOpenPath(item.output_dir)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-lauda-button hover:bg-lauda-buttonActive text-lauda-ink text-xs font-medium rounded-lg border border-lauda-line transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Abrir pasta</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
