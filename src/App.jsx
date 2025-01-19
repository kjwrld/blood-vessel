import React from "react";
import { Canvas, useThree } from "@react-three/fiber";
import Scene from "./components/Scene";
import { OrbitControls } from "@react-three/drei";
import { Leva, useControls } from "leva";

function CameraUpdater({ cameraX, cameraY, cameraZ, fov }) {
    const { camera } = useThree();

    React.useEffect(() => {
        camera.position.set(cameraX, cameraY, cameraZ);
        camera.fov = fov;
        camera.updateProjectionMatrix();
    }, [cameraX, cameraY, cameraZ, fov, camera]);

    return null;
}

function App() {
    const { cameraX, cameraY, cameraZ, fov } = useControls("Camera", {
        cameraX: { value: 0, min: -60, max: 60, step: 1 },
        cameraY: { value: 0, min: -60, max: 60, step: 1 },
        cameraZ: { value: 15, min: -60, max: 60, step: 1 },
        fov: { value: 40, min: 10, max: 120, step: 1 },
    });

    return (
        <>
            <Leva collapsed={true} />
            <Canvas camera={{ position: [cameraX, cameraY, cameraZ], fov }}>
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
