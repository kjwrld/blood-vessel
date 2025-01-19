import React, { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function InfinityTube({
    tubularSegments = 200,
    radius = 0.4,
    radialSegments = 16,
    a = 4,
    scaleX = 0.75,
    scaleY = 1,
    scaleZ = 0.1,
    overallDistortion = 0.35,
    wireframe = false,
    visible = false,
    speed = 0.01,
    onGenerateData = () => {}, // Callback for vertices and faces
}) {
    const tRef = useRef(0); // Animation progress

    const curve = useMemo(() => {
        class InfinityCurve extends THREE.Curve {
            constructor() {
                super();
                this.a = a;
                this.scaleX = scaleX;
                this.scaleY = scaleY;
                this.scaleZ = scaleZ;
                this.overallDistortion = overallDistortion;
            }

            getPoint(t) {
                const angle = t * Math.PI * 2;

                // Infinity shape equation with dynamic offset
                const x = this.a * Math.sin(angle + tRef.current) * this.scaleX;
                const y =
                    this.a *
                    Math.sin(angle + tRef.current) *
                    Math.cos(angle + tRef.current) *
                    this.scaleY;
                const z = this.a * Math.cos(angle + tRef.current) * this.scaleZ;

                // Apply distortion
                const distortion =
                    1 +
                    this.overallDistortion *
                        Math.sin((angle + tRef.current) * 2);

                const v_distortion =
                    1 +
                    this.overallDistortion *
                        -Math.cos((angle + tRef.current) * 2) *
                        0.25;

                return new THREE.Vector3(
                    x * distortion,
                    y * distortion * v_distortion,
                    z
                );
            }
        }

        return new InfinityCurve();
    }, [a, scaleX, scaleY, scaleZ, overallDistortion]);

    useEffect(() => {
        const tubeGeometry = new THREE.TubeGeometry(
            curve,
            tubularSegments,
            radius,
            radialSegments,
            true
        );

        const vertices = [];
        const edges = [];
        const faces = [];

        const positionAttribute = tubeGeometry.attributes.position;

        // Extract vertices
        for (let i = 0; i < positionAttribute.count; i++) {
            const vertex = new THREE.Vector3();
            vertex.fromBufferAttribute(positionAttribute, i);
            vertices.push(vertex);
        }

        // Generate faces (two triangles per quad)
        for (let j = 0; j < tubularSegments; j++) {
            for (let i = 0; i < radialSegments; i++) {
                const a = i + j * (radialSegments + 1);
                const b =
                    ((i + 1) % (radialSegments + 1)) + j * (radialSegments + 1);
                const c = i + (j + 1) * (radialSegments + 1);
                const d =
                    ((i + 1) % (radialSegments + 1)) +
                    (j + 1) * (radialSegments + 1);

                // Create two triangles per quad
                faces.push([a, b, d]);
                faces.push([a, d, c]);

                // Store edge connections for actor movement
                edges.push([a, b], [b, d], [d, c], [c, a]);
            }
        }

        onGenerateData(vertices, faces, edges);
    }, [curve, tubularSegments, radius, radialSegments, onGenerateData]);

    useFrame(() => {
        // Advance time and update the curve's points
        tRef.current += speed;
        // tRef.current %= 1; // Keep t within [0, 1] for looping
    });

    return (
        <mesh visible={visible}>
            <tubeGeometry
                args={[curve, tubularSegments, radius, radialSegments, true]}
            />
            <meshStandardMaterial wireframe={wireframe} />
        </mesh>
    );
}
