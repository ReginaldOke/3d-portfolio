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

        const mat = mesh.material as THREE.Material

        // Make Art placeholders white — fills the wall recess behind our paintings
        if (mat.name === 'Art') {
          const artMat = mat as THREE.MeshStandardMaterial
          artMat.map = null
          artMat.emissiveMap = null
          artMat.color.set('#f0f0f0')
          artMat.emissive.set('#000000')
          artMat.roughness = 0.9
          artMat.metalness = 0.0
          artMat.needsUpdate = true
        }

        // Make Frame material white to fill wall recesses cleanly
        if (mat.name === 'Frame') {
          const frameMat = mat as THREE.MeshStandardMaterial
          frameMat.map = null
          frameMat.emissiveMap = null
          frameMat.color.set('#f0f0f0')
          frameMat.emissive.set('#000000')
          frameMat.roughness = 0.9
          frameMat.metalness = 0.0
          frameMat.needsUpdate = true
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
