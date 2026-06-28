import React, { useEffect, useState } from 'react';

const EventLog: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const fetchEvents = () => {
    fetch('/api/events')
      .then(res => res.json())
      .then(setEvents);
  };
  useEffect(() => {
    fetchEvents();
    const handler = () => fetchEvents();
    window.addEventListener('game-data-refresh', handler);
    return () => window.removeEventListener('game-data-refresh', handler);
  }, []);
  return (
    <div>
      <h2>Event Log</h2>
      <ul>
        {events.map(event => (
          <li key={event.id}>{event.type}: {event.description}</li>
        ))}
      </ul>
    </div>
  );
};
export default EventLog;
