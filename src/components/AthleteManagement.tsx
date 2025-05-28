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
import {
  DragDropContext,
  Droppable,
  Draggable,
} from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';

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

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from(athletes);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    const updated = reordered.map((a, index) => ({ ...a, order: index }));
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
          <>
            <Alert severity="info" sx={{ mt: 1 }}>
              Start by adding your athletes
            </Alert>
            <Alert severity="info" sx={{ mt: 1 }}>
              {texts.athleteManagement.addAthleteTooltip}
            </Alert>
          </>
        )}
        {athletes.length >= 30 && (
          <Typography variant="caption" color="error" sx={{ mt: 1 }}>
            {texts.athleteManagement.maxAthletesReached}
          </Typography>
        )}
      </Box>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="athlete-list">
          {(provided) => (
            <List ref={provided.innerRef} {...provided.droppableProps}>
              {athletes.map((athlete, index) => (
                <Draggable key={athlete.id} draggableId={athlete.id} index={index}>
                  {(provided, snapshot) => (
                    <ListItem
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      sx={{
                        mb: 1,
                        bgcolor: snapshot.isDragging ? 'action.selected' : 'background.paper',
                        borderRadius: 1,
                        cursor: 'grab',
                        boxShadow: snapshot.isDragging ? 3 : 0,
                        touchAction: 'auto',
                        userSelect: 'none',
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
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>

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