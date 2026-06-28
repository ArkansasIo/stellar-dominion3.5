import React, { useState } from 'react';
import { triggerDataRefresh } from './GameLoop';

const Shipyard: React.FC = () => {
  const [type, setType] = useState('Fighter');
  const [building, setBuilding] = useState(false);
  const buildShip = () => {
    setBuilding(true);
    fetch('/api/ships', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type })
    })
      .then(() => {
        setBuilding(false);
        triggerDataRefresh();
      });
  };
  return (
    <div>
      <h2>Shipyard</h2>
      <label>
        Ship Type:
        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="Fighter">Fighter</option>
          <option value="Bomber">Bomber</option>
          <option value="Transport">Transport</option>
        </select>
      </label>
      <button disabled={building} onClick={buildShip}>
        {building ? 'Building...' : 'Build Ship'}
      </button>
    </div>
  );
};
export default Shipyard;
