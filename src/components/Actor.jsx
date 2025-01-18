import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Actor({ locationList }) {
  const ref = useRef();
  const trailRef = useRef();

  // Initialize state
  const [state, setState] = useState(() => {
    const selectIndex = Math.floor(Math.random() * locationList.length);
    return {
      selectIndex,
      nextIndex: selectIndex,
      progress: 0, // Interpolation progress between 0 and 1
      log: [], // Trail history
      color: `hsl(${Math.random() * 360}, 100%, 50%)`, // Random color
    };
  });

  useFrame(() => {
    const { selectIndex, nextIndex, progress, log, color } = state;

    // Interpolate position
    const start = new THREE.Vector3(...locationList[selectIndex]);
    const end = new THREE.Vector3(...locationList[nextIndex]);
    const position = start.lerp(end, progress);
    ref.current.position.copy(position);

    // Update the trail
    const newLog = [...log, position.clone()];
    if (newLog.length > 12) newLog.shift(); // Keep the trail limited to 12 points
    trailRef.current.geometry.setFromPoints(newLog);

    // Update progress and switch to next point if progress is complete
    if (progress >= 1) {
      const newNextIndex = Math.floor(Math.random() * locationList.length);
      setState({
        selectIndex: nextIndex,
        nextIndex: newNextIndex,
        progress: 0,
        log: newLog,
        color,
      });
    } else {
      setState((prevState) => ({
        ...prevState,
        progress: prevState.progress + 0.01, // Adjust speed here
      }));
    }
  });

  return (
    <group>
      {/* Actor Sphere */}
      <mesh ref={ref}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color={state.color} />
      </mesh>

      {/* Trail */}
      <line ref={trailRef}>
        <bufferGeometry />
        <lineBasicMaterial color={state.color} />
      </line>
    </group>
  );
}

export default Actor;
