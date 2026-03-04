import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

interface PersonProps {
  url: string
  position: [number, number, number]
  rotation?: number
  scale?: number
}

function Person({ url, position, rotation = 0, scale = 0.01 }: PersonProps) {
  const groupRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF(url)

  // Clone the scene so each instance is independent
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true)
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        mesh.castShadow = true
        mesh.receiveShadow = true
        // Clone materials so they're independent
        if (mesh.material) {
          mesh.material = (mesh.material as THREE.Material).clone()
        }
      }
    })
    return clone
  }, [scene])

  // Subtle idle sway
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y =
        rotation + Math.sin(state.clock.elapsedTime * 0.3 + position[0]) * 0.02
    }
  })

  return (
    <group ref={groupRef} position={position} rotation={[0, rotation, 0]}>
      <primitive object={clonedScene} scale={[scale, scale, scale]} />
    </group>
  )
}

// Preload all models
useGLTF.preload('/models/dennis.glb')
useGLTF.preload('/models/fabienne.glb')
useGLTF.preload('/models/mei.glb')
useGLTF.preload('/models/person4.glb')

export default function GalleryPeople() {
  return (
    <group>
      {/* Dennis — looking at left wall middle painting */}
      <Person
        url="/models/dennis.glb"
        position={[-2.8, 0, 0.5]}
        rotation={-Math.PI / 2}
      />

      {/* Fabienne — near front, looking at right wall */}
      <Person
        url="/models/fabienne.glb"
        position={[1.5, 0, 4]}
        rotation={Math.PI / 2}
      />

      {/* Mei — near back, looking at left wall */}
      <Person
        url="/models/mei.glb"
        position={[-1.5, 0, -4]}
        rotation={-Math.PI / 2}
      />

      {/* Person 4 — in front of right wall back painting */}
      <Person
        url="/models/person4.glb"
        position={[2.5, 0, -5.2]}
        rotation={Math.PI / 2}
      />
    </group>
  )
}
