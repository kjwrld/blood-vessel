import React, { useMemo, useRef } from "react";
import { BufferGeometry, Float32BufferAttribute } from "three";
import { useFrame } from "@react-three/fiber";
import Actor from "./Actor";

function Scene() {
    const groupRef = useRef();
    const R = 10; // Major radius
    const r = 1.75; // Minor radius
    const vSpan = 3; // Reduce for finer vertical resolution
    const uSpan = 15; // Reduce for finer horizontal resolution

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

    const geometry = useMemo(() => {
        const geom = new BufferGeometry();
        geom.setAttribute(
            "position",
            new Float32BufferAttribute(locationList.flat(), 3)
        );
        return geom;
    }, [locationList]);

    useFrame(({ clock }) => {
        const elapsedTime = clock.getElapsedTime();
        if (groupRef.current) {
            groupRef.current.rotation.z = elapsedTime * 0.1;
        }
    });

    return (
        <group ref={groupRef}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />

            {/* Mesh */}
            {/* <mesh geometry={geometry}>
                <meshStandardMaterial
                    color="white"
                    wireframe={true}
                    opacity={0.0}
                    transparent={true}
                />
            </mesh> */}

            {/* Actors */}
            {Array.from({ length: 500 }).map((_, i) => (
                <Actor
                    key={i}
                    locationList={locationList}
                    edges={edges}
                    speed={0.1}
                />
            ))}
        </group>
    );
}

export default Scene;
