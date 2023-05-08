import { height } from "@mui/system";
import { Canvas } from "@react-three/fiber";
import React, { useRef } from "react";
import Experience from "./Experience";

export default function Scene() {
  return (
    <>
      <Canvas>
        <Experience />
      </Canvas>
    </>
  );
}
