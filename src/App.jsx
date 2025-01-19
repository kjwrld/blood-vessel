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

import React from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function InfinityTube({
    tubularSegments = 200,
    radius = 0.3,
    radialSegments = 16,
    a = 3,
    scaleX = 1,
    scaleY = 1,
    scaleZ = 0.5,
    overallDistortion = 0.275,
    inflectionAdjustment = 0, // New parameter for inflection point adjustment
}) {
    const curve = React.useMemo(() => {
        class InfinityCurve extends THREE.Curve {
            constructor() {
                super();
                this.a = a;
                this.scaleX = scaleX;
                this.scaleY = scaleY;
                this.scaleZ = scaleZ;
                this.overallDistortion = overallDistortion;
                this.inflectionAdjustment = inflectionAdjustment;
            }

            getPoint(t) {
                const angle = t * Math.PI * 2;

                // Original infinity shape
                const x = this.a * -Math.sin(angle) * this.scaleX;
                let y =
                    this.a * Math.sin(angle) * Math.cos(angle) * this.scaleY;
                const z = this.a * Math.cos(angle) * this.scaleZ;

                // Apply overall distortion
                const distortion =
                    1 + this.overallDistortion * Math.sin(angle * 2);

                // Adjust for inflection point
                y += this.inflectionAdjustment * Math.sin(angle * 2);

                return new THREE.Vector3(x * distortion, y * distortion, z);
            }
        }

        return new InfinityCurve();
    }, [a, scaleX, scaleY, scaleZ, overallDistortion, inflectionAdjustment]);

    const geometry = React.useMemo(() => {
        const tubeGeometry = new THREE.TubeGeometry(
            curve,
            tubularSegments,
            radius,
            radialSegments,
            true
        );
        return tubeGeometry;
    }, [curve, tubularSegments, radius, radialSegments]);

    return (
        <mesh geometry={geometry}>
            <meshStandardMaterial color="cyan" wireframe={false} />
        </mesh>
    );
}

function App() {
    return (
        <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
            <OrbitControls />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <InfinityTube
                tubularSegments={200}
                radius={0.4}
                radialSegments={16}
                a={4}
                scaleX={0.7}
                scaleY={1}
                scaleZ={0.1}
                overallDistortion={0.35} // Global distortion intensity
                inflectionAdjustment={0.0} // Adjust the midpoint height
            />
        </Canvas>
    );
}

export default App;
