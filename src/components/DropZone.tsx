import React, { useState } from 'react';
import { UploadCloud, FileAudio, Folder } from 'lucide-react';

interface DropZoneProps {
  selectedPath: string | null;
  onSelectFile: () => void;
  onSelectFolder?: () => void;
  onDropPath: (path: string) => void;
}

export const DropZone: React.FC<DropZoneProps> = ({
  selectedPath,
  onSelectFile,
  onSelectFolder,
  onDropPath,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      onDropPath((file as any).path || file.name);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
        isDragOver
          ? 'border-lauda-accent bg-lauda-accent/10'
          : 'border-lauda-line bg-lauda-surface hover:border-lauda-muted'
      }`}
    >
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 rounded-full bg-lauda-paper flex items-center justify-center shadow-sm border border-lauda-line">
          <UploadCloud className="w-6 h-6 text-lauda-accent" />
        </div>

        {selectedPath ? (
          <div className="flex flex-col items-center">
            <span className="text-xs font-semibold text-lauda-inkSoft uppercase tracking-wider">
              Arquivo Selecionado
            </span>
            <span className="font-bold text-sm text-lauda-ink break-all max-w-md mt-1">
              {selectedPath}
            </span>
          </div>
        ) : (
          <div>
            <h3 className="font-bold text-base text-lauda-ink">
              Arraste seu arquivo de áudio ou vídeo aqui
            </h3>
            <p className="text-xs text-lauda-inkSoft mt-1">
              Suporta MP4, MKV, AVI, MP3, WAV, M4A, FLAC, WEBM e outros formatos
            </p>
          </div>
        )}

        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={onSelectFile}
            className="flex items-center gap-2 px-4 py-2 bg-lauda-button hover:bg-lauda-buttonActive text-lauda-ink text-xs font-semibold rounded-lg transition-colors border border-lauda-line"
          >
            <FileAudio className="w-4 h-4 text-lauda-accent" />
            <span>Selecionar arquivo...</span>
          </button>

          {onSelectFolder && (
            <button
              onClick={onSelectFolder}
              className="flex items-center gap-2 px-4 py-2 bg-lauda-button hover:bg-lauda-buttonActive text-lauda-ink text-xs font-semibold rounded-lg transition-colors border border-lauda-line"
            >
              <Folder className="w-4 h-4 text-lauda-accent" />
              <span>Selecionar pasta...</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
