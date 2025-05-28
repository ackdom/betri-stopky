import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tooltip,
} from '@mui/material';
import type { TimerState, Athlete } from '../types';
import { texts } from '../config/texts';
import { formatTime } from '../utils/timer';
import { triggerHapticFeedback, createVisualFeedback } from '../utils/feedback';

interface TimerProps {
  athlete: Athlete;
  timerState: TimerState;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  canStart: boolean;
  triggerFeedback?: number; // Timestamp to trigger external feedback
}

export const Timer: React.FC<TimerProps> = ({
  athlete,
  timerState,
  onStart,
  onPause,
  onResume,
  canStart,
  triggerFeedback,
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const paperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (timerState.isRunning && !timerState.isPaused && timerState.startTime) {
      interval = setInterval(() => {
        const elapsed = Date.now() - timerState.startTime! - timerState.totalPausedDuration;
        setCurrentTime(elapsed);
      }, 10); // Update every 10ms for smooth display
    } else if (timerState.finalTime !== null) {
      setCurrentTime(timerState.finalTime);
    } else if (timerState.isPaused && timerState.pausedTime && timerState.startTime) {
      const elapsed = timerState.pausedTime - timerState.startTime - timerState.totalPausedDuration;
      setCurrentTime(elapsed);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerState]);

  // Effect to trigger external feedback
  useEffect(() => {
    if (triggerFeedback && paperRef.current) {
      createVisualFeedback(paperRef.current, 'start');
    }
  }, [triggerFeedback]);

  const handleRowClick = () => {
    if (!timerState.isRunning && timerState.finalTime === null && canStart) {
      // Start timer
      triggerHapticFeedback('start');
      createVisualFeedback(paperRef.current, 'start');
      onStart();
    } else if (timerState.isRunning && !timerState.isPaused) {
      // Pause timer
      triggerHapticFeedback('stop');
      createVisualFeedback(paperRef.current, 'stop');
      onPause();
    } else if (timerState.isPaused) {
      // Resume timer
      triggerHapticFeedback('start');
      createVisualFeedback(paperRef.current, 'start');
      onResume();
    }
  };

  const getCursorStyle = () => {
    if (timerState.finalTime !== null) return 'default';
    if (!timerState.isRunning && !canStart) return 'not-allowed';
    return 'pointer';
  };

  const getTooltipText = () => {
    if (!timerState.isRunning && timerState.finalTime === null && canStart) {
      return texts.stopwatch.tapToStart;
    }
    if (timerState.isRunning && !timerState.isPaused) {
      return texts.stopwatch.pause;
    }
    if (timerState.isPaused) {
      return texts.stopwatch.tapToResume;
    }
    return '';
  };

  const tooltipText = getTooltipText();

  return (
    <Tooltip 
      title={tooltipText} 
      arrow 
      placement="top"
      PopperProps={{
        sx: {
          '& .MuiTooltip-tooltip': {
            fontSize: '0.875rem',
          },
        },
      }}
    >
      <Paper
        ref={paperRef}
        onClick={handleRowClick}
        sx={{
          p: 2,
          mb: 2,
          transition: 'all 0.3s ease',
          backgroundColor: timerState.finalTime !== null ? 'action.hover' : 'background.paper',
          cursor: getCursorStyle(),
          '&:hover': {
            backgroundColor: timerState.finalTime !== null ? 'action.hover' : 'action.hover',
          },
          opacity: !canStart && !timerState.isRunning ? 0.6 : 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {athlete.name}
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontFamily: 'monospace',
                color: timerState.isRunning && !timerState.isPaused ? 'primary.main' : 'text.primary',
                mt: 1,
              }}
            >
              {formatTime(currentTime)}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Tooltip>
  );
}; 