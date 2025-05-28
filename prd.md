# Betri Stop Watch – Product Requirements Document

## Overview
A simple, responsive web app for timing and lapping swimmers/runners. Users can add athletes, start/stop individual stopwatches, and view results. Designed for mobile-first use and easy deployment to Firebase Hosting.

---

## 1. Athlete Management
- Users can add up to 30 athletes via an "empty row" or plus button.
- Each athlete must have a name (minimum 1 character).
  - Tooltip/help: "Each athlete must have a name (at least 1 character)."
- Athletes can be reordered before starting the session.
- Athletes can be deleted (trash icon on the right of each row) before starting the stopwatch mode.
- After a session, the app remembers the list of athletes for the next session. On the new session screen, a "clear all" button deletes all athletes.
  - UI text: "Your previous athlete list is ready. You can edit, reorder, or clear all athletes below."
  - Button: "Clear All Athletes"

---

## 2. Start Modes
- Two modes: Manual Start and Automatic Gap.
  - **Manual Start:** User starts each athlete's stopwatch one by one (always sequential, not multiple at once).
    - UI text: "Start each athlete's timer one by one as they begin."
  - **Automatic Gap:** User sets a global gap (5/10/15/20/30 seconds) between athlete starts. The next athlete's stopwatch starts automatically after the gap.
    - UI text: "Each athlete's timer will start automatically after the selected gap."
    - Gap selector label: "Start next athlete every [dropdown] seconds"
- A global stop button stops all stopwatches and brings the user to the summary page. New sessions are started from the summary page.

---

## 3. Stopwatch Controls
- Each athlete's stopwatch supports pause, resume, and stop.
  - Tooltip: "Pause or resume this athlete's timer. Stopping will record their final time."
- Only the final time is recorded for each athlete (no laps/intermediate times in v1).
- Resume functionality covers accidental stops/starts (no separate undo button).
  - Help text: "If you accidentally stop a timer, you can resume it. The time will continue from where it left off. (There is no full undo for stop actions.)"

---

## 4. Summary Page
- After stopping, the summary page displays all athletes and their times.
- Default view: athletes in their original start order.
  - UI text: "Results are shown in the order athletes started. You can also view by finish time."
- Option to view athletes ordered by time (fastest to slowest).
  - Switch view button: "Order by Start" / "Order by Time"
- Row number is shown for both views.
- Export: User can take a screenshot of the summary (CSV export is a future feature).
  - UI text: "Take a screenshot to save or share your results."
- If technically easy, the summary persists if the user navigates away and returns; otherwise, this is not required.
  - Info: "Note: Results will be lost if you leave this page."

---

## 5. Reset & New Session
- On the summary page, a "New Timing" button leads to the first screen with athlete names prefilled.
  - Tooltip: "Start a new session with the same athletes."
- On the athlete entry screen, a "Clear All" button resets all rows.
  - Button: "Clear All Athletes"
  - Confirmation dialog: "Are you sure you want to remove all athletes? This action cannot be undone."
- Confirmation dialog appears before clearing all athletes.

---

## 6. Design & Feedback
- Colors: Black for text, #E89800 for contrast/bold, white and #EDEDED for background.
- Use logo.svg from the root folder.
- Haptic/visual feedback (e.g., green/red flash across the screen or row) when starting/stopping a stopwatch. This is always enabled (no toggle).
  - Accessibility note (future): "Haptic and visual feedback is always on for now. In future versions, you'll be able to turn it off in settings."
- No dark mode required.

---

## 7. Technology
- Simple React app (Next.js allowed if it simplifies development).
- Mobile-first, responsive design.
- Use Material UI for UI components.
- No authentication; always anonymous use.
- Works offline (PWA). No server-side functionality required.
- No analytics or error reporting.
- Ready for Firebase Hosting deployment; include deployment script.
- All user-facing texts in the app must be managed in a configuration file for easy translation and management. No hardcoded UI/help text.

---

## 8. Documentation
- Documentation in English only, in markdown format.
- Should include:
  - How to use the app
  - How the code is structured
  - How to run locally
  - How to deploy to Firebase Hosting
- No screenshots required.

---

## 9. Future Features
- Laps/intermediate times for each athlete.
- CSV export of summary results.

---



