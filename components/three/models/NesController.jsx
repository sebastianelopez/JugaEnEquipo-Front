import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export const NesController=(props)=>
{
  const group = useRef();
  const { nodes, materials } = useGLTF(
    './models/NesController/model.gltf'
  );

  
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh
        geometry={nodes.Plane030.geometry}
        material={materials["Material.033"]}
      />
      <mesh
        geometry={nodes.Plane030_1.geometry}
        material={materials["Material.032"]}
      />
      <mesh
        geometry={nodes.Plane009.geometry}
        material={nodes.Plane009.material}
      />
      <mesh
        geometry={nodes.Plane010.geometry}
        material={nodes.Plane010.material}
      />
      <mesh
        geometry={nodes.Cylinder002.geometry}
        material={materials["Material.034"]}
      />
      <mesh
        geometry={nodes.BezierCurve.geometry}
        material={nodes.BezierCurve.material}
      />
      <mesh geometry={nodes.Cube.geometry} material={nodes.Cube.material} />
    </group>
  );
}

