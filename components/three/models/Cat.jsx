import * as THREE from 'three'
import { useAnimations, useGLTF } from '@react-three/drei'
import { useControls } from 'leva'
import { applyProps } from '@react-three/fiber'
import { useEffect, useLayoutEffect } from 'react'
import { FlakesTexture } from 'three-stdlib'

export const Cat=(props)=>
{
    const cat = useGLTF('./models/Cat/scene.gltf')
    const animations = useAnimations(cat.animations, cat.scene)

    const { animationName } = useControls({
        animationName: { options: animations.names }
    })

    useEffect(() =>
    {
        const action = animations.actions[animationName]
        action
            .reset()
            .fadeIn(0.5)
            .play()

        return () =>
        {
            action.fadeOut(0.5)
        }
    }, [ animationName ])

    return <primitive
         {...props}
        object={ cat.scene }        
        castShadow = {true}        
    />
}

