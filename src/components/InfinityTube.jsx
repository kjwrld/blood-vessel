import React, { useEffect, useMemo } from "react";
import * as THREE from "three";

export default function InfinityTube({
    tubularSegments = 100,
    radius = 0.4,
    radialSegments = 16,
    a = 5,
    scaleX = 0.75,
    scaleY = 1,
    scaleZ = 0.1,
    overallDistortion = 0.425,
    wireframe = false,
    visible = false,
    time = 0, // Time is now passed as a prop
    onGenerateData = () => {}, // Callback for vertices and edges
}) {
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

                // Infinity shape equation with dynamic offset based on time
                const x = this.a * Math.sin(angle + time) * this.scaleX;
                const y =
                    this.a *
                    Math.sin(angle + time) *
                    Math.cos(angle + time) *
                    this.scaleY;
                const z = this.a * Math.cos(angle + time) * this.scaleZ;

                // Apply distortion
                const distortion =
                    1 + this.overallDistortion * Math.sin((angle + time) * 2);

                const v_distortion =
                    1 +
                    this.overallDistortion *
                        -Math.cos((angle + time) * 2) *
                        1.25;

                return new THREE.Vector3(
                    x * distortion,
                    y * distortion * v_distortion,
                    z
                );
            }
        }

        return new InfinityCurve();
    }, [a, scaleX, scaleY, scaleZ, overallDistortion, time]);

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

        const positionAttribute = tubeGeometry.attributes.position;

        // Extract vertices
        for (let i = 0; i < positionAttribute.count; i++) {
            const vertex = new THREE.Vector3();
            vertex.fromBufferAttribute(positionAttribute, i);
            vertices.push(vertex);
        }

        // Generate edges
        for (let j = 0; j < tubularSegments; j++) {
            for (let i = 0; i < radialSegments; i++) {
                const a = i + j * (radialSegments + 1);
                const b =
                    ((i + 1) % (radialSegments + 1)) + j * (radialSegments + 1);
                const c = i + (j + 1) * (radialSegments + 1);
                const d =
                    ((i + 1) % (radialSegments + 1)) +
                    (j + 1) * (radialSegments + 1);

                edges.push([a, b], [b, d], [d, c], [c, a]);
            }
        }

        onGenerateData(vertices, edges);
    }, [curve, tubularSegments, radius, radialSegments, onGenerateData]);

    return (
        <mesh visible={visible}>
            <tubeGeometry
                args={[curve, tubularSegments, radius, radialSegments, true]}
            />
            <meshStandardMaterial wireframe={wireframe} />
        </mesh>
    );
}
