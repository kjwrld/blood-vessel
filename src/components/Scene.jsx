import React, { useMemo } from "react";
import { BufferGeometry, Float32BufferAttribute } from "three";
import Actor from "./Actor";

function Scene() {
    const R = 10; // Major radius
    const r = 1.75; // Minor radius
    const vSpan = 3; // Reduce for finer vertical resolution
    const uSpan = 15; // Reduce for finer horizontal resolution

    // Generate location points and edges for the mesh
    const { locationList, edges } = useMemo(() => {
        const points = [];
        const edgesSet = new Set(); // Use a set to avoid duplicate edges
        const uSteps = Math.ceil(360 / uSpan); // Total horizontal divisions
        const vSteps = Math.ceil((360 * 1.5) / vSpan); // Total vertical divisions

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
                    edgesSet.add(edge.toString()); // Store as strings
                });
            }
        }

        const edges = Array.from(edgesSet).map((e) => e.split(",").map(Number)); // Convert back to pairs of indices
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

    return (
        <group>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />

            {/* Mesh */}
            <mesh geometry={geometry}>
                <meshStandardMaterial
                    color="white"
                    wireframe={true} // Visible wireframe
                    opacity={0.0}
                    transparent={true}
                />
            </mesh>

            {/* Actors */}
            {Array.from({ length: 600 }).map((_, i) => (
                <Actor
                    key={i}
                    locationList={locationList}
                    edges={edges}
                    speed={0.15}
                />
            ))}
        </group>
    );
}

export default Scene;
