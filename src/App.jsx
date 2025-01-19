// import React from "react";
// import { Canvas, useThree } from "@react-three/fiber";
// import Scene from "./components/Scene";
import { OrbitControls } from "@react-three/drei";
// import { Leva, useControls } from "leva";

// function CameraUpdater({ cameraX, cameraY, cameraZ, fov }) {
//     const { camera } = useThree();

//     // Update the camera's position and fov when the values change
//     React.useEffect(() => {
//         camera.position.set(cameraX, cameraY, cameraZ);
//         camera.fov = fov;
//         camera.updateProjectionMatrix(); // Ensure the projection matrix updates
//     }, [cameraX, cameraY, cameraZ, fov, camera]);

//     return null;
// }

// function App() {
//     // Leva controls for the camera
//     const { cameraX, cameraY, cameraZ, fov } = useControls("Camera", {
//         cameraX: { value: -36, min: -60, max: 60, step: 1 },
//         cameraY: { value: -50, min: -60, max: 60, step: 1 },
//         cameraZ: { value: -50, min: -60, max: 60, step: 1 },
//         fov: { value: 22, min: 10, max: 120, step: 1 },
//     });

//     return (
//         <>
//             <Leva collapsed={true} />
//             <Canvas camera={{ position: [15, 0, 15], fov: 75 }}>
//                 {/* Update the camera dynamically */}
//                 <CameraUpdater
//                     cameraX={cameraX}
//                     cameraY={cameraY}
//                     cameraZ={cameraZ}
//                     fov={fov}
//                 />
//                 <OrbitControls />
//                 <Scene />
//             </Canvas>
//         </>
//     );
// }

// export default App;

import React, { useMemo } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";

function Lemniscate() {
    const points = useMemo(() => {
        const path = [];
        const steps = 200; // Number of points
        const offset = 0.5; // Offset for the middle points
        for (let i = 0; i <= steps; i++) {
            const t = (i / steps) * Math.PI * 2;
            const x = Math.cos(t);
            const y = Math.sin(t) * Math.cos(t);
            const z = Math.sin(2 * t) + offset; // Adding the offset here
            path.push(new THREE.Vector3(x, y, z));
        }
        return path;
    }, []);

    return (
        <line>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    array={new Float32Array(points.flatMap((p) => p.toArray()))}
                    count={points.length}
                    itemSize={3}
                />
            </bufferGeometry>
            <lineBasicMaterial color="#03e5f2" />
        </line>
    );
}

function App() {
    return (
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
            <ambientLight />
            <Lemniscate />
            <OrbitControls />
        </Canvas>
    );
}

export default App;
