import React from 'react'
import { Reflector,  useTexture } from '@react-three/drei'

export const Ground=()=>
{
    const [floor, normal] = useTexture(['/models/Ground/SurfaceImperfections003_1K_var1.jpg', '/models/Ground/SurfaceImperfections003_1K_Normal.jpg'])
    return (
      <Reflector blur={[400, 100]} resolution={1080} args={[40, 40]} mirror={0.5} mixBlur={6} mixStrength={1.5} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        {(Material, props) => <Material color="#a0a0a0" metalness={0.4} roughnessMap={floor} normalMap={normal} normalScale={[2, 2]} {...props} />}
      </Reflector>
    )
  }