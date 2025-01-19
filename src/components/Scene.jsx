import React, { useState } from "react";
import InfinityTube from "./InfinityTube";
import Actor from "./Actor";

function Scene() {
    const [vertices, setVertices] = useState([]);
    // const [faces, setFaces] = useState([]);
    const [edges, setEdges] = useState([]);

    const handleGenerateData = (vertices, faces, edges) => {
        setVertices(vertices);
        // setFaces(faces);
        setEdges(edges);
    };

    return (
        <group>
            <InfinityTube onGenerateData={handleGenerateData} />
            {edges.length > 0 &&
                Array.from({ length: 300 }).map((_, i) => (
                    <Actor
                        key={i}
                        vertices={vertices}
                        edges={edges}
                        speed={0.1}
                    />
                ))}
        </group>
    );
}

export default Scene;
