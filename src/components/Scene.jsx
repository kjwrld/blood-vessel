import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import Actor from './Actor';

function Scene() {
  const R = 5; // Outer radius
  const r = 1.5; // Inner radius
  const uSpan = 15;
  const vSpan = 30;

  // Generate location points
  const locationList = useMemo(() => {
    const points = [];
    for (let v = 0; v <= 360; v += vSpan) {
      for (let u = 0; u < 360; u += uSpan) {
        const x = (R + r * Math.cos(u * (Math.PI / 180))) * Math.cos(v * (Math.PI / 180));
        const y = (R + r * Math.cos(u * (Math.PI / 180))) * Math.sin(v * (Math.PI / 180));
        const z = r * Math.sin(u * (Math.PI / 180));
        points.push([x, y, z]);
      }
    }
    return points;
  }, [R, r, uSpan, vSpan]);

  // Shared destination list to avoid overlapping targets
  const destinationList = useRef([]);
  const groupRef = useRef();

  // Rotate the entire scene group
  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = elapsed * 0.2; // Y-axis rotation
      groupRef.current.rotation.z = Math.sin(elapsed * 0.1) * 0.1; // Z-axis subtle oscillation
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      {/* Render the Parametric Shape */}
      <Line
        points={locationList} // The parametric shape points
        color="white"
        lineWidth={1}
        dashed={false}
      />

      {/* Render the Actors */}
      {Array.from({ length: 10 }).map((_, i) => (
        <Actor key={i} locationList={locationList} destinationList={destinationList.current} />
      ))}
    </group>
  );
}

export default Scene;
