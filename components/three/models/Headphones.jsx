import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export const Headphones=(props)=>
{
  const { scene } = useGLTF("./models/Headphones/model.gltf");

  const HeadphonesRef = useRef();

  useFrame((state, delta) => {   
    HeadphonesRef.current.rotation.y += 0.01;
  });


  return <group>
    <primitive object={scene} {...props} ref={HeadphonesRef} />
    <spotLight position={[-10,10,3]} intensity={3} angle={0.20} penumbra={1}  />
  </group>;
}
