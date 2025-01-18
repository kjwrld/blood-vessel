import React from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene";
import { OrbitControls } from "@react-three/drei";

function App() {
    return (
        <Canvas camera={{ position: [15, 0, 15], fov: 75 }}>
            <OrbitControls />
            <Scene />
        </Canvas>
    );
}

export default App;
