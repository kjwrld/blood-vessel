import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Actor({ locationList, edges, speed = 0.05 }) {
    const trailRef = useRef(); // Trail reference

    const MAX_TRAIL_LENGTH = 12;

    // State for actor position and trail log
    const [state, setState] = useState(() => {
        const startEdgeIndex = Math.floor(Math.random() * edges.length); // Start on a random edge
        const [selectIndex, nextIndex] = edges[startEdgeIndex];
        return {
            selectIndex,
            nextIndex,
            progress: 0,
            log: Array(MAX_TRAIL_LENGTH).fill(new THREE.Vector3(0, 0, 0)),
            color: `hsl(${Math.random() * 360}, 100%, 50%)`,
        };
    });

    useFrame(() => {
        const { selectIndex, nextIndex, progress, log, color } = state;

        const currentPoint = locationList[selectIndex];
        const nextPoint = locationList[nextIndex];

        if (!currentPoint || !nextPoint) return;

        // Interpolate along the edge
        const start = new THREE.Vector3(...currentPoint);
        const end = new THREE.Vector3(...nextPoint);
        const position = start.clone().lerp(end, progress);

        // Update trail log
        log.push(position.clone());
        if (log.length > MAX_TRAIL_LENGTH) log.shift();

        // Update trail geometry
        if (trailRef.current) {
            const trailGeometry = trailRef.current;
            const positions = new Float32Array(
                log.flatMap((vec) => [vec.x, vec.y, vec.z])
            );

            if (!trailGeometry.attributes.position) {
                // Initialize the position attribute if not already set
                trailGeometry.setAttribute(
                    "position",
                    new THREE.BufferAttribute(positions, 3)
                );
            } else {
                // Update the existing position attribute
                trailGeometry.attributes.position.array = positions;
                trailGeometry.attributes.position.needsUpdate = true;
            }
        }

        // Handle progression
        if (progress >= 1) {
            // Choose a random neighboring edge
            const availableEdges = edges.filter(
                ([start, end]) => start === nextIndex || end === nextIndex // Edges connected to the current point
            );

            if (availableEdges.length > 0) {
                const [newStart, newEnd] =
                    availableEdges[
                        Math.floor(Math.random() * availableEdges.length)
                    ];

                const newNextIndex = newStart === nextIndex ? newEnd : newStart; // Pick the other point on the edge

                setState({
                    selectIndex: nextIndex,
                    nextIndex: newNextIndex,
                    progress: 0,
                    log: [...log],
                    color,
                });
            }
        } else {
            setState((prev) => ({
                ...prev,
                progress: prev.progress + speed, // Use the speed variable
            }));
        }
    });

    return (
        <group>
            {/* Trail */}
            <line>
                <bufferGeometry ref={trailRef} />
                <lineBasicMaterial color={state.color} />
            </line>
        </group>
    );
}

export default Actor;
