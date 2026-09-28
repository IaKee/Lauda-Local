import React, { useState, useEffect } from 'react';
import { OutputFileEntry } from '../types';
import { FileText, Copy, ExternalLink, RefreshCw, Check } from 'lucide-react';

interface FileTabsViewerProps {
  outputDir: string;
  fileExtensions: string[]; // e.g. ['.txt'] or ['.srt', '.vtt']
  emptyMessage: string;
  allowBackfill?: boolean;
}

export const FileTabsViewer: React.FC<FileTabsViewerProps> = ({
  outputDir,
  fileExtensions,
  emptyMessage,
}) => {
  const [files, setFiles] = useState<OutputFileEntry[]>([]);
  const [activeFile, setActiveFile] = useState<OutputFileEntry | null>(null);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const loadFiles = async () => {
    if (!window.laudaAPI) return;
    setLoading(true);
    try {
      const outputFiles = await window.laudaAPI.getOutputFiles(outputDir);
      const filtered = outputFiles.filter((f) =>
        fileExtensions.some((ext) => f.name.endsWith(ext))
      );
      setFiles(filtered);
      if (filtered.length > 0 && (!activeFile || !filtered.some((f) => f.path === activeFile.path))) {
        setActiveFile(filtered[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, [outputDir]);

  useEffect(() => {
    if (activeFile && window.laudaAPI) {
      window.laudaAPI.readFile(activeFile.path).then((text) => setContent(text));
    } else {
      setContent('');
    }
  }, [activeFile]);

  const handleCopy = () => {
    if (content) {
      navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenFolder = () => {
    if (window.laudaAPI && outputDir) {
      window.laudaAPI.openPath(outputDir);
    }
  };

  if (files.length === 0) {
    return (
      <div className="bg-lauda-paper rounded-xl border border-lauda-line p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-lauda-surface mx-auto flex items-center justify-center border border-lauda-line">
          <FileText className="w-6 h-6 text-lauda-inkSoft" />
        </div>
        <div>
          <p className="text-sm font-medium text-lauda-ink">{emptyMessage}</p>
          <p className="text-xs text-lauda-inkSoft mt-1">
            Pasta atual: <code className="bg-lauda-surface px-1.5 py-0.5 rounded text-[11px]">{outputDir}</code>
          </p>
        </div>
        <button
          onClick={loadFiles}
          className="inline-flex items-center gap-2 px-4 py-2 bg-lauda-button hover:bg-lauda-buttonActive text-lauda-ink text-xs font-semibold rounded-lg transition-colors border border-lauda-line"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Atualizar pasta</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Tab bar */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto border-b border-lauda-line pb-2">
        <div className="flex items-center gap-1 overflow-x-auto">
          {files.map((file) => {
            const isActive = activeFile?.path === file.path;
            return (
              <button
                key={file.path}
                onClick={() => setActiveFile(file)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-lauda-accent text-lauda-primaryText border-lauda-accent shadow-sm'
                    : 'bg-lauda-paper text-lauda-inkSoft hover:text-lauda-ink border-lauda-line'
                }`}
              >
                {file.name}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-lauda-button hover:bg-lauda-buttonActive text-lauda-ink text-xs font-medium rounded-lg border border-lauda-line transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-lauda-success" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiado!' : 'Copiar'}</span>
          </button>
          <button
            onClick={handleOpenFolder}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-lauda-button hover:bg-lauda-buttonActive text-lauda-ink text-xs font-medium rounded-lg border border-lauda-line transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Abrir pasta</span>
          </button>
        </div>
      </div>

      {/* Content viewer */}
      <div className="flex-1 bg-lauda-paper border border-lauda-line rounded-xl p-4 overflow-auto font-mono text-xs text-lauda-ink leading-relaxed whitespace-pre-wrap select-text shadow-inner">
        {content || 'Carregando conteúdo...'}
      </div>
    </div>
  );
};
