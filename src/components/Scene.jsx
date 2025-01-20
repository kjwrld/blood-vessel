import React, { useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import InfinityTube from "./InfinityTube";
import Actor from "./Actor";

function Scene() {
    const [vertices, setVertices] = useState([]);
    const [edges, setEdges] = useState([]);
    const timeRef = useRef(1);

    useFrame((_, delta) => {
        timeRef.current += delta * 0.5; // Adjust speed as necessary
    });

    return (
        <group>
            <InfinityTube
                time={0} // Pass time to InfinityTube
                onGenerateData={(v, e) => {
                    setVertices(v);
                    setEdges(e);
                }}
            />
            {edges.length > 0 &&
                Array.from({ length: 500 }).map((_, i) => (
                    <Actor
                        key={i}
                        vertices={vertices}
                        edges={edges}
                        speed={0.1}
                        time={timeRef.current} // Pass time to Actor
                    />
                ))}
        </group>
    );
}

export default Scene;
