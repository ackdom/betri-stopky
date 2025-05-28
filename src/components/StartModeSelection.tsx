import React, { useState } from 'react';
import {
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  Button,
  Paper,
  FormControl,
  InputLabel,
} from '@mui/material';
import type { SessionConfig, StartMode } from '../types';
import { texts } from '../config/texts';

interface StartModeSelectionProps {
  onStartSession: (config: SessionConfig) => void;
  onBack: () => void;
}

export const StartModeSelection: React.FC<StartModeSelectionProps> = ({
  onStartSession,
  onBack,
}) => {
  const [startMode, setStartMode] = useState<StartMode>('manual');
  const [gapSeconds, setGapSeconds] = useState<number>(10);

  const handleStart = () => {
    const config: SessionConfig = {
      startMode,
      ...(startMode === 'automatic' && { gapSeconds }),
    };
    onStartSession(config);
  };

  return (
    <Box sx={{ p: 2, maxWidth: 600, mx: 'auto' }}>
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
        <Typography variant="h1">{texts.appName}</Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h2" sx={{ mb: 3 }}>
          Select Start Mode
        </Typography>

        <RadioGroup
          value={startMode}
          onChange={(e) => setStartMode(e.target.value as StartMode)}
        >
          <FormControlLabel
            value="manual"
            control={<Radio />}
            label={
              <Box>
                <Typography variant="h6">{texts.startModes.manualStart}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {texts.startModes.manualStartDescription}
                </Typography>
              </Box>
            }
            sx={{ mb: 2 }}
          />

          <FormControlLabel
            value="automatic"
            control={<Radio />}
            label={
              <Box>
                <Typography variant="h6">{texts.startModes.automaticGap}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {texts.startModes.automaticGapDescription}
                </Typography>
              </Box>
            }
          />
        </RadioGroup>

        {startMode === 'automatic' && (
          <Box sx={{ mt: 3, ml: 4 }}>
            <FormControl variant="outlined" size="small">
              <InputLabel>{texts.startModes.gapSelectorLabel}</InputLabel>
              <Select
                value={gapSeconds}
                onChange={(e) => setGapSeconds(e.target.value as number)}
                label={texts.startModes.gapSelectorLabel}
                sx={{ minWidth: 120 }}
              >
                <MenuItem value={5}>5 {texts.startModes.gapSelectorSuffix}</MenuItem>
                <MenuItem value={10}>10 {texts.startModes.gapSelectorSuffix}</MenuItem>
                <MenuItem value={15}>15 {texts.startModes.gapSelectorSuffix}</MenuItem>
                <MenuItem value={20}>20 {texts.startModes.gapSelectorSuffix}</MenuItem>
                <MenuItem value={30}>30 {texts.startModes.gapSelectorSuffix}</MenuItem>
              </Select>
            </FormControl>
          </Box>
        )}
      </Paper>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button variant="outlined" onClick={onBack}>
          Back
        </Button>
        <Button variant="contained" onClick={handleStart} size="large">
          {texts.common.start}
        </Button>
      </Box>
    </Box>
  );
}; 