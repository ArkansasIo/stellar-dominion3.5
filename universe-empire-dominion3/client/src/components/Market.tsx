import React, { useEffect, useState } from 'react';

const Market: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  useEffect(() => {
    fetch('/api/market')
      .then(res => res.json())
      .then(setOrders);
  }, []);
  return (
    <div>
      <h2>Market</h2>
      <ul>
        {orders.map(order => (
          <li key={order.id}>{order.type} {order.amount} {order.resource} @ {order.price}</li>
        ))}
      </ul>
    </div>
  );
};
export default Market;
