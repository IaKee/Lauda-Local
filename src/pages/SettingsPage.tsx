import React, { useState, useEffect } from 'react';
import { Settings, Save, Check, Bot } from 'lucide-react';

interface SettingsPageProps {
  darkMode: boolean;
  onToggleTheme: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ darkMode, onToggleTheme }) => {
  const [ollamaModels, setOllamaModels] = useState<string[]>([]);
  const [selectedOllamaModel, setSelectedOllamaModel] = useState<string>('qwen3:14b');
  const [ollamaAvailable, setOllamaAvailable] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);

  useEffect(() => {
    if (window.laudaAPI) {
      window.laudaAPI.listOllamaModels().then((res) => {
        setOllamaAvailable(res.available);
        setOllamaModels(res.models);
        if (res.models.length > 0) setSelectedOllamaModel(res.models[0]);
      });
    }
  }, []);

  const handleSave = async () => {
    if (window.laudaAPI) {
      await window.laudaAPI.savePrefs({
        theme: darkMode ? 'escuro' : 'claro',
        ollama_model: selectedOllamaModel,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div>
        <h3 className="text-sm font-bold text-lauda-ink flex items-center gap-2">
          <Settings className="w-4 h-4 text-lauda-accent" />
          Configurações do Aplicativo
        </h3>
        <p className="text-xs text-lauda-inkSoft">
          Preferências persistentes salvas em <code className="bg-lauda-surface px-1.5 py-0.5 rounded text-[11px]">~/.lauda/ui.json</code>.
        </p>
      </div>

      {/* Appearance */}
      <div className="bg-lauda-paper rounded-xl border border-lauda-line p-5 shadow-sm space-y-4">
        <h4 className="font-bold text-xs text-lauda-ink border-b border-lauda-line pb-2">Aparência</h4>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-lauda-ink block">Tema da Interface</span>
            <span className="text-[11px] text-lauda-inkSoft">Escolha entre modo claro ou escuro</span>
          </div>
          <button
            onClick={onToggleTheme}
            className="px-4 py-2 bg-lauda-button hover:bg-lauda-buttonActive text-lauda-ink text-xs font-semibold rounded-lg border border-lauda-line transition-colors"
          >
            {darkMode ? 'Modo Escuro (Ativo)' : 'Modo Claro (Ativo)'}
          </button>
        </div>
      </div>

      {/* Ollama Configuration */}
      <div className="bg-lauda-paper rounded-xl border border-lauda-line p-5 shadow-sm space-y-4">
        <h4 className="font-bold text-xs text-lauda-ink border-b border-lauda-line pb-2 flex items-center gap-2">
          <Bot className="w-4 h-4 text-lauda-accent" />
          Resumo Inteligente com Ollama (BL-21)
        </h4>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-lauda-ink">Modelo Ollama para Resumos</label>
            <span className={`text-[10px] font-bold ${ollamaAvailable ? 'text-lauda-success' : 'text-lauda-danger'}`}>
              {ollamaAvailable ? '● Ollama Detectado Localmente' : '○ Ollama não detectado em localhost:11434'}
            </span>
          </div>

          <select
            value={selectedOllamaModel}
            onChange={(e) => setSelectedOllamaModel(e.target.value)}
            className="w-full bg-lauda-field text-lauda-ink text-xs font-medium rounded-lg border border-lauda-line p-2.5 outline-none"
          >
            {ollamaModels.length > 0 ? (
              ollamaModels.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))
            ) : (
              <option value="qwen3:14b">qwen3:14b (Padrão)</option>
            )}
          </select>
          <p className="text-[11px] text-lauda-inkSoft">
            Listagem dinâmica dos modelos instalados no Ollama local sem requisição externa.
          </p>
        </div>
      </div>

      {/* Save Action */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 bg-lauda-primary hover:bg-lauda-primaryActive text-lauda-primaryText font-bold text-xs rounded-xl shadow-md transition-all"
        >
          {saved ? <Check className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
          <span>{saved ? 'Salvo com sucesso!' : 'Salvar Configurações'}</span>
        </button>
      </div>
    </div>
  );
};
