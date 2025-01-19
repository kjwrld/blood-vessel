// import React from "react";
// import { Canvas, useThree } from "@react-three/fiber";
// import Scene from "./components/Scene";
// import { OrbitControls } from "@react-three/drei";
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
import { OrbitControls } from "@react-three/drei";

function InfinityTubular({
    tubularSegments = 100,
    radius = 0.2,
    radialSegments = 8,
    a = 3,
    scaleX = 1,
    scaleY = 1,
    scaleZ = 1,
}) {
    const geometry = useMemo(() => {
        // Custom curve for the Möbius infinity symbol
        class InfinityCurve extends THREE.Curve {
            getPoint(t) {
                const angle = t * 2 * Math.PI;

                // Infinity shape equation with scaling
                const x =
                    ((a * Math.cos(angle)) / (1 + Math.sin(angle) ** 2)) *
                    scaleX;
                const y =
                    ((a * Math.sin(angle) * Math.cos(angle)) /
                        (1 + Math.sin(angle) ** 2)) *
                    scaleY;
                const z = Math.sin(angle) * scaleZ; // Add slight variation for depth

                return new THREE.Vector3(x, y, z);
            }
        }

        const path = new InfinityCurve();
        return new THREE.TubeGeometry(
            path,
            tubularSegments,
            radius,
            radialSegments,
            true
        );
    }, [tubularSegments, radius, radialSegments, a, scaleX, scaleY, scaleZ]);

    return (
        <mesh geometry={geometry}>
            <meshStandardMaterial
                color="hotpink"
                metalness={0.5}
                roughness={0.4}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}

function App() {
    return (
        <Canvas camera={{ position: [0, 0, 20], fov: 75 }}>
            <OrbitControls />
            <ambientLight intensity={1} />
            <pointLight position={[0, 0, 20]} />
            <InfinityTubular
                tubularSegments={200}
                radius={0.3}
                radialSegments={16}
                a={3}
                scaleX={1}
                scaleY={2}
                scaleZ={0.5}
            />
        </Canvas>
    );
}

export default App;
