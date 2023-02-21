import * as THREE from 'three'
import { useFrame } from "@react-three/fiber"
import { useState } from "react"

export const Intro=(props)=>
{
    const [vec] = useState(() => new THREE.Vector3())
    return useFrame((state) => {
      state.camera.position.lerp(vec.set(state.mouse.x * 5, 3 + state.mouse.y * 2, 14), 0.05)
      state.camera.lookAt(0, 0, 0)
    })
  }