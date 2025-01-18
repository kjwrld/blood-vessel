import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Actor({ locationList }) {
  const ref = useRef();

  // Initialize state
  const [state, setState] = useState(() => {
    const selectIndex = Math.floor(Math.random() * locationList.length);
    return {
      selectIndex,
      nextIndex: selectIndex,
      progress: 0, // Interpolation progress between 0 and 1
    };
  });

  useFrame(() => {
    const { selectIndex, nextIndex, progress } = state;

    // Interpolate position
    const start = new THREE.Vector3(...locationList[selectIndex]);
    const end = new THREE.Vector3(...locationList[nextIndex]);
    const position = start.lerp(end, progress);
    ref.current.position.copy(position);

    // Update progress and switch to next point if progress is complete
    if (progress >= 1) {
      const newNextIndex = Math.floor(Math.random() * locationList.length);
      setState({
        selectIndex: nextIndex,
        nextIndex: newNextIndex,
        progress: 0,
      });
    } else {
      setState((prevState) => ({
        ...prevState,
        progress: prevState.progress + 0.01, // Adjust speed here
      }));
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshStandardMaterial color="hsl(200, 100%, 50%)" />
    </mesh>
  );
}

export default Actor;
