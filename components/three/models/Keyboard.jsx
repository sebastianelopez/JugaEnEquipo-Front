import { useGLTF } from "@react-three/drei";

export const Keyboard=(props)=>
{
  const { scene } = useGLTF("./models/Keyboard/model.gltf");
  return <primitive object={scene} {...props} />;
}
