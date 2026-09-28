import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  onToggleTheme: () => void;
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ darkMode, onToggleTheme, title }) => {
  return (
    <header className="h-14 px-6 border-b border-lauda-line bg-lauda-canvas flex items-center justify-between">
      <h2 className="text-lg font-bold text-lauda-ink tracking-tight">{title}</h2>
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleTheme}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-lauda-button hover:bg-lauda-buttonActive text-lauda-ink transition-colors border border-lauda-line/50"
          title="Alternar tema da interface"
        >
          {darkMode ? <Sun className="w-3.5 h-3.5 text-lauda-accent" /> : <Moon className="w-3.5 h-3.5 text-lauda-accent" />}
          <span>{darkMode ? 'Modo claro' : 'Modo escuro'}</span>
        </button>
      </div>
    </header>
  );
};
