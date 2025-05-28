import React, { useState } from 'react';
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
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  DragIndicator as DragIcon,
} from '@mui/icons-material';
import type { Athlete } from '../types';
import { texts } from '../config/texts';

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
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const addAthlete = () => {
    if (newAthleteName.trim().length === 0) {
      return;
    }

    if (athletes.length >= 30) {
      return;
    }

    const newAthlete: Athlete = {
      id: Date.now().toString(),
      name: newAthleteName.trim(),
      order: athletes.length,
    };

    onAthletesChange([...athletes, newAthlete]);
    setNewAthleteName('');
  };

  const removeAthlete = (id: string) => {
    const updated = athletes
      .filter((a) => a.id !== id)
      .map((a, index) => ({ ...a, order: index }));
    onAthletesChange(updated);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const reordered = [...athletes];
    const [removed] = reordered.splice(draggedIndex, 1);
    reordered.splice(dropIndex, 0, removed);

    const updated = reordered.map((a, index) => ({ ...a, order: index }));
    onAthletesChange(updated);
    setDraggedIndex(null);
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

      {athletes.length > 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {texts.athleteManagement.previousListReady}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <Tooltip title={athletes.length === 0 ? '' : texts.athleteManagement.addAthleteTooltip}>
          <TextField
            fullWidth
            value={newAthleteName}
            onChange={(e) => setNewAthleteName(e.target.value)}
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
        {athletes.length === 0 && (
          <Alert severity="info" sx={{ mt: 1 }}>
            Start by adding your athletes
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
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            sx={{
              mb: 1,
              bgcolor: 'background.paper',
              borderRadius: 1,
              cursor: 'move',
            }}
          >
            <DragIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography>{athlete.name}</Typography>
            </Box>
            <IconButton onClick={() => removeAthlete(athlete.id)} size="small">
              <DeleteIcon />
            </IconButton>
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