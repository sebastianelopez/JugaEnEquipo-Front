import React, { useRef } from "react";
import * as THREE from "three";
import {
  CubeTextureLoader,
  CubeCamera,
  WebGLCubeRenderTarget,
  RGBFormat,
  LinearMipmapLinearFilter,
} from "three";
import { useLoader, useThree, useFrame } from "@react-three/fiber";
import {
  Sphere,
  PresentationControls,
  Float,
  ContactShadows,
  Environment,
  Stars,
  Sparkles,
  useTexture,
  Billboard,
  Shadow,
  MeshDistortMaterial,
} from "@react-three/drei";
import { LayerMaterial, Depth } from "lamina";

const Experience = () => {
  return (
    <>
      <color attach="background" args={["black"]} />
      <PresentationControls
        global
        rotation={[0.13, 0.13, 0.13]}
        config={{ mass: 1, tension: 30, friction: 26 }}
      >
        <Float rotation={[0, Math.PI / 2, 0]}>
          <hemisphereLight intensity={0.5} color="white" groundColor="black" />
          <SphereWithCircles />
        </Float>
      </PresentationControls>
      <Stars radius={500} depth={50} count={1000} factor={10} />
      <Sparkles
        count={50}
        scale={4}
        size={2}
        speed={0.4}
        rotation={[0, 0, 0]}
        color="yellow"
      />

      <ContactShadows position-y={-1.4} opacity={0.2} scale={5} blur={2.4} />
    </>
  );
};

export default Experience;

const CircleOnSphere = ({ position, rotation, imageUrl }) => {
  const texture = useLoader(THREE.TextureLoader, imageUrl);

  // Ajustar el modo de repetición de la textura
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;

  // Calcular el factor de repetición de la textura según el aspecto de la imagen y el círculo
  const imageAspect = texture.image.height / texture.image.width;
  const circleAspect = 0.2 / 0.2; // El radio del círculo en ambos ejes
  let repeatX, repeatY;
  if (imageAspect > circleAspect) {
    // La imagen es más alta que el círculo
    repeatX = 1;
    repeatY = circleAspect / imageAspect;
  } else {
    // La imagen es más ancha que el círculo
    repeatX = imageAspect / circleAspect;
    repeatY = 1;
  }

  // Aplicar el factor de repetición a la textura
  texture.repeat.set(repeatX, repeatY);

  // Centrar la textura en el círculo
  texture.offset.x = (1 - repeatX) / 2;
  texture.offset.y = (1 - repeatY) / 2;

  return (
    <mesh position={position} rotation={rotation}>
      <circleBufferGeometry args={[0.2, 32]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
};

const SphereWithCircles = () => {
  const sphereRef = useRef();

  const circlePositions = [
    [1, 0, 0],
    [-1, 0, 0],
    [0, 1, 0],
    [0, -1, 0],
    [0, 0, 1],
    [0, 0, -1],
  ];

  const circleRotations = [
    [0, Math.PI / 2, 0],
    [0, -Math.PI / 2, 0],
    [-Math.PI / 2, 0, 0],
    [Math.PI / 2, 0, 0],
    [0, 0, 0],
    [Math.PI, 0, 0],
  ];

  const imageUrl = "assets/images.jpg";

  return (
    <group ref={sphereRef} scale={1.5}>
      <Sphere args={[1, 32, 32]}>
        <meshPhysicalMaterial
          clearcoat={1}
          clearcoatRoughness={0}
          roughness={0}
          metalness={0.5}
          color="purple"
        />
         
        <Environment path="assets/space" />
      </Sphere>
      {circlePositions.map((position, index) => (
        <CircleOnSphere
          key={index}
          position={position}
          rotation={circleRotations[index]}
          imageUrl={imageUrl}
        />
      ))}
    </group>
  );
};

