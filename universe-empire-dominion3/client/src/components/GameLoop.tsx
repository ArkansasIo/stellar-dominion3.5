import React, { useEffect } from 'react';

// Simple global event for data refresh
export const triggerDataRefresh = () => {
  window.dispatchEvent(new Event('game-data-refresh'));
};

const GameLoop: React.FC = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      triggerDataRefresh();
      console.log('Game tick: UI data refresh triggered');
    }, 10000);
    return () => clearInterval(interval);
  }, []);
  return null;
};
export default GameLoop;
