
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export function createPlanets(system){

const planetCount = Math.floor(Math.random()*5)+1;

for(let i=0;i<planetCount;i++){

 const size = 0.5 + Math.random()*1.5;

 const geo = new THREE.SphereGeometry(size,16,16);

 const color = new THREE.Color(
  Math.random(),
  Math.random(),
  Math.random()
 );

 const mat = new THREE.MeshStandardMaterial({color:color});

 const planet = new THREE.Mesh(geo,mat);

 const distance = 6 + i*5;

 planet.userData = {
  distance:distance,
  speed:0.002 + Math.random()*0.003,
  angle:Math.random()*Math.PI*2
 };

 system.add(planet);

}

system.userData.planets = system.children.filter(o=>o.type==="Mesh").slice(1);

}
