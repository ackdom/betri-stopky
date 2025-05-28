export const texts = {
  // App metadata
  appName: 'Betri Stop Watch',
  appDescription:
    'A simple, responsive web app for timing swimmers and runners',

  // Athlete management
  athleteManagement: {
    addAthleteTooltip: 'Each athlete must have a name (at least 1 character).',
    athleteNamePlaceholder: 'Athlete name',
    previousListReady: 'You can edit, reorder, or clear all athletes below.',
    clearAllButton: 'Clear All Athletes',
    clearAllConfirmation:
      'Are you sure you want to remove all athletes? This action cannot be undone.',
    maxAthletesReached: 'Maximum 30 athletes allowed',
  },

  // Start modes
  startModes: {
    manualStart: 'Manual Start',
    manualStartDescription:
      "Start each athlete's timer one by one as they begin.",
    automaticGap: 'Automatic Gap',
    automaticGapDescription:
      "Each athlete's timer will start automatically after the selected gap.",
    gapSelectorLabel: 'Start next athlete every',
    gapSelectorSuffix: 'seconds',
    startSession: 'Start Session',
  },

  // Stopwatch controls
  stopwatch: {
    pauseTooltip:
      "Tap anywhere on the athlete's row to start, pause, or resume the timer.",
    resumeHelp:
      'If you accidentally stop a timer, you can resume it. The time will continue from where it left off.',
    pause: 'Pause',
    resume: 'Resume',
    stop: 'Stop',
    stopAll: 'See Results',
    stopAllRunning: 'Stop All',
    stopAllDisabled: 'Stop all running timers first to see results',
    nextAthleteIn: 'Next athlete starts in',
    startFirstAthlete: 'Start First Athlete',
    startFirstAthleteTooltip: 'Tap to start timing the first athlete',
    startNextAthlete: 'Start Next Athlete',
    startNextAthleteTooltip: 'Tap to start timing the next athlete',
    tapToStart: 'Tap to start',
    tapToResume: 'Tap to resume',
  },

  // Summary page
  summary: {
    title: 'Session Results',
    resultsInStartOrder:
      'Results are shown in the order athletes started. You can also view by finish time.',
    orderByStart: 'By Start Order',
    orderByTime: 'By Finish Time',
    screenshotHint: 'Take a screenshot to save or share your results.',
    resultsLostWarning: 'Note: Results will be lost if you leave this page.',
    newTiming: 'New Timing',
    newTimingTooltip: 'Start a new session with the same athletes.',
    position: 'Pos',
    name: 'Name',
    time: 'Time',
    didNotFinish: 'DNF',
  },

  // Common actions
  common: {
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    add: 'Add',
    start: 'Start',
    stop: 'Stop',
  },

  // Accessibility
  accessibility: {
    hapticFeedbackNote:
      "Haptic and visual feedback is always on for now. In future versions, you'll be able to turn it off in settings.",
  },

  // Errors
  errors: {
    nameRequired: 'Athlete name is required',
    minNameLength: 'Name must be at least 1 character',
  },
};
