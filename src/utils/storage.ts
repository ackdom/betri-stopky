import type { Athlete } from '../types/index';

const ATHLETES_KEY = 'betri-athletes';

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
};
