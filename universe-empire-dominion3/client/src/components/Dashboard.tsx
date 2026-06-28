import React, { useEffect, useState } from 'react';
import { triggerDataRefresh } from './GameLoop';

const Dashboard: React.FC = () => {
  const [players, setPlayers] = useState<any[]>([]);
  const fetchPlayers = () => {
    fetch('/api/players')
      .then(res => res.json())
      .then(setPlayers);
  };
  useEffect(() => {
    fetchPlayers();
    const handler = () => fetchPlayers();
    window.addEventListener('game-data-refresh', handler);
    return () => window.removeEventListener('game-data-refresh', handler);
  }, []);
  return (
    <div>
      <h2>Dashboard</h2>
      <ul>
        {players.map((player: any) => (
          <li key={player.id}>{player.name}: Score {player.score}</li>
        ))}
      </ul>
    </div>
  );
};
export default Dashboard;
