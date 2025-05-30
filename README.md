# Betri Stop Watch

A simple, responsive web app for timing and lapping swimmers/runners. Users can add athletes, start/stop individual stopwatches, record splits, and view results. Designed for mobile-first use with PWA capabilities.

## Features

- **Athlete Management & Autocomplete**: Add up to 30 athletes with manual up/down reordering (no drag-and-drop), and benefit from local name autocomplete with memory and removal
- **Two Start Modes**: 
  - Manual Start: Start each athlete's timer individually
  - Automatic Gap: Timers start automatically with configurable delays (5/10/15/20/30 seconds)
- **Timer Controls**: Pause and resume individual timers (pausing is considered stopped for results)
- **Splits**: Record split times for each athlete during timing, view splits in a dedicated column on the summary page
- **Results Summary**: View results ordered by start position or finish time
- **Offline Support**: Works as a Progressive Web App (PWA)
- **Mobile-First Design**: Optimized for touch devices with haptic feedback

## How to Use the App

### 1. Adding Athletes
1. Enter athlete names in the input field
2. As you type, suggestions from previously entered names (local memory) appear in a dropdown
3. Click a suggestion to immediately add it as a new athlete
4. Each suggestion has an "X" icon to remove it from memory
5. Press Enter or click the + button to add a new name
6. Use up/down arrows to reorder athletes
7. Click the trash icon to remove an athlete
8. If you try to add an empty name, an error alert is shown

#### Athlete Name Autocomplete & Local Memory
- The app remembers all unique athlete names you've entered (stored in your browser)
- Suggestions appear as you type, excluding names already in your current list
- Click a suggestion to add it instantly
- Remove any suggestion from memory with the X icon
- Memory persists across sessions (unless you clear browser storage)

### 2. Starting a Session
1. After adding athletes, click "Start Session"
2. Choose between Manual Start or Automatic Gap mode
3. For Automatic Gap, select the delay between starts

### 3. Timing Athletes
- **Manual Mode**: Click play button for each athlete in sequence
- **Automatic Mode**: Start the first athlete, others follow automatically
- Tap a row to pause/resume a timer (pausing is considered stopped)
- The rightmost 25% of each athlete row is a **Split** button/area:
  - Tap to record a split (can be pressed multiple times)
  - If no splits: shows "Split" label
  - If splits: shows up to 3 most recent split times (top=first, bottom=last)
  - Button background is a lighter/opacity Betri orange
  - Pressing split triggers orange haptic/visual feedback
  - **Each split now shows the time between splits (interval), not total elapsed time.**
- The "See Results" button is only enabled when all timers are paused
- The "Back"/"Stop & Back" button is shown next to "See Results"

### 4. Viewing Results
- Results show in start order by default
- Toggle to view by finish time
- **Splits**: Each athlete's splits are shown in a dedicated "Splits" column (one per line, top=first, bottom=last)
- **Splits now show the interval (time between splits), not total elapsed time.**
- Take a screenshot to save results
- Click "New Timing" to start another session with the same athletes

## Code Structure

```
src/
├── components/          # React components
│   ├── AthleteManagement.tsx
│   ├── StartModeSelection.tsx
│   ├── Timer.tsx
│   ├── TimingSession.tsx
│   └── SessionSummary.tsx
├── config/             # Configuration files
│   └── texts.ts        # All UI text strings
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   ├── storage.ts      # LocalStorage management
│   ├── timer.ts        # Time formatting
│   └── feedback.ts     # Haptic/visual feedback
├── App.tsx             # Main app component
├── main.tsx            # App entry point
└── theme.ts            # Material UI theme
```

## Running Locally

### Prerequisites
- Node.js 18+ and npm
- Firebase CLI (for deployment)

### Installation
```bash
# Clone the repository
git clone [your-repo-url]
cd betri-chrono

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production
```bash
npm run build
```

The built files will be in the `dist/` directory.

## Deploying to Firebase Hosting

### Initial Setup
1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase project:
   ```bash
   firebase init hosting
   ```
   - Select or create a Firebase project
   - Use `dist` as the public directory
   - Configure as single-page app: Yes

### Deployment
```bash
# Deploy to production
npm run deploy

# Deploy to preview channel
npm run deploy:preview
```

### Manual Deployment
```bash
# Build the app
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

## Technologies Used

- **React** with TypeScript
- **Material UI** for components
- **Vite** for build tooling
- **Vite PWA Plugin** for offline support
- **Firebase Hosting** for deployment

## Future Features

- Lap/intermediate times for each athlete
- CSV export of results
- Dark mode support
- Settings for haptic feedback
