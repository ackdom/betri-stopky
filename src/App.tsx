import { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import type { Athlete, SessionConfig, SessionResult } from './types';
import { theme } from './theme';
import { storage } from './utils/storage';
import { AthleteManagement } from './components/AthleteManagement';
import { StartModeSelection } from './components/StartModeSelection';
import { TimingSession } from './components/TimingSession';
import { SessionSummary } from './components/SessionSummary';

type AppScreen = 'athlete-management' | 'start-mode' | 'timing' | 'summary';

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('athlete-management');
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [sessionConfig, setSessionConfig] = useState<SessionConfig | null>(null);
  const [sessionResults, setSessionResults] = useState<SessionResult[]>([]);

  useEffect(() => {
    // Load saved athletes on mount
    const saved = storage.loadAthletes();
    if (saved.length > 0) {
      setAthletes(saved);
    }
  }, []);

  const handleAthletesChange = (newAthletes: Athlete[]) => {
    setAthletes(newAthletes);
    storage.saveAthletes(newAthletes);
  };

  const handleStartModeSelected = (config: SessionConfig) => {
    setSessionConfig(config);
    setCurrentScreen('timing');
  };

  const handleSessionEnd = (results: SessionResult[]) => {
    setSessionResults(results);
    setCurrentScreen('summary');
  };

  const handleNewSession = () => {
    // Keep athletes for new session
    setSessionConfig(null);
    setSessionResults([]);
    setCurrentScreen('athlete-management');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {currentScreen === 'athlete-management' && (
        <AthleteManagement
          athletes={athletes}
          onAthletesChange={handleAthletesChange}
          onStartSession={() => setCurrentScreen('start-mode')}
        />
      )}
      {currentScreen === 'start-mode' && (
        <StartModeSelection
          onStartSession={handleStartModeSelected}
          onBack={() => setCurrentScreen('athlete-management')}
        />
      )}
      {currentScreen === 'timing' && sessionConfig && (
        <TimingSession
          athletes={athletes}
          config={sessionConfig}
          onSessionEnd={handleSessionEnd}
        />
      )}
      {currentScreen === 'summary' && (
        <SessionSummary
          results={sessionResults}
          onNewSession={handleNewSession}
        />
      )}
    </ThemeProvider>
  );
}

export default App;
