import React from 'react';
import { FileTabsViewer } from '../components/FileTabsViewer';

interface TranscriptPageProps {
  outputDir: string;
}

export const TranscriptPage: React.FC<TranscriptPageProps> = ({ outputDir }) => {
  return (
    <div className="h-full flex flex-col space-y-4">
      <div>
        <h3 className="text-sm font-bold text-lauda-ink">Texto Corrido (.transcript.txt)</h3>
        <p className="text-xs text-lauda-inkSoft">
          Visualização do texto transcrito limpo em parágrafos contínuos.
        </p>
      </div>

      <div className="flex-1 min-h-[500px]">
        <FileTabsViewer
          outputDir={outputDir}
          fileExtensions={['.transcript.txt']}
          emptyMessage="Nenhum arquivo de transcrição (.transcript.txt) encontrado na pasta de saída."
        />
      </div>
    </div>
  );
};
