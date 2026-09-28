import React, { useState, useEffect } from 'react';
import { PageKey, JobOptions, ProgressState } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { JobPage } from './pages/JobPage';
import { ReportPage } from './pages/ReportPage';
import { LogPage } from './pages/LogPage';
import { TranscriptPage } from './pages/TranscriptPage';
import { SubtitlesPage } from './pages/SubtitlesPage';
import { FilesPage } from './pages/FilesPage';
import { LimitsPage } from './pages/LimitsPage';
import { SettingsPage } from './pages/SettingsPage';
import { HelpPage } from './pages/HelpPage';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageKey>('job');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [defaultOutputDir, setDefaultOutputDir] = useState<string>('');
  const [progressState, setProgressState] = useState<ProgressState>({
    isProcessing: false,
    stage: 'probe',
    fraction: 0,
    message: '',
  });

  // Load user preferences
  useEffect(() => {
    if (window.laudaAPI) {
      window.laudaAPI.getPrefs().then((prefs) => {
        if (prefs?.theme === 'claro') {
          setDarkMode(false);
        } else {
          setDarkMode(true);
        }
        if (prefs?.options?.output_dir) {
          setDefaultOutputDir(prefs.options.output_dir);
        }
      });
    }
  }, []);

  // Update DOM class for dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Listen to Electron IPC worker job events
  useEffect(() => {
    if (!window.laudaAPI) return;

    const unsubProgress = window.laudaAPI.onJobProgress((event) => {
      setProgressState({
        isProcessing: true,
        stage: event.stage || 'probe',
        fraction: event.fraction || 0,
        message: event.message || '',
      });
    });

    const unsubDone = window.laudaAPI.onJobDone((result) => {
      setProgressState((prev) => ({
        ...prev,
        isProcessing: false,
        stage: 'render',
        fraction: 1.0,
        message: 'Concluído com sucesso!',
        doneResult: result.result,
      }));
    });

    const unsubError = window.laudaAPI.onJobError((error) => {
      setProgressState((prev) => ({
        ...prev,
        isProcessing: false,
        error: error.message || 'Ocorreu um erro no processamento.',
      }));
    });

    return () => {
      unsubProgress();
      unsubDone();
      unsubError();
    };
  }, []);

  const toggleTheme = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    if (window.laudaAPI) {
      window.laudaAPI.savePrefs({ theme: nextMode ? 'escuro' : 'claro' });
    }
  };

  const handleStartJob = async (options: JobOptions) => {
    if (!window.laudaAPI) return;

    setProgressState({
      isProcessing: true,
      stage: 'probe',
      fraction: 0.05,
      message: 'Iniciando o processo worker Python...',
    });

    const res = await window.laudaAPI.runJob(options);
    if (!res.success) {
      setProgressState({
        isProcessing: false,
        stage: 'probe',
        fraction: 0,
        message: '',
        error: res.error || 'Erro ao iniciar trabalho.',
      });
    }
  };

  const handleCancelJob = async () => {
    if (window.laudaAPI) {
      await window.laudaAPI.cancelJob();
      setProgressState({
        isProcessing: false,
        stage: 'probe',
        fraction: 0,
        message: 'Trabalho cancelado pelo usuário.',
      });
    }
  };

  const renderPageContent = () => {
    switch (currentPage) {
      case 'job':
        return (
          <JobPage
            progressState={progressState}
            onStartJob={handleStartJob}
            onCancelJob={handleCancelJob}
            defaultOutputDir={defaultOutputDir}
          />
        );
      case 'report':
        return <ReportPage outputDir={defaultOutputDir} />;
      case 'log':
        return <LogPage />;
      case 'transcript':
        return <TranscriptPage outputDir={defaultOutputDir} />;
      case 'subtitles':
        return <SubtitlesPage outputDir={defaultOutputDir} />;
      case 'files':
        return <FilesPage />;
      case 'limits':
        return <LimitsPage />;
      case 'settings':
        return <SettingsPage darkMode={darkMode} onToggleTheme={toggleTheme} />;
      case 'help':
        return <HelpPage />;
      default:
        return null;
    }
  };

  const PAGE_TITLES: Record<PageKey, string> = {
    job: 'Novo Trabalho',
    report: 'Relatórios Gerados',
    log: 'Logs do Sistema',
    transcript: 'Transcrição de Texto',
    subtitles: 'Legendas Temporizadas',
    files: 'Histórico de Arquivos',
    limits: 'Desempenho e Diagnóstico',
    settings: 'Configurações',
    help: 'Ajuda e Documentação',
  };

  return (
    <div className="flex h-screen w-screen bg-lauda-canvas text-lauda-ink overflow-hidden select-none">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header
          darkMode={darkMode}
          onToggleTheme={toggleTheme}
          title={PAGE_TITLES[currentPage]}
        />
        <main className="flex-1 p-6 overflow-auto bg-lauda-canvas">
          {renderPageContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
