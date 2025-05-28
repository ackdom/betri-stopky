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
  onSplit: () => void;
  canStart: boolean;
  triggerFeedback?: number; // Timestamp to trigger external feedback
}

export const Timer: React.FC<TimerProps> = ({
  athlete,
  timerState,
  onStart,
  onPause,
  onResume,
  onSplit,
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

  // Split area logic
  const splitTimes = timerState.splits;
  const lastSplits = splitTimes.slice(-3); // Up to 3 most recent

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
        id={`timer-row-${athlete.id}`}
        sx={{
          p: 0,
          mb: 2,
          transition: 'all 0.3s ease',
          backgroundColor: timerState.finalTime !== null ? 'action.hover' : 'background.paper',
          cursor: getCursorStyle(),
          '&:hover': {
            backgroundColor: timerState.finalTime !== null ? 'action.hover' : 'action.hover',
          },
          opacity: !canStart && !timerState.isRunning ? 0.6 : 1,
          display: 'flex',
          alignItems: 'stretch',
        }}
      >
        {/* Main timer area (75%) */}
        <Box
          onClick={handleRowClick}
          sx={{
            flex: '0 0 75%',
            p: 2,
            display: 'flex',
            alignItems: 'center',
            minWidth: 0,
          }}
        >
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
        {/* Split area (25%) */}
        <Box
          onClick={(e) => {
            e.stopPropagation();
            onSplit();
          }}
          sx={{
            flex: '0 0 25%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(232, 152, 0, 0.15)', // Lighter Betri orange
            cursor: 'pointer',
            borderLeft: '2px solid #E89800',
            minHeight: 64,
            userSelect: 'none',
          }}
        >
          {lastSplits.length === 0 ? (
            <Typography variant="button" sx={{ color: '#E89800', opacity: 0.7 }}>
              Split
            </Typography>
          ) : (
            lastSplits.map((split, idx) => (
              <Typography
                key={idx}
                variant="caption"
                sx={{ color: '#E89800', opacity: 0.9, fontFamily: 'monospace', lineHeight: 1.2 }}
              >
                {formatTime(split)}
              </Typography>
            ))
          )}
        </Box>
      </Paper>
    </Tooltip>
  );
}; 