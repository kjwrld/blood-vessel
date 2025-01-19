import React from "react";
import { Canvas, useThree } from "@react-three/fiber";
import Scene from "./components/Scene";
import { OrbitControls } from "@react-three/drei";
import { Leva, useControls } from "leva";

function CameraUpdater({ cameraX, cameraY, cameraZ, fov }) {
    const { camera } = useThree();

    // Update the camera's position and fov when the values change
    React.useEffect(() => {
        camera.position.set(cameraX, cameraY, cameraZ);
        camera.fov = fov;
        camera.updateProjectionMatrix(); // Ensure the projection matrix updates
    }, [cameraX, cameraY, cameraZ, fov, camera]);

    return null;
}

function App() {
    // Leva controls for the camera
    const { cameraX, cameraY, cameraZ, fov } = useControls("Camera", {
        cameraX: { value: -36, min: -60, max: 60, step: 1 },
        cameraY: { value: -50, min: -60, max: 60, step: 1 },
        cameraZ: { value: -50, min: -60, max: 60, step: 1 },
        fov: { value: 22, min: 10, max: 120, step: 1 },
    });

    return (
        <>
            <Leva collapsed={true} />
            <Canvas camera={{ position: [15, 0, 15], fov: 75 }}>
                {/* Update the camera dynamically */}
                <CameraUpdater
                    cameraX={cameraX}
                    cameraY={cameraY}
                    cameraZ={cameraZ}
                    fov={fov}
                />
                <OrbitControls />
                <Scene />
            </Canvas>
        </>
    );
}

export default App;
