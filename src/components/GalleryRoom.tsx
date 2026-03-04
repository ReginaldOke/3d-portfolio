import { useEffect, useRef, useState } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'

useGLTF.preload('/models/gallery.glb')

// Wall patch positions — cover the frame recesses with wall surface
// Each: [x, y, z, rotY] where the patch faces into the room
const wallPatches = [
  // Left wall patches (facing +X)
  [-4.78, 1.754, 5.169, Math.PI / 2],
  [-4.78, 1.754, 0.002, Math.PI / 2],
  [-4.78, 1.754, -5.166, Math.PI / 2],
  // Right wall patches (facing -X)
  [4.78, 1.754, 5.169, -Math.PI / 2],
  [4.78, 1.754, 0.002, -Math.PI / 2],
  [4.78, 1.754, -5.166, -Math.PI / 2],
] as const

export default function GalleryRoom() {
  const groupRef = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF('/models/gallery.glb')
  const { actions } = useAnimations(animations, groupRef)
  const [wallMat, setWallMat] = useState<THREE.MeshStandardMaterial | null>(null)

  useEffect(() => {
    let foundWallMat: THREE.MeshStandardMaterial | null = null
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        mesh.receiveShadow = true
        mesh.castShadow = true

        const mat = mesh.material as THREE.Material

        // Hide Art and Frame meshes — replaced by wall patches + our Paintings
        if (mat.name === 'Art' || mat.name === 'Frame') {
          mesh.visible = false
        }

        // Grab the Wall material so patches match the wall texture
        if (mat.name === 'Wall' && !foundWallMat) {
          foundWallMat = (mat as THREE.MeshStandardMaterial).clone()
          foundWallMat.side = THREE.FrontSide
        }
      }
    })
    if (foundWallMat) setWallMat(foundWallMat)

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

      {/* Wall patches to cover frame recesses — uses cloned wall material */}
      {wallMat && wallPatches.map(([x, y, z, rotY], i) => (
        <mesh
          key={`patch-${i}`}
          position={[x, y, z]}
          rotation={[0, rotY, 0]}
          receiveShadow
        >
          <planeGeometry args={[1.8, 1.8]} />
          <primitive object={wallMat.clone()} attach="material" />
        </mesh>
      ))}
    </group>
  )
}
