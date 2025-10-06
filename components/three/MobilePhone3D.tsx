import React, { useRef, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBox, useTexture } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";

interface MobilePhone3DProps {
  screenImage: string;
  rotation?: [number, number, number];
  scale?: number;
}

const PhoneModel: React.FC<MobilePhone3DProps> = ({
  screenImage,
  rotation = [0, 0, 0],
  scale = 1,
}) => {
  const phoneRef = useRef<THREE.Group>(null);
  const screenTexture = useLoader(THREE.TextureLoader, screenImage);

  // Subtle floating animation
  useFrame((state) => {
    if (phoneRef.current) {
      phoneRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={phoneRef} rotation={rotation} scale={scale}>
      {/* Phone body - with rounded corners */}
      <RoundedBox
        args={[1.8, 3.6, 0.15]} // width, height, depth
        radius={0.15}
        smoothness={4}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.9}
          roughness={0.2}
          envMapIntensity={1}
        />
      </RoundedBox>

      {/* Screen */}
      <mesh position={[0, 0.05, 0.08]}>
        <planeGeometry args={[1.6, 3.3]} /> {/* Ancho: 1.6, Alto: 3.3 */}
        <meshBasicMaterial map={screenTexture} />
      </mesh>

      {/* Camera notch */}
      <mesh position={[0, 1.6, 0.08]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.03, 0.2, 4, 8]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Camera lens */}
      <mesh position={[0.08, 1.6, 0.09]}>
        <circleGeometry args={[0.04, 32]} />
        <meshStandardMaterial
          color="#1a3a5a"
          metalness={0.9}
          roughness={0.1}
          emissive="#0a1a2a"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Side buttons - Volume up */}
      <RoundedBox
        args={[0.05, 0.3, 0.05]}
        radius={0.01}
        smoothness={2}
        position={[-0.95, 0.8, 0]}
        rotation={[0, 0, 0]}
      >
        <meshStandardMaterial color="#0a0a0a" metalness={0.8} roughness={0.3} />
      </RoundedBox>

      {/* Volume down */}
      <RoundedBox
        args={[0.05, 0.3, 0.05]}
        radius={0.01}
        smoothness={2}
        position={[-0.95, 0.3, 0]}
        rotation={[0, 0, 0]}
      >
        <meshStandardMaterial color="#0a0a0a" metalness={0.8} roughness={0.3} />
      </RoundedBox>

      {/* Power button */}
      <RoundedBox
        args={[0.05, 0.4, 0.05]}
        radius={0.01}
        smoothness={2}
        position={[0.95, 0.5, 0]}
        rotation={[0, 0, 0]}
      >
        <meshStandardMaterial color="#0a0a0a" metalness={0.8} roughness={0.3} />
      </RoundedBox>

      {/* Bottom speaker grille - left */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh
          key={`speaker-left-${i}`}
          position={[-0.3 + i * 0.08, -1.65, 0.08]}
        >
          <cylinderGeometry args={[0.015, 0.015, 0.02, 16]} />
          <meshStandardMaterial
            color="#0a0a0a"
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>
      ))}

      {/* USB-C port */}
      <RoundedBox
        args={[0.15, 0.05, 0.03]}
        radius={0.01}
        smoothness={2}
        position={[0, -1.75, 0.06]}
      >
        <meshStandardMaterial color="#0a0a0a" metalness={0.5} roughness={0.5} />
      </RoundedBox>

      {/* Ambient light reflection on screen edges */}
      <mesh position={[0, 0.05, 0.081]}>
        <planeGeometry args={[1.58, 3.28]} />
        <meshStandardMaterial
          transparent
          opacity={0.1}
          color="#ffffff"
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

export const MobilePhone3D: React.FC<MobilePhone3DProps> = (props) => {
  return (
    <Suspense fallback={null}>
      <PhoneModel {...props} />
    </Suspense>
  );
};
