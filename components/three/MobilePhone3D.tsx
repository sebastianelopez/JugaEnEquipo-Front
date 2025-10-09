import React, { useRef, Suspense, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

interface MobilePhone3DProps {
  screenImage: string;
  rotation?: [number, number, number];
  scale?: number;
}

type GLTFResult = GLTF & {
  nodes: {
    Circle038: THREE.Mesh;
    Circle038_1: THREE.Mesh;
    Circle038_2: THREE.Mesh;
    Circle038_3: THREE.Mesh;
    Circle038_4: THREE.Mesh;
    AntennaLineTop001: THREE.Mesh;
    AntennaLineBottom001: THREE.Mesh;
    BackCameraBottomLens001: THREE.Mesh;
    AppleLogo001: THREE.Mesh;
    BackCameraBottomGreyRing001: THREE.Mesh;
    BackCameraTopLens001: THREE.Mesh;
    BackCameraP1001: THREE.Mesh;
    FrontSpeakerBG001: THREE.Mesh;
    CameraBump001: THREE.Mesh;
    BackCameraTopGreyRing001: THREE.Mesh;
    FlashBG001: THREE.Mesh;
    iPhoneLogo001: THREE.Mesh;
    MuteSwitch001: THREE.Mesh;
    FrontCameraContainer001: THREE.Mesh;
    Circle032: THREE.Mesh;
    Circle032_1: THREE.Mesh;
    VolumeButtons001: THREE.Mesh;
    Circle031: THREE.Mesh;
    Circle031_1: THREE.Mesh;
    SCREEN: THREE.Mesh;
  };
  materials: {
    ["FrameGrey.001"]: THREE.MeshStandardMaterial;
    ["Front.001"]: THREE.MeshStandardMaterial;
    ["Antennaline.001"]: THREE.MeshStandardMaterial;
    ["BackGrey.001"]: THREE.MeshStandardMaterial;
    ["Rubber.001"]: THREE.MeshStandardMaterial;
    ["Lens.001"]: THREE.MeshStandardMaterial;
    ["AppleLogo.001"]: THREE.MeshStandardMaterial;
    ["BackCaneraGrayRIng.002"]: THREE.MeshStandardMaterial;
    ["Black.015"]: THREE.MeshStandardMaterial;
    ["FrontSpeaker.001"]: THREE.MeshStandardMaterial;
    ["Frame.001"]: THREE.MeshStandardMaterial;
    ["PinkFlash.002"]: THREE.MeshStandardMaterial;
    ["iPhoneLogo.001"]: THREE.MeshStandardMaterial;
    ["FrontCameraBlack.002"]: THREE.MeshStandardMaterial;
    ["Black.014"]: THREE.MeshStandardMaterial;
    ["Display.002"]: THREE.MeshStandardMaterial;
  };
};

const PhoneModel: React.FC<MobilePhone3DProps> = ({
  screenImage,
  rotation = [0, 0, 0],
  scale = 1,
}) => {
  const phoneRef = useRef<THREE.Group>(null);
  const { nodes, materials } = useGLTF(
    "/mobile-phone.gltf"
  ) as unknown as GLTFResult;
  const screenTexture = useLoader(THREE.TextureLoader, screenImage);

  useEffect(() => {
    if (screenTexture) {
      screenTexture.flipY = false;
    }
  }, [screenTexture]);

  useEffect(() => {
    const geometry = nodes.SCREEN.geometry as THREE.BufferGeometry;
    const positionAttribute = geometry.getAttribute("position") as
      | THREE.BufferAttribute
      | undefined;
    if (!positionAttribute) return;
    geometry.computeBoundingBox();
    const bb = geometry.boundingBox;
    if (!bb) return;
    const width = bb.max.x - bb.min.x || 1;
    const height = bb.max.y - bb.min.y || 1;
    const uvArray = new Float32Array(positionAttribute.count * 2);
    for (let i = 0; i < positionAttribute.count; i++) {
      const x = positionAttribute.getX(i);
      const y = positionAttribute.getY(i);
      const u = (x - bb.min.x) / width;
      const v = 1 - (y - bb.min.y) / height; // flip V to match typical texture orientation
      uvArray[i * 2] = u;
      uvArray[i * 2 + 1] = v;
    }
    geometry.setAttribute("uv", new THREE.BufferAttribute(uvArray, 2));
    (geometry.attributes.uv as THREE.BufferAttribute).needsUpdate = true;
  }, [nodes.SCREEN.geometry]);

  // Subtle floating animation
  useFrame((state) => {
    if (phoneRef.current) {
      phoneRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={phoneRef} rotation={rotation} scale={scale} dispose={null}>
      <group position={[0, 0.5, 0]}>
        <mesh
          geometry={nodes.Circle038.geometry}
          material={nodes.Circle038.material}
        />
        <mesh
          geometry={nodes.Circle038_1.geometry}
          material={materials["Front.001"]}
        />
        <mesh
          geometry={nodes.Circle038_2.geometry}
          material={nodes.Circle038_2.material}
        />
        <mesh
          geometry={nodes.Circle038_3.geometry}
          material={materials["BackGrey.001"]}
        />
        <mesh
          geometry={nodes.Circle038_4.geometry}
          material={materials["Rubber.001"]}
        />
        <mesh
          geometry={nodes.AntennaLineTop001.geometry}
          material={nodes.AntennaLineTop001.material}
          position={[0, 0.02, 0]}
        />
        <mesh
          geometry={nodes.AntennaLineBottom001.geometry}
          material={nodes.AntennaLineBottom001.material}
          position={[0, -2.68, 0]}
        />
        <mesh
          geometry={nodes.BackCameraBottomLens001.geometry}
          material={nodes.BackCameraBottomLens001.material}
          position={[0.7, 0.88, -0.08]}
        />
        <mesh
          geometry={nodes.AppleLogo001.geometry}
          material={materials["AppleLogo.001"]}
          position={[0.17, 0.52, -0.08]}
        />
        <mesh
          geometry={nodes.BackCameraBottomGreyRing001.geometry}
          material={nodes.BackCameraBottomGreyRing001.material}
          position={[0.7, 0.88, -0.09]}
        />
        <mesh
          geometry={nodes.BackCameraTopLens001.geometry}
          material={nodes.BackCameraTopLens001.material}
          position={[0.7, 1.18, -0.08]}
        />
        <mesh
          geometry={nodes.BackCameraP1001.geometry}
          material={materials["Black.015"]}
          position={[0.7, 1.03, -0.09]}
        />
        <mesh
          geometry={nodes.FrontSpeakerBG001.geometry}
          material={materials["FrontSpeaker.001"]}
          position={[0.16, 1.32, 0.08]}
        />
        <mesh
          geometry={nodes.CameraBump001.geometry}
          material={nodes.CameraBump001.material}
          position={[0.7, 1.04, -0.08]}
        />
        <mesh
          geometry={nodes.BackCameraTopGreyRing001.geometry}
          material={nodes.BackCameraTopGreyRing001.material}
          position={[0.7, 1.18, -0.09]}
        />
        <mesh
          geometry={nodes.FlashBG001.geometry}
          material={materials["PinkFlash.002"]}
          position={[0.71, 1.03, -0.09]}
        />
        <mesh
          geometry={nodes.iPhoneLogo001.geometry}
          material={materials["iPhoneLogo.001"]}
          position={[0.2, -1.18, -0.08]}
        />
        <mesh
          geometry={nodes.MuteSwitch001.geometry}
          material={nodes.MuteSwitch001.material}
          position={[-0.65, 0.92, 0.01]}
        />
        <mesh
          geometry={nodes.FrontCameraContainer001.geometry}
          material={materials["FrontCameraBlack.002"]}
          position={[0.34, 1.32, 0.08]}
        />
        <group position={[0.97, 0.56, 0]}>
          <mesh
            geometry={nodes.Circle032.geometry}
            material={nodes.Circle032.material}
          />
          <mesh
            geometry={nodes.Circle032_1.geometry}
            material={nodes.Circle032_1.material}
          />
        </group>
        <mesh
          geometry={nodes.VolumeButtons001.geometry}
          material={nodes.VolumeButtons001.material}
          position={[-0.66, 0.21, 0]}
        />
        <group position={[0.98, -0.04, 0]}>
          <mesh
            geometry={nodes.Circle031.geometry}
            material={materials["Black.014"]}
          />
          <mesh
            geometry={nodes.Circle031_1.geometry}
            material={nodes.Circle031_1.material}
          />
        </group>

        <mesh geometry={nodes.SCREEN.geometry}>
          <meshBasicMaterial
            attach="material"
            map={screenTexture}
            toneMapped={false}
          />
        </mesh>
      </group>
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

// Preload the model
useGLTF.preload("/mobile-phone.gltf");
