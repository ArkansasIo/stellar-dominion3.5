
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { createPlanets } from './planets.js';

export function createStarSystem(x,y,z){

const group = new THREE.Group();

const starGeo = new THREE.SphereGeometry(2,16,16);
const starMat = new THREE.MeshBasicMaterial({color:0xffffaa});
const star = new THREE.Mesh(starGeo,starMat);

group.add(star);

group.position.set(x,y,z);

createPlanets(group);

return group;

}
