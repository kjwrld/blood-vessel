import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import Actor from './Actor';

function Scene() {
  const R = 5; // Outer radius
  const r = 2; // Inner radius (adjusted for better visibility)
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

  // Compute next_index_list for neighbors
  const nextIndexList = useMemo(() => {
    return locationList.map((point, i) => {
      return locationList
        .map((other, j) => ({
          distance: Math.hypot(...point.map((p, idx) => p - other[idx])),
          index: j,
        }))
        .filter((item) => item.index !== i && item.distance < 2) // Adjust threshold to allow freer movement
        .map((item) => item.index);
    });
  }, [locationList]);

  const destinationList = useRef([]);

  return (
    <group>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Line points={locationList} color="white" lineWidth={1} />
      {Array.from({ length: 10 }).map((_, i) => (
        <Actor
          key={i}
          locationList={locationList}
          nextIndexList={nextIndexList}
          destinationList={destinationList.current}
        />
      ))}
    </group>
  );
}

export default Scene;
