import React, { useRef, useMemo, useEffect } from "react";
import { useFrame, extend, useThree } from "@react-three/fiber";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { MotionBlurPass } from "../postprocessing/MotionBlurPass"; // Import your custom pass
import Actor from "./Actor";
import { BufferGeometry, Float32BufferAttribute } from "three";

// Extend custom passes into React Three Fiber
extend({ EffectComposer, RenderPass, MotionBlurPass });

export default function Scene() {
    const composer = useRef();
    const groupRef = useRef();
    const { scene, camera, gl, size } = useThree(); // Access Fiber's context

    const R = 10;
    const r = 1.75;
    const vSpan = 3;
    const uSpan = 15;

    // Generate location points and edges
    const { locationList, edges } = useMemo(() => {
        const points = [];
        const edgesSet = new Set();
        const uSteps = Math.ceil(360 / uSpan);
        const vSteps = Math.ceil((360 * 1.5) / vSpan);

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

        for (let v = 0; v < vSteps; v++) {
            for (let u = 0; u < uSteps; u++) {
                const a = v * uSteps + u;
                const b = v * uSteps + ((u + 1) % uSteps);
                const c = (v + 1) * uSteps + u;
                const d = (v + 1) * uSteps + ((u + 1) % uSteps);

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

    // Initialize EffectComposer and passes
    useEffect(() => {
        const effectComposer = new EffectComposer(gl);
        const renderPassInstance = new RenderPass(scene, camera);

        // Try initializing MotionBlurPass with default values
        let motionBlurPassInstance;
        try {
            motionBlurPassInstance = new MotionBlurPass(scene, camera, {
                samples: 30,
                smearIntensity: 1,
            });
            effectComposer.addPass(motionBlurPassInstance);
        } catch (error) {
            console.error("MotionBlurPass initialization error:", error);
        }

        effectComposer.addPass(renderPassInstance);

        composer.current = effectComposer;
    }, [scene, camera, gl]);

    // Use EffectComposer for rendering
    useFrame(() => {
        if (composer.current) composer.current.render();
    });

    useFrame(({ clock }) => {
        const elapsedTime = clock.getElapsedTime();
        if (groupRef.current) {
            groupRef.current.rotation.z = elapsedTime * 1;
        }
    });

    return (
        <group ref={groupRef}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />

            <mesh geometry={geometry}>
                <meshStandardMaterial
                    color="white"
                    wireframe={true} // Visible wireframe
                    opacity={0.0}
                    transparent={true}
                />
            </mesh>

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
