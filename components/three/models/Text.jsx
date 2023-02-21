import { RGBELoader } from 'three-stdlib'
import { Center, Environment, Lightformer, MeshTransmissionMaterial, Text3D } from "@react-three/drei"
import { useLoader } from "@react-three/fiber"
import { button, useControls } from 'leva'

export const Text=({ children, font = '/fonts/Inter_Medium_Regular.json', ...props })=>
{
    const texture = useLoader(RGBELoader, 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/aerodynamics_workshop_1k.hdr')

    const { autoRotate, text, shadow, ...config } = useControls({
        text: 'Inter',
        backside: false,
        samples: { value: 16, min: 1, max: 32, step: 1 },
        resolution: { value: 512, min: 64, max: 2048, step: 64 },
        transmission: { value: 0.6, min: 0, max: 1 },
        clearcoat: { value: 0, min: 0.1, max: 1 },
        clearcoatRoughness: { value: 0.0, min: 0, max: 1 },
        thickness: { value: 0.55, min: 0, max: 5 },
        chromaticAberration: { value: 5, min: 0, max: 5 },
        anisotropy: { value: 0.3, min: 0, max: 1, step: 0.01 },
        roughness: { value: 0.0, min: 0, max: 1, step: 0.01 },
        distortion: { value: 2.57, min: 0, max: 4, step: 0.01 },
        distortionScale: { value: 1, min: 0.01, max: 1, step: 0.01 },
        temporalDistortion: { value: 0.4, min: 0, max: 1, step: 0.01 },
        ior: { value: 0.83, min: 0, max: 2, step: 0.01 },
        color: '#c72020',
        gColor: '#ff7eb3',
        shadow: '#750d57',
        autoRotate: false,        
      })

    return (
      <>
          
        <group reflectivity={0}>
          <Center scale={[0.8, 1, 1]} front top {...props}>
            <Text3D
              castShadow
              bevelEnabled
              font={font}
              scale={5}
              letterSpacing={-0.03}
              height={0.25}
              bevelSize={0.01}
              bevelSegments={10}
              curveSegments={128}
              bevelThickness={0.01}>
              {children}
              <MeshTransmissionMaterial reflectivity={0.1} {...config} background={texture} />
            </Text3D>
          </Center>       
          <spotLight position={[0,5,0]} intensity={0.5} angle={5} penumbra={1}  />   
        </group>        
      </>
    )
  }