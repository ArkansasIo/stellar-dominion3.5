import React from 'react';

const CombatReport: React.FC<{ report?: any }> = ({ report }) => {
  if (!report) return <div>No combat report available.</div>;
  return (
    <div>
      <h2>Combat Report</h2>
      <pre>{JSON.stringify(report, null, 2)}</pre>
    </div>
  );
};
export default CombatReport;
