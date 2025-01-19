import React, { useMemo, useRef } from "react";
import { BufferGeometry, Float32BufferAttribute } from "three";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva"; // Import Leva
import Actor from "./Actor";

function Scene() {
    const groupRef = useRef();

    // Leva controls
    const { actorSpeed, vSpan, uSpan, actorCount } = useControls({
        actorSpeed: { value: 0.1, min: 0, max: 0.5, step: 0.01 },
        vSpan: { value: 5, min: 1, max: 40, step: 1 },
        uSpan: { value: 15, min: 1, max: 40, step: 1 },
        actorCount: { value: 500, min: 0, max: 750, step: 1 },
    });

    const R = 10; // Major radius
    const r = 1.75; // Minor radius

    // Generate location points and edges for the mesh
    const { locationList, edges } = useMemo(() => {
        const points = [];
        const edgesSet = new Set(); // Use a set to avoid duplicate edges
        const uSteps = Math.ceil(360 / uSpan); // Total horizontal face divisions
        const vSteps = Math.ceil((360 * 1.5) / vSpan); // Total vertical face divisions

        for (let v = 0; v <= 360 * 1.5; v += vSpan) {
            const z = (v / (360 * 1.5)) * 20 - 10;
            for (let u = 0; u < 360; u += uSpan) {
                const x =
                    (R + r * Math.cos((u * Math.PI) / 180)) *
                    Math.cos((v * Math.PI) / 180);
                const y =
                    (R + r * Math.cos((u * Math.PI) / 180)) *
                    Math.sin((v * Math.PI) / 180);
                const zOffset = r * Math.sin((u * Math.PI) / 180);
                points.push([x, y, z + zOffset]);
            }
        }

        // Generate edges from the faces
        for (let v = 0; v < vSteps; v++) {
            for (let u = 0; u < uSteps; u++) {
                const a = v * uSteps + u;
                const b = v * uSteps + ((u + 1) % uSteps); // Wrap horizontally
                const c = (v + 1) * uSteps + u;
                const d = (v + 1) * uSteps + ((u + 1) % uSteps); // Wrap horizontally

                // Add edges as sorted pairs to avoid duplicates
                [
                    [a, b],
                    [a, c],
                    [b, d],
                    [c, d],
                ].forEach(([start, end]) => {
                    const edge = [Math.min(start, end), Math.max(start, end)];
                    edgesSet.add(edge.toString());
                });
            }
        }

        const edges = Array.from(edgesSet).map((e) => e.split(",").map(Number));
        return { locationList: points, edges };
    }, [R, r, vSpan, uSpan]);

    useFrame(({ clock }) => {
        const elapsedTime = clock.getElapsedTime();
        if (groupRef.current) {
            groupRef.current.rotation.z = elapsedTime * 0.1;
        }
    });

    return (
        <>
            <group ref={groupRef}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />

                {/* Actors */}
                {Array.from({ length: actorCount }).map((_, i) => (
                    <Actor
                        key={i}
                        locationList={locationList}
                        edges={edges}
                        speed={actorSpeed}
                    />
                ))}
            </group>
        </>
    );
}

export default Scene;
