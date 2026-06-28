import React, { useEffect, useState } from 'react';
import { triggerDataRefresh } from './GameLoop';

interface Player {
  id: string;
  name: string;
  score: number;
}

const PlayerList: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlayers = () => {
    setLoading(true);
    fetch('/api/players')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load players');
        return res.json();
      })
      .then(setPlayers)
      .catch((err: Error) => setError(err.message || 'Failed to load players'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPlayers();
    const handler = () => fetchPlayers();
    window.addEventListener('game-data-refresh', handler);
    return () => window.removeEventListener('game-data-refresh', handler);
  }, []);

  if (loading) return <div>Loading players...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Players</h2>
      <ul>
        {players.map((player) => (
          <li key={player.id}>
            {player.name} (Score: {player.score})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerList;