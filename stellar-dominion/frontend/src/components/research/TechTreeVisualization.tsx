/**
 * Tech Tree Visualization Component
 * Interactive graph display of technology dependencies and relationships
 * @tag #research #ui #visualization #d3
 */

import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import './TechTreeVisualization.css';

interface TechNode {
  id: string;
  name: string;
  tier: string;
  class: string;
  prerequisites: string[];
  unlocks: string[];
  x?: number;
  y?: number;
  level?: number;
}

interface TechTreeVisualizationProps {
  selectedBranch?: string;
  highlightTech?: string;
  onTechSelect?: (techId: string) => void;
  interactive?: boolean;
  zoom?: number;
}

export const TechTreeVisualization: React.FC<TechTreeVisualizationProps> = ({
  selectedBranch,
  highlightTech,
  onTechSelect,
  interactive = true,
  zoom = 1.0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [nodes, setNodes] = useState<TechNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [panning, setPanning] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(zoom);
  const [viewMode, setViewMode] = useState<'graph' | 'timeline' | 'matrix'>('graph');

  // Fetch tech tree data
  const { data: techTreeData, isLoading } = useQuery({
    queryKey: ['tech-tree-data'],
    queryFn: async () => {
      const response = await fetch('/api/research/tree/stats', { credentials: 'include' });
      return response.json();
    },
  });

  // Fetch branch data
  const { data: branchData } = useQuery({
    queryKey: ['tech-branches'],
    queryFn: async () => {
      const response = await fetch('/api/research/tree/branches', { credentials: 'include' });
      return response.json();
    },
  });

  // Initialize tech tree layout
  useEffect(() => {
    if (techTreeData && branchData) {
      const processedNodes = layoutTechTree(techTreeData, branchData);
      setNodes(processedNodes);
    }
  }, [techTreeData, branchData, selectedBranch]);

  // Layout algorithm for tech tree
  const layoutTechTree = (techData: any, branches: any): TechNode[] => {
    const nodes: TechNode[] = [];
    const layerMap = new Map<string, number>();
    let maxLayer = 0;

    // Group techs by layer based on prerequisites
    const calculateLayer = (techId: string, visited = new Set<string>()): number => {
      if (visited.has(techId)) return 0;
      visited.add(techId);

      const tech = techData.techs?.find((t: any) => t.id === techId);
      if (!tech || !tech.prerequisites || tech.prerequisites.length === 0) {
        return 0;
      }

      const maxPrereqLayer = Math.max(
        ...tech.prerequisites.map((préreq: string) => calculateLayer(préreq, visited) + 1)
      );
      return maxPrereqLayer;
    };

    // Build nodes
    techData.techs?.forEach((tech: any) => {
      const layer = calculateLayer(tech.id);
      maxLayer = Math.max(maxLayer, layer);
      layerMap.set(tech.id, layer);

      const node: TechNode = {
        id: tech.id,
        name: tech.name,
        tier: tech.tier,
        class: tech.class,
        prerequisites: tech.prerequisites || [],
        unlocks: tech.unlocks || [],
        level: layer,
        x: 0,
        y: 0,
      };
      nodes.push(node);
    });

    // Calculate positions (hierarchical layout)
    const layerGroups = new Map<number, TechNode[]>();
    nodes.forEach((node) => {
      const layer = node.level || 0;
      if (!layerGroups.has(layer)) {
        layerGroups.set(layer, []);
      }
      layerGroups.get(layer)!.push(node);
    });

    // Position nodes
    const width = 1200;
    const height = 800;
    const xSpacing = width / (maxLayer + 2);
    const ySpacing = 60;

    layerGroups.forEach((group, layer) => {
      const yStart = height / 2 - (group.length * ySpacing) / 2;
      group.forEach((node, index) => {
        node.x = xSpacing * (layer + 1);
        node.y = yStart + index * ySpacing;
      });
    });

    return nodes;
  };

  // Draw tech tree based on view mode
  const drawTechTree = () => {
    const svg = svgRef.current;
    if (!svg || nodes.length === 0) return;

    // Clear previous
    svg.innerHTML = '';

    // Draw connections
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'connections');

    nodes.forEach((node) => {
      node.unlocks?.forEach((unlockId) => {
        const unlockNode = nodes.find((n) => n.id === unlockId);
        if (unlockNode && node.x !== undefined && node.y !== undefined && unlockNode.x !== undefined && unlockNode.y !== undefined) {
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', (node.x * scale + panning.x).toString());
          line.setAttribute('y1', (node.y * scale + panning.y).toString());
          line.setAttribute('x2', (unlockNode.x * scale + panning.x).toString());
          line.setAttribute('y2', (unlockNode.y * scale + panning.y).toString());
          line.setAttribute('stroke', '#666');
          line.setAttribute('stroke-width', '2');
          line.setAttribute('class', 'tech-connection');
          g.appendChild(line);
        }
      });
    });

    svg.appendChild(g);

    // Draw nodes
    const nodesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    nodesGroup.setAttribute('class', 'nodes');

    nodes.forEach((node) => {
      if (node.x === undefined || node.y === undefined) return;

      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'tech-node');
      g.setAttribute('data-tech-id', node.id);

      // Circle
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', (node.x * scale + panning.x).toString());
      circle.setAttribute('cy', (node.y * scale + panning.y).toString());
      circle.setAttribute('r', '25');
      
      // Apply coloring based on tier
      const tierColors: { [key: string]: string } = {
        basic: '#888',
        standard: '#4CAF50',
        advanced: '#2196F3',
        military: '#FF9800',
        experimental: '#9C27B0',
        ancient: '#FFD700',
        exotic: '#00BCD4',
      };
      
      circle.setAttribute('fill', tierColors[node.tier] || '#888');
      circle.setAttribute('stroke', hoveredNode === node.id ? '#fff' : '#333');
      circle.setAttribute('stroke-width', hoveredNode === node.id ? '3' : '2');

      g.appendChild(circle);

      // Label
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', (node.x * scale + panning.x).toString());
      text.setAttribute('y', (node.y * scale + panning.y + 5).toString());
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('font-size', '12');
      text.setAttribute('fill', '#fff');
      text.setAttribute('font-weight', 'bold');
      text.textContent = node.name.substring(0, 3).toUpperCase();

      g.appendChild(text);

      // Hover and click handlers
      if (interactive) {
        g.style.cursor = 'pointer';
        g.addEventListener('mouseenter', () => setHoveredNode(node.id));
        g.addEventListener('mouseleave', () => setHoveredNode(null));
        g.addEventListener('click', () => {
          setSelectedNode(node.id);
          onTechSelect?.(node.id);
        });
      }

      nodesGroup.appendChild(g);
    });

    svg.appendChild(nodesGroup);
  };

  // Handle mouse wheel zoom
  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale((prevScale) => Math.max(0.5, Math.min(3, prevScale * delta)));
  };

  // Handle panning
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!interactive) return;
    const startX = e.clientX;
    const startY = e.clientY;
    const startPan = { ...panning };

    const handleMouseMove = (moveE: MouseEvent) => {
      setPanning({
        x: startPan.x + (moveE.clientX - startX),
        y: startPan.y + (moveE.clientY - startY),
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Redraw when state changes
  useEffect(() => {
    drawTechTree();
  }, [nodes, panning, scale, hoveredNode, selectedNode]);

  useEffect(() => {
    const svg = svgRef.current;
    if (svg) {
      svg.addEventListener('wheel', handleWheel, { passive: false });
      return () => svg.removeEventListener('wheel', handleWheel);
    }
  }, []);

  if (isLoading) {
    return <div className="tech-tree-loading">Loading tech tree...</div>;
  }

  return (
    <div className="tech-tree-visualization">
      <div className="tech-tree-controls">
        <div className="control-group">
          <button
            className={`view-mode-btn ${viewMode === 'graph' ? 'active' : ''}`}
            onClick={() => setViewMode('graph')}
          >
            Graph View
          </button>
          <button
            className={`view-mode-btn ${viewMode === 'timeline' ? 'active' : ''}`}
            onClick={() => setViewMode('timeline')}
          >
            Timeline
          </button>
          <button
            className={`view-mode-btn ${viewMode === 'matrix' ? 'active' : ''}`}
            onClick={() => setViewMode('matrix')}
          >
            Matrix
          </button>
        </div>

        <div className="control-group">
          <button onClick={() => setScale(1.0)}>Reset Zoom</button>
          <button onClick={() => setPanning({ x: 0, y: 0 })}>Reset Pan</button>
        </div>

        <div className="tech-tree-stats">
          <span>{nodes.length} Technologies</span>
          <span>Zoom: {(scale * 100).toFixed(0)}%</span>
        </div>
      </div>

      <svg
        ref={svgRef}
        className="tech-tree-svg"
        width="1200"
        height="800"
        onMouseDown={handleMouseDown}
      />

      {selectedNode && (
        <div className="tech-details-panel">
          <h3>{nodes.find((n) => n.id === selectedNode)?.name}</h3>
          <p>ID: {selectedNode}</p>
          {/* Add more details as needed */}
        </div>
      )}
    </div>
  );
};

export default TechTreeVisualization;
