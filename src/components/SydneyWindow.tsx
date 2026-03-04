import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Cloud({ position, scale = 1, speed = 0.1 }: {
  position: [number, number, number]
  scale?: number
  speed?: number
}) {
  const ref = useRef<THREE.Group>(null)
  const startX = position[0]

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.x = startX + Math.sin(state.clock.elapsedTime * speed + startX) * 0.3
    }
  })

  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh>
        <sphereGeometry args={[0.15, 8, 6]} />
        <meshBasicMaterial color="#d8dde8" transparent opacity={0.8} />
      </mesh>
      <mesh position={[0.12, 0.03, 0]}>
        <sphereGeometry args={[0.1, 8, 6]} />
        <meshBasicMaterial color="#d0d5e0" transparent opacity={0.7} />
      </mesh>
      <mesh position={[-0.1, 0.02, 0]}>
        <sphereGeometry args={[0.12, 8, 6]} />
        <meshBasicMaterial color="#cdd2dc" transparent opacity={0.75} />
      </mesh>
    </group>
  )
}

function Building({ position, width, height, color }: {
  position: [number, number, number]
  width: number
  height: number
  color: string
}) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[width, height, 0.1]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {/* Windows */}
      {Array.from({ length: Math.floor(height / 0.15) }).map((_, row) =>
        Array.from({ length: Math.floor(width / 0.12) }).map((_, col) => (
          <mesh
            key={`window-${row}-${col}`}
            position={[
              -width / 2 + 0.08 + col * 0.12,
              -height / 2 + 0.1 + row * 0.15,
              0.051,
            ]}
          >
            <planeGeometry args={[0.05, 0.07]} />
            <meshBasicMaterial
              color={Math.random() > 0.3 ? '#8ab4d6' : '#ffeebb'}
            />
          </mesh>
        ))
      )}
    </group>
  )
}

export default function SydneyWindow() {
  // Position on front-left wall area
  const windowPos: [number, number, number] = [-6, 2.5, 7.99]
  const windowWidth = 2.5
  const windowHeight = 2.0

  return (
    <group position={windowPos}>
      {/* Window frame */}
      {/* Top */}
      <mesh position={[0, windowHeight / 2 + 0.04, 0]}>
        <boxGeometry args={[windowWidth + 0.16, 0.08, 0.12]} />
        <meshStandardMaterial color="#e8e4de" roughness={0.5} metalness={0.05} />
      </mesh>
      {/* Bottom */}
      <mesh position={[0, -windowHeight / 2 - 0.04, 0]}>
        <boxGeometry args={[windowWidth + 0.16, 0.08, 0.15]} />
        <meshStandardMaterial color="#e8e4de" roughness={0.5} metalness={0.05} />
      </mesh>
      {/* Left */}
      <mesh position={[-windowWidth / 2 - 0.04, 0, 0]}>
        <boxGeometry args={[0.08, windowHeight + 0.16, 0.12]} />
        <meshStandardMaterial color="#e8e4de" roughness={0.5} metalness={0.05} />
      </mesh>
      {/* Right */}
      <mesh position={[windowWidth / 2 + 0.04, 0, 0]}>
        <boxGeometry args={[0.08, windowHeight + 0.16, 0.12]} />
        <meshStandardMaterial color="#e8e4de" roughness={0.5} metalness={0.05} />
      </mesh>
      {/* Center divider vertical */}
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[0.03, windowHeight, 0.04]} />
        <meshStandardMaterial color="#e0dcd6" roughness={0.5} metalness={0.05} />
      </mesh>
      {/* Center divider horizontal */}
      <mesh position={[0, 0.2, 0.02]}>
        <boxGeometry args={[windowWidth, 0.03, 0.04]} />
        <meshStandardMaterial color="#e0dcd6" roughness={0.5} metalness={0.05} />
      </mesh>

      {/* Window glass with scene behind */}
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[windowWidth, windowHeight]} />
        <meshPhysicalMaterial
          color="#87a5c0"
          transmission={0.3}
          roughness={0.05}
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Sydney scene behind window */}
      <group position={[0, 0, -0.15]}>
        {/* Sky gradient */}
        <mesh position={[0, 0.3, -0.5]}>
          <planeGeometry args={[5, 3]} />
          <meshBasicMaterial color="#7ba7cc" />
        </mesh>

        {/* Warm lower sky */}
        <mesh position={[0, -0.3, -0.49]}>
          <planeGeometry args={[5, 1.5]} />
          <meshBasicMaterial color="#a8c6de" />
        </mesh>

        {/* Sydney skyline - buildings */}
        <Building position={[-0.8, -0.2, -0.3]} width={0.3} height={0.8} color="#6b7b8d" />
        <Building position={[-0.4, -0.1, -0.3]} width={0.25} height={1.0} color="#5a6a7c" />
        <Building position={[0, 0.1, -0.3]} width={0.2} height={1.3} color="#7a8a9c" />
        <Building position={[0.3, -0.15, -0.3]} width={0.35} height={0.9} color="#6a7a8c" />
        <Building position={[0.7, -0.3, -0.3]} width={0.3} height={0.6} color="#5a6a7a" />
        <Building position={[1.0, -0.2, -0.3]} width={0.25} height={0.8} color="#6b7a8a" />

        {/* Trees / greenery at street level */}
        <mesh position={[0, -0.65, -0.25]}>
          <planeGeometry args={[5, 0.3]} />
          <meshBasicMaterial color="#4a6a4a" />
        </mesh>

        {/* Street */}
        <mesh position={[0, -0.82, -0.25]}>
          <planeGeometry args={[5, 0.1]} />
          <meshBasicMaterial color="#555555" />
        </mesh>

        {/* Clouds */}
        <Cloud position={[-0.6, 0.6, -0.2]} scale={0.7} speed={0.08} />
        <Cloud position={[0.4, 0.7, -0.25]} scale={0.5} speed={0.12} />
        <Cloud position={[1.0, 0.55, -0.2]} scale={0.6} speed={0.06} />
      </group>

      {/* Window light casting into room */}
      <pointLight
        position={[0, 0, 0.5]}
        intensity={0.5}
        color="#b5cee0"
        distance={6}
      />
    </group>
  )
}
