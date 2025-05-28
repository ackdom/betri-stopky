# PRD Analysis – Iteration 1

Below are clarifying questions based on the initial PRD. Please answer under each question. After your answers, I will review and iterate as needed.

---

## 1. Athlete Management

- You mention adding athletes via "empty row" or plus button. Should there be a maximum number of athletes?
  
  **Your answer:**
  No need for maximum, but cap it for something arbitrary like 30

- Should athlete names be required, or can they be left blank?
  
  **Your answer:**
  Yes, they should have atleast one character as name

- Can athletes be deleted after being added? If so, how?
  
  **Your answer:**

  yes before starting the stopwatch mode, when still in editing / reordering there should be trash icon on right of each row

- Should the app remember athletes between sessions, or is it always a fresh start?
  
  **Your answer:**
  very good question, yes. After each session I should be taken to new screen with atheletes remembered. but on this screen I need to have "clear all" button which delete all athletes. This server purpose of multiple runs for same group.

## 2. Start Modes

- For the "manual start" mode, is it always one-by-one, or can multiple athletes be started at once?
  
  **Your answer:**
  one by one 

- For the "automatic gap" mode, should the gap be configurable per athlete, or is it a global setting?
  
  **Your answer:**
  global setting

- What happens if the user wants to pause or stop the entire session mid-way?
  
  **Your answer:**
  no need for that, but I will go with your suggestion do not have any strong opinion on it. but my idea is global stop button should stop all stopwatches and there should be the summary button. and I will need to start new from summary. 

## 3. Stopwatch Controls

- Should each athlete's stopwatch support pause/resume, or only stop?
  
  **Your answer:**
  well pause resume is good. in most cases it will be only stop but human error can occur, so possibility to start again on tap is good :)

- Is there a need to record laps (intermediate times) for each athlete, or just the final time?
  
  **Your answer:**
  final time only, but keep this in mind, its good feature, keep somewhere feature list so the app is prepared for this.

- Should there be an "undo" for accidental starts/stops?
  
  **Your answer:**
  this should be done by the resume functionality i pressume or?

## 4. Summary Page

- Should the summary page show only the final times, or also the start order and any lap/intermediate times?
  
  **Your answer:**
  the summary should be by default in start order so it makes sense, but there should be view for order by time. the row number is good indicator for both scenarios. We do not care for intermediate times now 

- Should the summary be exportable (CSV, screenshot, etc.)?
  
  **Your answer:**
  Again functionality for next, but screenshot is perfect for first version. CSV for next 

- Should the summary persist if the user navigates away and returns?
  
  **Your answer:**
  is done easily then yes, if complicated for technologies then no.

## 5. Reset Functionality

- Should reset clear all athletes, or just the times?
  
  **Your answer:**

  as discussed above. on summary there should be "new timing" instead of reset and that will lead me to the first screen with athlene names prefilled and on this sscreen is reset to clear all rows

- Should there be a confirmation dialog before resetting?
  
  **Your answer:**

  Yes, dialog is fine 

## 6. Design & Feedback

- Are there specific Betri.cz colors or branding guidelines to follow?
  
  **Your answer:**

  black for text,  #E89800 for contrast / bold 
  white and #EDEDED for background 

- Should the haptic/visual feedback be optional (toggle in settings)?
  
  **Your answer:**
  nope, 

- Should the app support dark mode?
  
  **Your answer:**
  nope 

## 7. Technology

- Is authentication required, or is the app always anonymous?
  
  **Your answer:**
  always anon

- Should the app work offline (PWA)?
  
  **Your answer:**
  yes and there is no functionality which requires server

- Should there be any analytics or error reporting?
  
  **Your answer:**
  nope 

## 8. Documentation

- Should the documentation be in English only, or also in Czech?
  
  **Your answer:**
  english

- Should the documentation include screenshots or just text?
  
  **Your answer:**
  just text, markdown format

--- 