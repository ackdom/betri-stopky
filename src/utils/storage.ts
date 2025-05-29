import type { Athlete } from '../types/index';

const ATHLETES_KEY = 'betri-athletes';
const NAMES_KEY = 'betri-athlete-names';

export const storage = {
  saveAthletes: (athletes: Athlete[]) => {
    try {
      localStorage.setItem(ATHLETES_KEY, JSON.stringify(athletes));
    } catch (error) {
      console.error('Failed to save athletes:', error);
    }
  },

  loadAthletes: (): Athlete[] => {
    try {
      const saved = localStorage.getItem(ATHLETES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to load athletes:', error);
      return [];
    }
  },

  clearAthletes: () => {
    try {
      localStorage.removeItem(ATHLETES_KEY);
    } catch (error) {
      console.error('Failed to clear athletes:', error);
    }
  },

  saveAthleteName: (name: string) => {
    try {
      const saved = localStorage.getItem(NAMES_KEY);
      const names: string[] = saved ? JSON.parse(saved) : [];
      if (!names.includes(name)) {
        names.push(name);
        localStorage.setItem(NAMES_KEY, JSON.stringify(names));
      }
    } catch (error) {
      console.error('Failed to save athlete name:', error);
    }
  },

  loadAthleteNames: (): string[] => {
    try {
      const saved = localStorage.getItem(NAMES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to load athlete names:', error);
      return [];
    }
  },

  removeAthleteName: (name: string) => {
    try {
      const saved = localStorage.getItem(NAMES_KEY);
      let names: string[] = saved ? JSON.parse(saved) : [];
      names = names.filter((n) => n !== name);
      localStorage.setItem(NAMES_KEY, JSON.stringify(names));
    } catch (error) {
      console.error('Failed to remove athlete name:', error);
    }
  },
};
