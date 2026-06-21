
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { createStarSystem } from './starSystem.js';

export function generateGalaxy(scene,count){

const arms = 4;

for(let i=0;i<count;i++){

 const arm = i % arms;

 const angle = i * 0.3;
 const radius = 20 + angle * 3;

 const x = Math.cos(angle + arm*Math.PI/2)*radius;
 const z = Math.sin(angle + arm*Math.PI/2)*radius;
 const y = (Math.random()-0.5)*20;

 const system = createStarSystem(x,y,z);

 scene.add(system);

}

}
