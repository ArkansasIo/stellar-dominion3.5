import React, { useEffect, useState, useCallback } from 'react';
import { triggerDataRefresh } from './GameLoop';

interface Ship {
  id: string;
  type: string;
  ownerId: string;
  location: string;
}

interface Sector {
  id: string;
  name?: string;
}

const ShipList: React.FC = () => {
  const [ships, setShips] = useState<Ship[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [moving, setMoving] = useState<string | null>(null);
  const [moveTarget, setMoveTarget] = useState<{ [shipId: string]: string }>({});

  const fetchShips = useCallback(() => {
    fetch('/api/ships')
      .then(res => res.json())
      .then(setShips)
      .catch(err => console.error('Failed to fetch ships:', err));
  }, []);

  const fetchSectors = useCallback(() => {
    fetch('/api/universe')
      .then(res => res.json())
      .then(data => setSectors(Object.values(data) as Sector[]))
      .catch(err => console.error('Failed to fetch sectors:', err));
  }, []);

  const moveShip = useCallback((shipId: string) => {
    const targetSector = moveTarget[shipId];
    if (!targetSector) return;
    setMoving(shipId);
    fetch(`/api/ships/${shipId}/move`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sectorId: targetSector })
    })
      .then(() => {
        setMoving(null);
        setMoveTarget(prev => {
          const next = { ...prev };
          delete next[shipId];
          return next;
        });
        triggerDataRefresh();
        fetchShips();
      })
      .catch(err => {
        console.error('Failed to move ship:', err);
        setMoving(null);
      });
  }, [moveTarget, fetchShips]);

  useEffect(() => {
    fetchShips();
    fetchSectors();
    const handler = () => {
      fetchShips();
      fetchSectors();
    };
    window.addEventListener('game-data-refresh', handler);
    return () => window.removeEventListener('game-data-refresh', handler);
  }, [fetchShips, fetchSectors]);

  return (
    <div>
      <h2>Ships</h2>
      <ul>
        {ships.map(ship => (
          <li key={ship.id}>
            {ship.type} (Owner: {ship.ownerId}) - Location: {ship.location}
            <select
              value={moveTarget[ship.id] || ''}
              onChange={e => setMoveTarget({ ...moveTarget, [ship.id]: e.target.value })}
              disabled={moving === ship.id}
            >
              <option value=''>Select sector</option>
              {sectors.map(sector => (
                <option key={sector.id} value={sector.id}>{sector.id}</option>
              ))}
            </select>
            <button
              disabled={moving === ship.id || !moveTarget[ship.id]}
              onClick={() => moveShip(ship.id)}
            >
              {moving === ship.id ? 'Moving...' : 'Move'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShipList;