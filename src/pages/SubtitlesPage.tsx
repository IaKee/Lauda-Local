import React from 'react';
import { FileTabsViewer } from '../components/FileTabsViewer';

interface SubtitlesPageProps {
  outputDir: string;
}

export const SubtitlesPage: React.FC<SubtitlesPageProps> = ({ outputDir }) => {
  return (
    <div className="h-full flex flex-col space-y-4">
      <div>
        <h3 className="text-sm font-bold text-lauda-ink">Legendas (.srt / .vtt)</h3>
        <p className="text-xs text-lauda-inkSoft">
          Visualização dos arquivos de legendas temporizadas gerados pelo motor.
        </p>
      </div>

      <div className="flex-1 min-h-[500px]">
        <FileTabsViewer
          outputDir={outputDir}
          fileExtensions={['.srt', '.vtt']}
          emptyMessage="Nenhum arquivo de legenda (.srt ou .vtt) encontrado na pasta de saída."
          allowBackfill={true}
        />
      </div>
    </div>
  );
};
