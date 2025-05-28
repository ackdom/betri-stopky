import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  Paper,
  Tooltip,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
} from '@mui/icons-material';
import type { Athlete, SessionConfig, TimerState, SessionResult } from '../types';
import { texts } from '../config/texts';
import { Timer } from './Timer';
import { triggerHapticFeedback } from '../utils/feedback';

interface TimingSessionProps {
  athletes: Athlete[];
  config: SessionConfig;
  onSessionEnd: (results: SessionResult[]) => void;
}

export const TimingSession: React.FC<TimingSessionProps> = ({
  athletes,
  config,
  onSessionEnd,
}) => {
  const [timers, setTimers] = useState<Record<string, TimerState>>(() => {
    const initial: Record<string, TimerState> = {};
    athletes.forEach((athlete) => {
      initial[athlete.id] = {
        athleteId: athlete.id,
        startTime: null,
        pausedTime: null,
        totalPausedDuration: 0,
        finalTime: null,
        isPaused: false,
        isRunning: false,
      };
    });
    return initial;
  });

  const [nextAthleteIndex, setNextAthleteIndex] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const [feedbackTriggers, setFeedbackTriggers] = useState<Record<string, number>>({});

  useEffect(() => {
    // Cleanup countdown on unmount
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

  const startTimer = (athleteId: string) => {
    setTimers((prev) => ({
      ...prev,
      [athleteId]: {
        ...prev[athleteId],
        startTime: Date.now(),
        isRunning: true,
        isPaused: false,
      },
    }));

    // Handle automatic mode
    if (config.startMode === 'automatic' && config.gapSeconds) {
      const currentIndex = athletes.findIndex((a) => a.id === athleteId);
      const nextIndex = currentIndex + 1;

      if (nextIndex < athletes.length) {
        setNextAthleteIndex(nextIndex);
        setCountdown(config.gapSeconds);

        let timeRemaining = config.gapSeconds;
        countdownRef.current = setInterval(() => {
          timeRemaining -= 1;
          setCountdown(timeRemaining);

          if (timeRemaining <= 0) {
            if (countdownRef.current) {
              clearInterval(countdownRef.current);
            }
            setCountdown(null);
            const nextAthlete = athletes[nextIndex];
            startTimer(nextAthlete.id);
          }
        }, 1000);
      }
    }
  };

  const pauseTimer = (athleteId: string) => {
    setTimers((prev) => ({
      ...prev,
      [athleteId]: {
        ...prev[athleteId],
        pausedTime: Date.now(),
        isPaused: true,
      },
    }));
  };

  const resumeTimer = (athleteId: string) => {
    setTimers((prev) => {
      const timer = prev[athleteId];
      const pauseDuration = timer.pausedTime ? Date.now() - timer.pausedTime : 0;
      return {
        ...prev,
        [athleteId]: {
          ...timer,
          totalPausedDuration: timer.totalPausedDuration + pauseDuration,
          pausedTime: null,
          isPaused: false,
        },
      };
    });
  };

  const stopAllTimers = () => {
    // Stop countdown if active
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      setCountdown(null);
    }

    // Stop all timers that have been started
    const updatedTimers = { ...timers };
    Object.keys(updatedTimers).forEach((athleteId) => {
      const timer = updatedTimers[athleteId];
      if (timer.startTime && timer.finalTime === null) {
        let finalTime = 0;
        if (timer.isPaused && timer.pausedTime) {
          finalTime = timer.pausedTime - timer.startTime - timer.totalPausedDuration;
        } else {
          finalTime = Date.now() - timer.startTime - timer.totalPausedDuration;
        }
        updatedTimers[athleteId] = {
          ...timer,
          finalTime,
          isRunning: false,
          isPaused: false,
        };
      }
    });

    // Create results
    const results: SessionResult[] = athletes.map((athlete) => ({
      athleteId: athlete.id,
      athleteName: athlete.name,
      startOrder: athlete.order,
      finalTime: updatedTimers[athlete.id].finalTime,
    }));

    onSessionEnd(results);
  };

  const canStartTimer = (athleteId: string) => {
    if (config.startMode === 'manual') {
      // In manual mode, start sequentially
      const athleteIndex = athletes.findIndex((a) => a.id === athleteId);
      if (athleteIndex === 0) return true;
      
      // Check if previous athlete has started
      const prevAthlete = athletes[athleteIndex - 1];
      return timers[prevAthlete.id].startTime !== null;
    }
    
    // In automatic mode, only the first athlete can be started manually
    return athletes[0].id === athleteId;
  };

  const hasAnyTimerStarted = Object.values(timers).some((t) => t.startTime !== null);

  const getNextAthleteToStart = () => {
    return athletes.find((athlete) => !timers[athlete.id].startTime);
  };

  const hasAnyActivelyRunningTimer = () => {
    return Object.values(timers).some((timer) => 
      timer.isRunning && !timer.isPaused
    );
  };

  const nextAthleteToStart = getNextAthleteToStart();

  return (
    <Box sx={{ p: 2, maxWidth: 800, mx: 'auto', pb: 10 }}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h2">{texts.appName}</Typography>
      </Box>

      {config.startMode === 'automatic' && (
        (countdown !== null ? (
          <Paper sx={{ p: 2, mb: 3, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
            <Typography variant="h6">
              {texts.stopwatch.nextAthleteIn} {countdown}s
            </Typography>
            <Typography variant="body2">
              {athletes[nextAthleteIndex]?.name}
            </Typography>
          </Paper>
        ) : (
          // Show banner if all athletes have started
          athletes.every(a => timers[a.id].startTime !== null) && (
            <Paper sx={{ p: 2, mb: 3, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
              <Typography variant="h6">
                All athletes started
              </Typography>
            </Paper>
          )
        ))
      )}

      <Box sx={{ mb: 3 }}>
        {athletes.map((athlete) => (
          <Timer
            key={athlete.id}
            athlete={athlete}
            timerState={timers[athlete.id]}
            onStart={() => startTimer(athlete.id)}
            onPause={() => pauseTimer(athlete.id)}
            onResume={() => resumeTimer(athlete.id)}
            canStart={canStartTimer(athlete.id)}
            triggerFeedback={feedbackTriggers[athlete.id]}
          />
        ))}
      </Box>

      {hasAnyTimerStarted && (
        <Box sx={{ textAlign: 'center', mb: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            color="error"
            size="large"
            onClick={() => {
              if (hasAnyTimerStarted) {
                if (window.confirm('Are you sure you want to stop and go back? All timing data will be lost.')) {
                  window.location.reload();
                }
              } else {
                window.location.reload();
              }
            }}
            sx={{ minWidth: 160, maxWidth: 220, px: 3 }}
          >
            {hasAnyTimerStarted ? 'Stop & Back' : 'Back'}
          </Button>
          <Tooltip 
            title={hasAnyActivelyRunningTimer() ? 'Pause all running timers first' : 'View session results'}
            arrow
            placement="top"
          >
            <span>
              <Button
                variant="contained"
                color="primary"
                size="large"
                disabled={hasAnyActivelyRunningTimer()}
                onClick={() => {
                  stopAllTimers();
                }}
                sx={{ minWidth: 160, maxWidth: 220, px: 3 }}
              >
                {texts.stopwatch.stopAll}
              </Button>
            </span>
          </Tooltip>
        </Box>
      )}

      {!hasAnyTimerStarted && (
        <Box sx={{ textAlign: 'center', mb: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            color="error"
            size="large"
            onClick={() => window.location.reload()}
            sx={{ minWidth: 160, maxWidth: 220, px: 3 }}
          >
            Back
          </Button>
        </Box>
      )}

      {/* Show tooltips below table and buttons before timing starts */}
      {!hasAnyTimerStarted && (
        <Box sx={{ mt: 2 }}>
          <Alert severity="info" sx={{ mb: 1 }}>
            {texts.stopwatch.pauseTooltip}
          </Alert>
          <Alert severity="info">
            {texts.stopwatch.resumeHelp}
          </Alert>
        </Box>
      )}

      {/* Sticky bottom button for manual mode */}
      {config.startMode === 'manual' && nextAthleteToStart && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            p: 2,
            bgcolor: 'background.paper',
            borderTop: 1,
            borderColor: 'divider',
            boxShadow: '0 -2px 8px rgba(0,0,0,0.1)',
            zIndex: 1000,
          }}
        >
          <Box sx={{ maxWidth: 800, mx: 'auto', textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<PlayIcon />}
              onClick={() => {
                triggerHapticFeedback('start');
                // Trigger visual feedback on the athlete row
                setFeedbackTriggers(prev => ({
                  ...prev,
                  [nextAthleteToStart.id]: Date.now()
                }));
                startTimer(nextAthleteToStart.id);
                // Update nextAthleteIndex for manual mode
                const newIndex = athletes.findIndex(a => a.id === nextAthleteToStart.id) + 1;
                setNextAthleteIndex(newIndex);
              }}
              sx={{ minWidth: 200 }}
            >
              {nextAthleteToStart.id === athletes[0].id 
                ? texts.stopwatch.startFirstAthlete 
                : texts.stopwatch.startNextAthlete}
            </Button>
          </Box>
        </Box>
      )}

      {/* Sticky bottom button for automatic mode - only before session starts */}
      {config.startMode === 'automatic' && !hasAnyTimerStarted && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            p: 2,
            bgcolor: 'background.paper',
            borderTop: 1,
            borderColor: 'divider',
            boxShadow: '0 -2px 8px rgba(0,0,0,0.1)',
            zIndex: 1000,
          }}
        >
          <Box sx={{ maxWidth: 800, mx: 'auto', textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<PlayIcon />}
              onClick={() => {
                triggerHapticFeedback('start');
                startTimer(athletes[0].id);
              }}
              sx={{ minWidth: 200 }}
            >
              {texts.stopwatch.startFirstAthlete}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}; 