export const triggerHapticFeedback = (
  type: 'start' | 'stop' | 'error' | 'split'
) => {
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
      case 'split':
        navigator.vibrate(30); // Short, distinct for split
        break;
    }
  }
};

export const createVisualFeedback = (
  element: HTMLElement | null,
  type: 'start' | 'stop' | 'split'
) => {
  if (!element) return;
  let color = '';
  switch (type) {
    case 'start':
      color = 'rgba(76, 175, 80, 0.25)'; // Green
      break;
    case 'stop':
      color = 'rgba(244, 67, 54, 0.25)'; // Red
      break;
    case 'split':
      color = 'rgba(232, 152, 0, 0.25)'; // Betri orange, lighter
      break;
  }
  const original = element.style.boxShadow;
  element.style.boxShadow = `0 0 0 100vw ${color} inset`;
  setTimeout(() => {
    element.style.boxShadow = original;
  }, 200);
};
