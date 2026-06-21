import React, { useEffect, useState } from 'react';

const TechTree: React.FC = () => {
  const [techs, setTechs] = useState<any>({});
  useEffect(() => {
    fetch('/api/tech-tree')
      .then(res => res.json())
      .then(setTechs);
  }, []);
  return (
    <div>
      <h2>Technology Tree</h2>
      <ul>
        {Object.entries(techs).map(([id, tech]: any) => (
          <li key={id}>{tech.name} (Level: {tech.level})</li>
        ))}
      </ul>
    </div>
  );
};
export default TechTree;
