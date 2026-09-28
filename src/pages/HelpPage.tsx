import React from 'react';
import { HelpCircle, Shield, FileText, Command } from 'lucide-react';

export const HelpPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div>
        <h3 className="text-sm font-bold text-lauda-ink flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-lauda-accent" />
          Guia do Usuário e Documentação
        </h3>
        <p className="text-xs text-lauda-inkSoft">
          Orientações de uso do Lauda Local e regras fundamentais de arquitetura.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1 */}
        <div className="bg-lauda-paper rounded-xl border border-lauda-line p-5 space-y-3">
          <div className="flex items-center gap-2 text-lauda-accent text-xs font-bold">
            <Shield className="w-4 h-4" />
            <span>Regras Inquebráveis de Privacidade</span>
          </div>
          <ul className="text-xs text-lauda-inkSoft space-y-2 list-disc list-inside">
            <li><strong>Nada sai da sua máquina:</strong> Sem APIs pagas nem envio de arquivos para a nuvem.</li>
            <li><strong>Execução isolada:</strong> Seus arquivos de mídia são lidos exclusivamente pelo ffprobe/ffmpeg local.</li>
            <li><strong>Resumo local:</strong> O Ollama escuta apenas na interface local `127.0.0.1`.</li>
          </ul>
        </div>

        {/* Card 2 */}
        <div className="bg-lauda-paper rounded-xl border border-lauda-line p-5 space-y-3">
          <div className="flex items-center gap-2 text-lauda-accent text-xs font-bold">
            <FileText className="w-4 h-4" />
            <span>Estrutura do Laudo (.txt)</span>
          </div>
          <p className="text-xs text-lauda-inkSoft">
            Cada trabalho gera um laudo oficial determinístico composto por exatamente <strong>9 seções fixas</strong> (Metadados, Legenda SRT, Diagnósticos de Áudio, Transcrição, Cobertura, Identificação de Falantes, Pós-processamento e Resumo).
          </p>
        </div>
      </div>

      {/* Shortcuts */}
      <div className="bg-lauda-paper rounded-xl border border-lauda-line p-5 space-y-4">
        <h4 className="font-bold text-xs text-lauda-ink border-b border-lauda-line pb-2 flex items-center gap-2">
          <Command className="w-4 h-4 text-lauda-accent" />
          Atalhos Rápidos
        </h4>

        <div className="grid grid-cols-2 gap-3 text-xs text-lauda-ink">
          <div className="flex justify-between p-2 rounded bg-lauda-surface border border-lauda-line/60">
            <span>Abrir arquivo</span>
            <kbd className="font-mono bg-lauda-paper px-1.5 py-0.5 rounded border border-lauda-line">Ctrl + O</kbd>
          </div>
          <div className="flex justify-between p-2 rounded bg-lauda-surface border border-lauda-line/60">
            <span>Iniciar processamento</span>
            <kbd className="font-mono bg-lauda-paper px-1.5 py-0.5 rounded border border-lauda-line">Ctrl + Enter</kbd>
          </div>
          <div className="flex justify-between p-2 rounded bg-lauda-surface border border-lauda-line/60">
            <span>Alternar modo claro/escuro</span>
            <kbd className="font-mono bg-lauda-paper px-1.5 py-0.5 rounded border border-lauda-line">Ctrl + Shift + T</kbd>
          </div>
          <div className="flex justify-between p-2 rounded bg-lauda-surface border border-lauda-line/60">
            <span>Copiar texto</span>
            <kbd className="font-mono bg-lauda-paper px-1.5 py-0.5 rounded border border-lauda-line">Ctrl + C</kbd>
          </div>
        </div>
      </div>
    </div>
  );
};
