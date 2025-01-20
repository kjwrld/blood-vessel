import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Actor({ vertices, edges, speed = 0.02, time = 0 }) {
    const trailRef = useRef();
    const MAX_TRAIL_LENGTH = 48;

    const state = useRef({
        selectIndex: Math.floor(Math.random() * vertices.length),
        nextIndex: Math.floor(Math.random() * vertices.length),
        progress: 0,
        trail: [],
    });

    useFrame(() => {
        const { selectIndex, nextIndex, progress, trail } = state.current;

        if (!vertices[selectIndex] || !vertices[nextIndex]) return;

        // Dynamically adjust vertex positions based on time
        const updatedStart = new THREE.Vector3(
            vertices[selectIndex].x + Math.sin(time) * 0.2,
            vertices[selectIndex].y + Math.cos(time) * 0.2,
            vertices[selectIndex].z + Math.sin(time * 0.5) * 0.2
        );

        const updatedEnd = new THREE.Vector3(
            vertices[nextIndex].x + Math.sin(time) * 0.2,
            vertices[nextIndex].y + Math.cos(time) * 0.2,
            vertices[nextIndex].z + Math.sin(time * 0.5) * 0.2
        );

        // Interpolate position
        const position = new THREE.Vector3().lerpVectors(
            updatedStart,
            updatedEnd,
            progress
        );

        // Update trail
        trail.push(position.clone());
        if (trail.length > MAX_TRAIL_LENGTH) trail.shift();

        if (trailRef.current) {
            const positions = new Float32Array(
                trail.flatMap((vec) => [vec.x, vec.y, vec.z])
            );
            trailRef.current.setAttribute(
                "position",
                new THREE.BufferAttribute(positions, 3)
            );
        }

        // Handle progression
        if (progress >= 1) {
            const availableEdges = edges.filter(([start, end]) =>
                [start, end].includes(nextIndex)
            );
            const [newStart, newEnd] = availableEdges[
                Math.floor(Math.random() * availableEdges.length)
            ] || [nextIndex, nextIndex];

            state.current.selectIndex = nextIndex;
            state.current.nextIndex =
                newStart === nextIndex ? newEnd : newStart;
            state.current.progress = 0;
        } else {
            state.current.progress += speed;
        }
    });

    return (
        <line>
            <bufferGeometry ref={trailRef} />
            <lineBasicMaterial color="black" />
        </line>
    );
}

export default Actor;
