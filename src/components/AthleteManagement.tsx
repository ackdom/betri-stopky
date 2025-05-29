import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Button,
  List,
  ListItem,
  Tooltip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from '@mui/icons-material';
import type { Athlete } from '../types/index';
import { texts } from '../config/texts';
import { storage } from '../utils/storage';
import CloseIcon from '@mui/icons-material/Close';

interface AthleteManagementProps {
  athletes: Athlete[];
  onAthletesChange: (athletes: Athlete[]) => void;
  onStartSession: () => void;
}

export const AthleteManagement: React.FC<AthleteManagementProps> = ({
  athletes,
  onAthletesChange,
  onStartSession,
}) => {
  const [newAthleteName, setNewAthleteName] = useState('');
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showNameError, setShowNameError] = useState(false);
  const [nameSuggestions, setNameSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    setNameSuggestions(storage.loadAthleteNames());
  }, []);

  const filteredSuggestions = nameSuggestions.filter(
    (name) =>
      newAthleteName.trim().length >= 2 &&
      name.toLowerCase().includes(newAthleteName.trim().toLowerCase()) &&
      !athletes.some((a) => a.name.toLowerCase() === name.toLowerCase())
  );

  const addAthlete = () => {
    if (newAthleteName.trim().length === 0) {
      setShowNameError(true);
      return;
    }
    setShowNameError(false);

    if (athletes.length >= 30) {
      return;
    }

    const newAthlete: Athlete = {
      id: Date.now().toString(),
      name: newAthleteName.trim(),
      order: athletes.length,
    };

    onAthletesChange([...athletes, newAthlete]);
    storage.saveAthleteName(newAthlete.name);
    setNameSuggestions(storage.loadAthleteNames());
    setNewAthleteName('');
    setShowSuggestions(false);
  };

  const removeAthlete = (id: string) => {
    const updated = athletes
      .filter((a) => a.id !== id)
      .map((a, index) => ({ ...a, order: index }));
    onAthletesChange(updated);
  };

  const moveAthlete = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= athletes.length) return;
    const reordered = [...athletes];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(newIndex, 0, moved);
    const updated = reordered.map((a, idx) => ({ ...a, order: idx }));
    onAthletesChange(updated);
  };

  const clearAllAthletes = () => {
    onAthletesChange([]);
    setShowClearDialog(false);
  };

  const canStartSession = athletes.length > 0;

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

      <Box sx={{ mb: 3, position: 'relative' }}>
        <Tooltip title="">
          <TextField
            fullWidth
            value={newAthleteName}
            onChange={(e) => {
              setNewAthleteName(e.target.value);
              if (showNameError) setShowNameError(false);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            onKeyPress={(e) => e.key === 'Enter' && addAthlete()}
            placeholder={texts.athleteManagement.athleteNamePlaceholder}
            disabled={athletes.length >= 30}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={addAthlete}
                  disabled={!newAthleteName.trim() || athletes.length >= 30}
                >
                  <AddIcon />
                </IconButton>
              ),
            }}
          />
        </Tooltip>
        {showSuggestions && filteredSuggestions.length > 0 && (
          <Paper
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              zIndex: 10,
              mt: 0.5,
              maxHeight: 200,
              overflowY: 'auto',
            }}
            elevation={3}
          >
            {filteredSuggestions.map((name) => (
              <Box
                key={name}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  px: 2,
                  py: 1,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
                onMouseDown={() => {
                  if (!athletes.some((a) => a.name.toLowerCase() === name.toLowerCase())) {
                    const newAthlete: Athlete = {
                      id: Date.now().toString(),
                      name,
                      order: athletes.length,
                    };
                    onAthletesChange([...athletes, newAthlete]);
                    storage.saveAthleteName(name);
                    setNameSuggestions(storage.loadAthleteNames());
                  }
                  setNewAthleteName('');
                  setShowSuggestions(false);
                }}
              >
                <Typography sx={{ flex: 1 }}>{name}</Typography>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    storage.removeAthleteName(name);
                    setNameSuggestions(storage.loadAthleteNames());
                  }}
                  aria-label="Remove suggestion"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Paper>
        )}
        {showNameError && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {texts.athleteManagement.addAthleteTooltip}
          </Alert>
        )}
        {athletes.length === 0 && (
          <Alert severity="info" sx={{ mt: 1 }}>
            Start by adding your athletes
          </Alert>
        )}
        {athletes.length > 0 && (
          <Alert severity="info" sx={{ mt: 1 }}>
            {texts.athleteManagement.previousListReady}
          </Alert>
        )}
        {athletes.length >= 30 && (
          <Typography variant="caption" color="error" sx={{ mt: 1 }}>
            {texts.athleteManagement.maxAthletesReached}
          </Typography>
        )}
      </Box>

      <List>
        {athletes.map((athlete, index) => (
          <ListItem
            key={athlete.id}
            sx={{
              mb: 1,
              bgcolor: 'background.paper',
              borderRadius: 1,
              userSelect: 'none',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography>{athlete.name}</Typography>
              </Box>
              <IconButton
                onClick={() => moveAthlete(index, 'up')}
                size="small"
                disabled={index === 0}
                aria-label="Move up"
              >
                <ArrowUpwardIcon />
              </IconButton>
              <IconButton
                onClick={() => moveAthlete(index, 'down')}
                size="small"
                disabled={index === athletes.length - 1}
                aria-label="Move down"
              >
                <ArrowDownwardIcon />
              </IconButton>
              <IconButton onClick={() => removeAthlete(athlete.id)} size="small">
                <DeleteIcon />
              </IconButton>
            </Box>
          </ListItem>
        ))}
      </List>

      <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
        {athletes.length > 0 && (
          <Button
            variant="outlined"
            onClick={() => setShowClearDialog(true)}
            color="error"
          >
            {texts.athleteManagement.clearAllButton}
          </Button>
        )}
        <Button
          variant="contained"
          onClick={onStartSession}
          disabled={!canStartSession}
          size="large"
        >
          {texts.startModes.startSession}
        </Button>
      </Box>

      <Dialog open={showClearDialog} onClose={() => setShowClearDialog(false)}>
        <DialogTitle>{texts.athleteManagement.clearAllButton}</DialogTitle>
        <DialogContent>
          <Typography>{texts.athleteManagement.clearAllConfirmation}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowClearDialog(false)}>
            {texts.common.cancel}
          </Button>
          <Button onClick={clearAllAthletes} color="error" variant="contained">
            {texts.common.confirm}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 