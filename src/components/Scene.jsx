import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import Actor from "./Actor";

function Scene() {
    const R = 4; // Major radius
    const r = 1; // Minor radius
    const vSpan = 15; // Vertical span
    const uSpan = 30; // Horizontal span

    // Generate location points
    const locationList = useMemo(() => {
        const points = [];
        for (let v = 0; v <= 360 * 2; v += vSpan) {
            const z = (v / (360 * 2)) * 20 - 10; // Adjust z-axis range
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
        return points;
    }, [R, r, vSpan, uSpan]);

    // Generate neighbors
    const nextIndexList = useMemo(() => {
        return locationList.map((point, i) => {
            return locationList
                .map((other, j) => ({
                    distance: Math.hypot(
                        ...point.map((p, idx) => p - other[idx])
                    ),
                    index: j,
                }))
                .filter((item) => item.index !== i && item.distance < 2.5) // Adjust threshold for adjacency
                .map((item) => item.index);
        });
    }, [locationList]);

    const destinationList = useRef([]);

    return (
        <group>
            {/* Lighting */}
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />

            {/* Parametric Shape */}
            <Line points={locationList} color="black" lineWidth={1} />

            {/* Actors */}
            {Array.from({ length: 300 }).map((_, i) => (
                <Actor
                    key={i}
                    locationList={locationList}
                    nextIndexList={nextIndexList}
                    destinationList={destinationList.current}
                />
            ))}
        </group>
    );
}

export default Scene;
