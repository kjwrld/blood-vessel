import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Actor({ locationList, edges, speed = 0.05 }) {
    const trailRef = useRef();

    const MAX_TRAIL_LENGTH = 24;

    const state = useRef({
        selectIndex: Math.floor(Math.random() * locationList.length),
        nextIndex: Math.floor(Math.random() * locationList.length),
        progress: 0,
        trail: Array(MAX_TRAIL_LENGTH).fill(new THREE.Vector3(0, 0, 0)),
    });

    useFrame(() => {
        const { selectIndex, nextIndex, progress, trail } = state.current;

        // Get the current and next positions
        const currentPoint = locationList[selectIndex];
        const nextPoint = locationList[nextIndex];

        if (!currentPoint || !nextPoint) return;

        const currentPos = new THREE.Vector3(...currentPoint);
        const nextPos = new THREE.Vector3(...nextPoint);

        // Interpolate position
        const position = currentPos.clone().lerp(nextPos, progress);

        // Update trail
        trail.push(position.clone());
        if (trail.length > MAX_TRAIL_LENGTH) trail.shift();

        // Update trail geometry and color
        if (trailRef.current) {
            const trailGeometry = trailRef.current;

            // Update positions
            const positions = new Float32Array(
                trail.flatMap((vec) => [vec.x, vec.y, vec.z])
            );
            if (!trailGeometry.attributes.position) {
                trailGeometry.setAttribute(
                    "position",
                    new THREE.BufferAttribute(positions, 3)
                );
            } else {
                trailGeometry.attributes.position.array = positions;
                trailGeometry.attributes.position.needsUpdate = true;
            }

            // Update colors with gradient opacity
            const colors = new Float32Array(
                trail.flatMap((_, i) => {
                    const t = i / (trail.length - 1); // Normalize index
                    const alpha = t; // Higher t => more transparency
                    return [0.3, 0.3, 1, alpha]; // White with varying alpha
                })
            );
            if (!trailGeometry.attributes.color) {
                trailGeometry.setAttribute(
                    "color",
                    new THREE.BufferAttribute(colors, 4) // RGBA
                );
            } else {
                trailGeometry.attributes.color.array = colors;
                trailGeometry.attributes.color.needsUpdate = true;
            }
        }

        // Handle progression
        if (progress >= 1) {
            const availableEdges = edges.filter(
                ([start, end]) => start === nextIndex || end === nextIndex
            );
            const [newStart, newEnd] = availableEdges[
                Math.floor(Math.random() * availableEdges.length)
            ] || [nextIndex, nextIndex];

            const newNextIndex = newStart === nextIndex ? newEnd : newStart;

            state.current.selectIndex = nextIndex;
            state.current.nextIndex = newNextIndex;
            state.current.progress = 0;
        } else {
            state.current.progress += speed;
        }
    });

    return (
        <group>
            <line>
                <bufferGeometry ref={trailRef} />
                <lineBasicMaterial
                    vertexColors
                    transparent
                    depthWrite={true} // Prevent transparency sorting issues
                />
            </line>
        </group>
    );
}

export default Actor;
