import React, { useMemo } from 'react';
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

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      {Array.from({ length: 10 }).map((_, i) => (
        <Actor key={i} locationList={locationList} />
      ))}
    </>
  );
}

export default Scene;
