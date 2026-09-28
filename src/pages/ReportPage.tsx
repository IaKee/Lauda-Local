import React from 'react';
import { FileTabsViewer } from '../components/FileTabsViewer';

interface ReportPageProps {
  outputDir: string;
}

export const ReportPage: React.FC<ReportPageProps> = ({ outputDir }) => {
  return (
    <div className="h-full flex flex-col space-y-4">
      <div>
        <h3 className="text-sm font-bold text-lauda-ink">Relatório Completo (.txt)</h3>
        <p className="text-xs text-lauda-inkSoft">
          Visualização do laudo de transcrição contendo as 9 seções fixas de análise.
        </p>
      </div>

      <div className="flex-1 min-h-[500px]">
        <FileTabsViewer
          outputDir={outputDir}
          fileExtensions={['.txt']}
          emptyMessage="Nenhum relatório (.txt) encontrado na pasta de saída."
        />
      </div>
    </div>
  );
};
