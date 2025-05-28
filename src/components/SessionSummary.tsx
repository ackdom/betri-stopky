import React, { useState, useRef } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
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
  const [csvDialogOpen, setCsvDialogOpen] = useState(false);
  const [csvFileName, setCsvFileName] = useState(() => {
    const d = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `-` + pad(d.getDate()) + '-' + pad(d.getMonth() + 1) + '-' + d.getFullYear() + `.csv`;
  });
  const fileNameInputRef = useRef<HTMLInputElement>(null);

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

  // CSV export logic
  const getMaxSplits = () => Math.max(0, ...results.map(r => r.splits ? r.splits.length : 0));
  const getCsvRows = () => {
    const maxSplits = getMaxSplits();
    const header = ['Position', 'Name', 'Time'];
    for (let i = 1; i <= maxSplits; ++i) header.push(`Split${i}`);
    const rows = [header];
    const sorted = viewMode === 'start-order'
      ? [...results].sort((a, b) => a.startOrder - b.startOrder)
      : [...results].sort((a, b) => {
          if (a.finalTime === null && b.finalTime === null) return 0;
          if (a.finalTime === null) return 1;
          if (b.finalTime === null) return -1;
          return a.finalTime - b.finalTime;
        });
    sorted.forEach((r, idx) => {
      const row = [
        (idx + 1).toString(),
        r.athleteName,
        r.finalTime !== null ? formatTime(r.finalTime) : 'DNF',
      ];
      const splits = r.splits || [];
      for (let i = 0; i < maxSplits; ++i) {
        row.push(splits[i] !== undefined ? formatTime(splits[i]) : '');
      }
      rows.push(row);
    });
    return rows;
  };
  const downloadCsv = () => {
    const rows = getCsvRows();
    const csv = rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', csvFileName.startsWith('-') ? 'session' + csvFileName : csvFileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

      <Box sx={{ textAlign: 'center', mb: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Tooltip title={texts.summary.exportCsvTooltip}>
          <Button variant="outlined" color="primary" onClick={() => setCsvDialogOpen(true)}>
            {texts.summary.exportCsv}
          </Button>
        </Tooltip>
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

      <Dialog open={csvDialogOpen} onClose={() => setCsvDialogOpen(false)}>
        <DialogTitle>{texts.summary.exportCsvDialogTitle}</DialogTitle>
        <DialogContent>
          <TextField
            inputRef={fileNameInputRef}
            autoFocus
            margin="dense"
            label={texts.summary.exportCsvFileNameLabel}
            fullWidth
            value={csvFileName}
            onChange={e => setCsvFileName(e.target.value)}
            onFocus={e => {
              // Place cursor at start
              e.target.setSelectionRange(0, 0);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCsvDialogOpen(false)}>{texts.common.cancel}</Button>
          <Button
            onClick={() => {
              setCsvDialogOpen(false);
              downloadCsv();
            }}
            variant="contained"
          >
            {texts.summary.exportCsvConfirm}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 