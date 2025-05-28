import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Alert,
  Tabs,
  Tab,
  Tooltip,
} from '@mui/material';
import type { SessionResult, ViewMode } from '../types';
import { texts } from '../config/texts';
import { formatTime } from '../utils/timer';

interface SessionSummaryProps {
  results: SessionResult[];
  onNewSession: () => void;
}

export const SessionSummary: React.FC<SessionSummaryProps> = ({
  results,
  onNewSession,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('start-order');

  const getSortedResults = () => {
    if (viewMode === 'start-order') {
      return [...results].sort((a, b) => a.startOrder - b.startOrder);
    }
    
    // Sort by time, DNF (null) at the end
    return [...results].sort((a, b) => {
      if (a.finalTime === null && b.finalTime === null) return 0;
      if (a.finalTime === null) return 1;
      if (b.finalTime === null) return -1;
      return a.finalTime - b.finalTime;
    });
  };

  const sortedResults = getSortedResults();

  const handleTabChange = (_: React.SyntheticEvent, newValue: ViewMode) => {
    setViewMode(newValue);
  };

  return (
    <Box sx={{ p: 2, maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <img 
          src="/logo.svg" 
          alt="Betri" 
          style={{ 
            height: 60, 
            maxWidth: '100%',
            objectFit: 'contain',
            marginBottom: 16 
          }} 
        />
        <Typography variant="h1">{texts.summary.title}</Typography>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={viewMode}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label={texts.summary.orderByStart} value="start-order" />
          <Tab label={texts.summary.orderByTime} value="time-order" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{texts.summary.position}</TableCell>
                  <TableCell>{texts.summary.name}</TableCell>
                  <TableCell align="right">{texts.summary.time}</TableCell>
                  <TableCell align="right">Splits</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedResults.map((result, index) => (
                  <TableRow key={result.athleteId}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{result.athleteName}</TableCell>
                    <TableCell align="right">
                      {result.finalTime !== null
                        ? formatTime(result.finalTime)
                        : texts.summary.didNotFinish}
                    </TableCell>
                    <TableCell align="right">
                      {result.splits && result.splits.length > 0 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          {result.splits.map((split, i) => (
                            <Typography
                              key={i}
                              variant="caption"
                              sx={{ color: '#E89800', fontFamily: 'monospace', lineHeight: 1.2 }}
                            >
                              {formatTime(split)}
                            </Typography>
                          ))}
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>

      <Alert severity="info" sx={{ mb: 3 }}>
        {texts.summary.screenshotHint}
      </Alert>

      <Alert severity="warning" sx={{ mb: 3 }}>
        {texts.summary.resultsLostWarning}
      </Alert>

      <Box sx={{ textAlign: 'center' }}>
        <Tooltip title={texts.summary.newTimingTooltip}>
          <Button
            variant="contained"
            size="large"
            onClick={onNewSession}
          >
            {texts.summary.newTiming}
          </Button>
        </Tooltip>
      </Box>
    </Box>
  );
}; 