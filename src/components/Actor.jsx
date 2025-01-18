import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Actor({ locationList, nextIndexList, destinationList }) {
    const ref = useRef();
    const trailRef = useRef();

    const MAX_TRAIL_LENGTH = 36;

    const [state, setState] = useState(() => {
        const selectIndex = Math.floor(Math.random() * locationList.length);
        return {
            selectIndex,
            nextIndex: selectIndex,
            progress: 0,
            log: Array(MAX_TRAIL_LENGTH).fill(new THREE.Vector3(0, 0, 0)), // Preallocate trail
            color: `hsl(${Math.random() * 360}, 100%, 50%)`,
        };
    });

    useFrame(() => {
        const { selectIndex, nextIndex, progress, log, color } = state;

        // Interpolate position
        const start = new THREE.Vector3(...locationList[selectIndex]);
        const end = new THREE.Vector3(...locationList[nextIndex]);
        const position = start.lerp(end, progress);
        ref.current.position.copy(position);

        // Update trail log
        log.push(position.clone()); // Add new position
        log.shift(); // Remove the oldest position

        // Update trail geometry
        if (trailRef.current) {
            const positions = new Float32Array(MAX_TRAIL_LENGTH * 3);
            log.forEach((point, i) => {
                positions[i * 3] = point.x;
                positions[i * 3 + 1] = point.y;
                positions[i * 3 + 2] = point.z;
            });
            trailRef.current.attributes.position.array = positions;
            trailRef.current.attributes.position.needsUpdate = true;
        }

        // Advance movement logic
        if (progress >= 1) {
            let retries = 10;
            let newNextIndex =
                nextIndexList[selectIndex][
                    Math.floor(
                        Math.random() * nextIndexList[selectIndex].length
                    )
                ];
            while (destinationList.includes(newNextIndex) && retries-- > 0) {
                newNextIndex =
                    nextIndexList[selectIndex][
                        Math.floor(
                            Math.random() * nextIndexList[selectIndex].length
                        )
                    ];
            }

            if (retries > 0) destinationList.push(newNextIndex);

            setState({
                selectIndex: nextIndex,
                nextIndex: newNextIndex,
                progress: 0,
                log: [...log], // Ensure trail persists
                color,
            });
        } else {
            setState((prevState) => ({
                ...prevState,
                progress: prevState.progress + 0.01,
            }));
        }
    });

    return (
        <group>
            {/* Actor */}
            <mesh ref={ref}>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshStandardMaterial color={state.color} />
            </mesh>

            {/* Trail */}
            <lineSegments>
                <bufferGeometry ref={trailRef}>
                    {/* Preallocate buffer for the trail */}
                    <bufferAttribute
                        attach="attributes-position"
                        array={new Float32Array(MAX_TRAIL_LENGTH * 3)}
                        count={MAX_TRAIL_LENGTH}
                        itemSize={3}
                    />
                </bufferGeometry>
                <lineBasicMaterial color={state.color} />
            </lineSegments>
        </group>
    );
}

export default Actor;
