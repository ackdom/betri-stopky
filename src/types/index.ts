export interface Athlete {
  id: string;
  name: string;
  order: number;
}

export interface TimerState {
  athleteId: string;
  startTime: number | null;
  pausedTime: number | null;
  totalPausedDuration: number;
  finalTime: number | null;
  isPaused: boolean;
  isRunning: boolean;
  splits: number[]; // Array of split times (ms)
}

export type StartMode = 'manual' | 'automatic';

export interface SessionConfig {
  startMode: StartMode;
  gapSeconds?: number; // Only for automatic mode
}

export interface SessionResult {
  athleteId: string;
  athleteName: string;
  startOrder: number;
  finalTime: number | null; // null means DNF
  splits?: number[]; // Array of split times (ms)
}

export type ViewMode = 'start-order' | 'time-order';
