import React, { useState,Suspense } from "react";
import { Cloud, Environment, Lightformer, OrbitControls,  } from '@react-three/drei'
import { useSpring } from '@react-spring/core'
import { Cat, Computer, Ground, Headphones, Intro, Keyboard, NesController, Text, Title } from "./models";


const Experience = ({ portal }) => {
  
  const [open, setOpen] = useState(false)
  // We turn this into a spring animation that interpolates between 0 and 1
  const props = useSpring({ open: Number(open) })

  
  return (
    <>    
    <color attach="background" args={['black']} />
      <fog attach="fog" args={['black', 15, 20]} />
      <Suspense fallback={null}>
        <group position={[0, -1, 0]}>
          <Cloud position={[0, 4, -2.5]} width={2} segments={1} speed={0.1} opacity={0.5} />
          <Title position={[0, 1.3, -2]} scale={0.3} />
          <Cat position={ [ -3, 0, -1.5 ] } rotation-y={ -0.6 } scale={ 0.03 } />
        
          <Text rotation={[-Math.PI / 2, 0, 0.8]} position={[-2.2, 0, 0.8]} scale={0.1}>
            {"E - Sports"}
          </Text>
          
          <group rotation={[0, 0, 0]} scale={0.3} position={[0,1.2,0]} onClick={(e) => (e.stopPropagation(), setOpen(!open))}>
            <Computer open={true} hinge={props.open.to([0, 1], [1.575, -0.425])} portal={portal} castShadow />            
          </group>     
          
          <Headphones position={[4, 0, -1]} rotation={[0, -1, 0]} scale={0.5} />

          <NesController position={[2, 0.1, 3]}  rotation={[0, -1, 0]} />

          <Keyboard position={[-3, 0, 3.5]} rotation={[0, 1, 0]} scale={0.5} />
                      
          
          <Ground scale={30} />
        </group>
        <ambientLight intensity={0.20} />  
        
        <Intro />
      </Suspense>      

      <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
      
    </>
  );
};

export default Experience;

