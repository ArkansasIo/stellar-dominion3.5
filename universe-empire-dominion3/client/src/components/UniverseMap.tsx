import React, { useEffect, useState } from 'react';
import { triggerDataRefresh } from './GameLoop';

const UniverseMap: React.FC = () => {
  const [sectors, setSectors] = useState<any[]>([]);
  const [claiming, setClaiming] = useState<string | null>(null);
  const fetchSectors = () => {
    fetch('/api/universe')
      .then(res => res.json())
      .then(data => setSectors(Object.values(data)));
  };
  const claimPlanet = (sectorId: string, planetId: string) => {
    setClaiming(planetId);
    fetch(`/api/planets/${planetId}/claim`, { method: 'POST' })
      .then(() => {
        setClaiming(null);
        triggerDataRefresh();
      });
  };
  useEffect(() => {
    fetchSectors();
    const handler = () => fetchSectors();
    window.addEventListener('game-data-refresh', handler);
    return () => window.removeEventListener('game-data-refresh', handler);
  }, []);
  return (
    <div>
      <h2>Universe Map</h2>
      <ul>
        {sectors.map(sector => (
          <li key={sector.id}>
            {sector.id} (Coords: {sector.coordinates})
            <ul>
              {(sector.planets || []).map((planet: any) => (
                <li key={planet.id}>
                  {planet.id} - Owner: {planet.ownerId || 'Unowned'}
                  {planet.ownerId ? null : (
                    <button
                      disabled={claiming === planet.id}
                      onClick={() => claimPlanet(sector.id, planet.id)}
                    >
                      {claiming === planet.id ? 'Claiming...' : 'Claim'}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default UniverseMap;
