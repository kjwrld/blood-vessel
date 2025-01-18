import React from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from './components/Scene';

function App() {
  return (
    <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
      <Scene />
    </Canvas>
  );
}

export default App;
