import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

export default function CityWindow() {
  const { camera } = useThree()
  const imageRef = useRef<THREE.Mesh>(null)

  const texture = useTexture('/textures/cityscape.jpg')

  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
  }, [texture])

  // Window dimensions
  const winW = 4
  const winH = 3

  // Position on the front wall (z = D/2 = 10), left side
  const windowPos: [number, number, number] = [-6, 3, 9.95]

  // Parallax effect - image moves slightly based on camera position
  useFrame(() => {
    if (imageRef.current) {
      // Calculate parallax offset based on camera position relative to window
      const dx = (camera.position.x - windowPos[0]) * 0.03
      const dy = (camera.position.y - windowPos[1]) * 0.02
      imageRef.current.position.x = -dx
      imageRef.current.position.y = -dy
    }
  })

  return (
    <group position={windowPos} rotation={[0, Math.PI, 0]}>
      {/* Window recess / depth */}
      <mesh position={[0, 0, 0.15]}>
        <boxGeometry args={[winW + 0.3, winH + 0.3, 0.3]} />
        <meshStandardMaterial color="#f0ede8" roughness={0.85} side={THREE.BackSide} />
      </mesh>

      {/* Cityscape image - slightly larger than window for parallax overflow */}
      <group position={[0, 0, 0.28]}>
        {/* Clip the image to the window bounds */}
        <mesh ref={imageRef}>
          <planeGeometry args={[winW + 1.5, winH + 1]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
      </group>

      {/* Window mask - covers overflow areas */}
      {/* Top mask */}
      <mesh position={[0, winH / 2 + 0.75, 0.25]}>
        <planeGeometry args={[winW + 3, 1.5]} />
        <meshStandardMaterial color="#f8f6f3" />
      </mesh>
      {/* Bottom mask */}
      <mesh position={[0, -winH / 2 - 0.75, 0.25]}>
        <planeGeometry args={[winW + 3, 1.5]} />
        <meshStandardMaterial color="#f8f6f3" />
      </mesh>
      {/* Left mask */}
      <mesh position={[-winW / 2 - 0.85, 0, 0.25]}>
        <planeGeometry args={[1.7, winH + 3]} />
        <meshStandardMaterial color="#f8f6f3" />
      </mesh>
      {/* Right mask */}
      <mesh position={[winW / 2 + 0.85, 0, 0.25]}>
        <planeGeometry args={[1.7, winH + 3]} />
        <meshStandardMaterial color="#f8f6f3" />
      </mesh>

      {/* Window frame */}
      {/* Top frame */}
      <mesh position={[0, winH / 2 + 0.06, 0.3]}>
        <boxGeometry args={[winW + 0.16, 0.12, 0.08]} />
        <meshStandardMaterial color="#e0ddd8" roughness={0.4} metalness={0.05} />
      </mesh>
      {/* Bottom frame / sill */}
      <mesh position={[0, -winH / 2 - 0.06, 0.32]}>
        <boxGeometry args={[winW + 0.2, 0.12, 0.14]} />
        <meshStandardMaterial color="#e0ddd8" roughness={0.4} metalness={0.05} />
      </mesh>
      {/* Left frame */}
      <mesh position={[-winW / 2 - 0.06, 0, 0.3]}>
        <boxGeometry args={[0.12, winH + 0.24, 0.08]} />
        <meshStandardMaterial color="#e0ddd8" roughness={0.4} metalness={0.05} />
      </mesh>
      {/* Right frame */}
      <mesh position={[winW / 2 + 0.06, 0, 0.3]}>
        <boxGeometry args={[0.12, winH + 0.24, 0.08]} />
        <meshStandardMaterial color="#e0ddd8" roughness={0.4} metalness={0.05} />
      </mesh>

      {/* Mullions (dividers) */}
      <mesh position={[0, 0, 0.31]}>
        <boxGeometry args={[0.04, winH, 0.04]} />
        <meshStandardMaterial color="#ddd9d3" roughness={0.4} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.4, 0.31]}>
        <boxGeometry args={[winW, 0.04, 0.04]} />
        <meshStandardMaterial color="#ddd9d3" roughness={0.4} metalness={0.05} />
      </mesh>

      {/* Glass overlay - very subtle */}
      <mesh position={[0, 0, 0.32]}>
        <planeGeometry args={[winW, winH]} />
        <meshPhysicalMaterial
          color="#a5c0d5"
          transmission={0.15}
          roughness={0.02}
          transparent
          opacity={0.06}
        />
      </mesh>

      {/* Light streaming in from window */}
      <spotLight
        position={[0, 1, 2]}
        target-position={[2, 0, -3]}
        intensity={1.5}
        color="#ffecd2"
        angle={0.8}
        penumbra={0.9}
        distance={12}
        castShadow={false}
      />
    </group>
  )
}
