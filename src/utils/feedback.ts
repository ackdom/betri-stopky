export const triggerHapticFeedback = (type: 'start' | 'stop' | 'error') => {
  if ('vibrate' in navigator) {
    switch (type) {
      case 'start':
        navigator.vibrate(50); // Short vibration for start
        break;
      case 'stop':
        navigator.vibrate([50, 50, 50]); // Pattern for stop
        break;
      case 'error':
        navigator.vibrate(200); // Longer vibration for error
        break;
    }
  }
};

export const createVisualFeedback = (
  element: HTMLElement | null,
  type: 'start' | 'stop'
) => {
  if (!element) return;

  const color = type === 'start' ? '#4caf50' : '#f44336'; // Green for start, red for stop
  const originalBackground = element.style.background;

  element.style.background = color;
  element.style.transition = 'background 0.3s ease';

  setTimeout(() => {
    element.style.background = originalBackground;
  }, 300);
};
