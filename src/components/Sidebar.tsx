import React from 'react';
import { PageKey } from '../types';
import {
  FileAudio,
  FileText,
  Terminal,
  AlignLeft,
  Subtitles,
  FolderKanban,
  Cpu,
  Settings,
  HelpCircle,
} from 'lucide-react';

interface SidebarProps {
  currentPage: PageKey;
  onPageChange: (page: PageKey) => void;
}

const NAV_ITEMS: { key: PageKey; label: string; icon: React.ElementType }[] = [
  { key: 'job', label: 'Novo trabalho', icon: FileAudio },
  { key: 'report', label: 'Relatório', icon: FileText },
  { key: 'log', label: 'Log', icon: Terminal },
  { key: 'transcript', label: 'Transcrição', icon: AlignLeft },
  { key: 'subtitles', label: 'Legendas', icon: Subtitles },
  { key: 'files', label: 'Arquivos', icon: FolderKanban },
  { key: 'limits', label: 'Desempenho', icon: Cpu },
  { key: 'settings', label: 'Configurações', icon: Settings },
  { key: 'help', label: 'Ajuda', icon: HelpCircle },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
  return (
    <aside className="w-44 bg-lauda-sidebar border-r border-lauda-line flex flex-col justify-between p-3 select-none h-full">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 px-3 py-3 mb-2 border-b border-lauda-line">
          <div className="w-7 h-7 rounded-lg bg-lauda-primary flex items-center justify-center text-white font-bold text-sm shadow-sm">
            L
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-tight text-lauda-ink leading-none">
              Lauda Local
            </h1>
            <span className="text-[10px] text-lauda-inkSoft font-medium">v0.10.0</span>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onPageChange(item.key)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-lauda-navActive text-lauda-accent shadow-sm border border-lauda-line/40'
                    : 'text-lauda-inkSoft hover:text-lauda-ink hover:bg-lauda-paper/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-lauda-accent' : 'text-lauda-inkSoft'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="px-3 py-2 text-[11px] text-lauda-inkSoft border-t border-lauda-line">
        Processamento local e privado
      </div>
    </aside>
  );
};
