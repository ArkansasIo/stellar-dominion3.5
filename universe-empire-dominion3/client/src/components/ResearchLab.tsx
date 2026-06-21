import React, { useEffect, useState } from 'react';

const ResearchLab: React.FC = () => {
  const [techs, setTechs] = useState<any>({});
  useEffect(() => {
    fetch('/api/tech-tree')
      .then(res => res.json())
      .then(setTechs);
  }, []);
  return (
    <div>
      <h2>Research Lab</h2>
      <ul>
        {Object.entries(techs).map(([id, tech]: any) => (
          <li key={id}>{tech.name} (Level: {tech.level})</li>
        ))}
      </ul>
    </div>
  );
};
export default ResearchLab;
