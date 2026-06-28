import React, { useEffect, useState } from 'react';

const AdminPanel: React.FC = () => {
  const [stats, setStats] = useState<any>({});
  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(setStats);
  }, []);
  return (
    <div>
      <h2>Admin Panel</h2>
      <pre>{JSON.stringify(stats, null, 2)}</pre>
      <button onClick={() => fetch('/api/admin/reset', { method: 'POST' })}>Reset Game</button>
    </div>
  );
};
export default AdminPanel;
