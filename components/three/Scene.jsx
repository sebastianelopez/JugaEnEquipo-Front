import { Canvas } from "@react-three/fiber";
import React, {useRef} from "react";
import Experience from "./Experience";

export default function Scene({ ...props }) {
  const domContent = useRef();

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
        ref={domContent}
      />
      <Canvas {...props} concurrent gl={{ alpha: false }} camera={{ position: [0, 3, 100], fov: 18 }} >
        <Experience portal={domContent} />
      </Canvas>
    </>
  );
}
