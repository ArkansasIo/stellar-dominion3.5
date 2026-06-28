import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { buildGalaxyBlueprint } from './galaxyBlueprint';

interface GalaxyViewerProps {
  seed?: number;
  systemCount?: number;
  onSystemSelect?: (system: any) => void;
  onSystemHover?: (systemId: string | null) => void;
  onPlanetSelect?: (data: { system: any; planet: any }) => void;
}

export default function GalaxyViewer({
  seed = 1,
  systemCount = 420,
  onSystemSelect,
  onSystemHover,
  onPlanetSelect
}: GalaxyViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x06111d);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      3000
    );
    camera.position.set(420, 250, 620);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(100, 100, 50);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 80;
    controls.maxDistance = 2800;

    // Galaxy data
    const blueprint = buildGalaxyBlueprint({ seed, systemCount });

    // Create galaxy systems
    const systemGroup = new THREE.Group();
    const selectableMeshes: THREE.Mesh[] = [];

    blueprint.systems.forEach((system: any) => {
      const group = new THREE.Group();
      group.position.set(system.position.x, system.position.y, system.position.z);

      // Star
      const starGeometry = new THREE.SphereGeometry(system.starSize, 18, 18);
      const starMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        emissive: 0x331100,
        emissiveIntensity: 0.3,
      });
      const starMesh = new THREE.Mesh(starGeometry, starMaterial);
      starMesh.userData = { kind: "system", systemId: system.id };
      group.add(starMesh);
      selectableMeshes.push(starMesh);

      // Planets (simplified)
      system.planets.slice(0, 3).forEach((planet: any, index: number) => {
        const planetGeometry = new THREE.SphereGeometry(planet.size, 16, 16);
        const planetMaterial = new THREE.MeshStandardMaterial({
          color: planet.color,
          roughness: 0.8,
          metalness: 0.1,
        });
        const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
        planetMesh.position.set(
          Math.cos(planet.orbitAngle) * planet.orbitRadius,
          0,
          Math.sin(planet.orbitAngle) * planet.orbitRadius
        );
        planetMesh.userData = { kind: "planet", systemId: system.id, planetId: planet.id };
        group.add(planetMesh);
        selectableMeshes.push(planetMesh);
      });

      systemGroup.add(group);
    });

    scene.add(systemGroup);

    // Connections
    const routeGroup = new THREE.Group();
    blueprint.routeLanes.slice(0, 50).forEach((lane: any) => { // Limit connections for performance
      const from = blueprint.systems.find((s: any) => s.id === lane.fromId);
      const to = blueprint.systems.find((s: any) => s.id === lane.toId);
      if (from && to) {
        const geometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(from.position.x, from.position.y, from.position.z),
          new THREE.Vector3(to.position.x, to.position.y, to.position.z),
        ]);
        const material = new THREE.LineBasicMaterial({ color: 0x78d6ff, transparent: true, opacity: 0.3 });
        const line = new THREE.Line(geometry, material);
        routeGroup.add(line);
      }
    });
    scene.add(routeGroup);

    // Raycaster for interactions
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const handlePointerMove = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const handleClick = () => {
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(selectableMeshes);

      if (intersects.length > 0) {
        const mesh = intersects[0].object;
        const userData = mesh.userData;

        if (userData.kind === "system") {
          const system = blueprint.systems.find((s: any) => s.id === userData.systemId);
          onSystemSelect?.(system);
        } else if (userData.kind === "planet") {
          const system = blueprint.systems.find((s: any) => s.id === userData.systemId);
          const planet = system?.planets.find((p: any) => p.id === userData.planetId);
          if (system && planet) {
            onPlanetSelect?.({ system, planet });
          }
        }
      }
    };

    renderer.domElement.addEventListener('pointermove', handlePointerMove);
    renderer.domElement.addEventListener('click', handleClick);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();

      // Hover detection
      raycaster.setFromCamera(pointer, camera);
      const hoveredObjects = raycaster.intersectObjects(selectableMeshes);
      const hoveredSystemId = hoveredObjects.length > 0 ? hoveredObjects[0].object.userData.systemId : null;
      onSystemHover?.(hoveredSystemId);

      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('click', handleClick);
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [seed, systemCount, onSystemSelect, onSystemHover, onPlanetSelect]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full"
      style={{ minHeight: '600px' }}
    />
  );
}