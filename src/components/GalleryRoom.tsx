import { useEffect, useRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'

useGLTF.preload('/models/gallery.glb')

export default function GalleryRoom() {
  const groupRef = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF('/models/gallery.glb')
  const { actions } = useAnimations(animations, groupRef)

  // Configure meshes and play water animation
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        mesh.receiveShadow = true
        mesh.castShadow = true

        // Hide Art placeholders and Frames — our Painting components replace them
        const mat = mesh.material as THREE.Material
        if (mat.name === 'Art' || mat.name === 'Frame') {
          mesh.visible = false
        }
      }
    })

    // Play the scene animation (water waves)
    const animNames = Object.keys(actions)
    if (animNames.length > 0) {
      const action = actions[animNames[0]]
      if (action) {
        action.setLoop(THREE.LoopRepeat, Infinity)
        action.play()
      }
    }
  }, [scene, actions])

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  )
}
