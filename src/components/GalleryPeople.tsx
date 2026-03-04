import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface PersonProps {
  position: [number, number, number]
  rotation?: number
  looking?: 'left' | 'right' | 'forward'
  holdingWine?: boolean
  color?: string
}

function Person({ position, rotation = 0, looking = 'forward', holdingWine = false, color = '#2a2a2a' }: PersonProps) {
  const groupRef = useRef<THREE.Group>(null)
  const headTilt = looking === 'left' ? 0.15 : looking === 'right' ? -0.15 : 0

  // Subtle idle sway animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = rotation + Math.sin(state.clock.elapsedTime * 0.3 + position[0]) * 0.02
    }
  })

  return (
    <group ref={groupRef} position={position} rotation={[0, rotation, 0]}>
      {/* Body - torso */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <capsuleGeometry args={[0.15, 0.45, 8, 12]} />
        <meshStandardMaterial color={color} roughness={0.8} metalness={0.05} />
      </mesh>

      {/* Head */}
      <group rotation={[0, headTilt, 0]}>
        <mesh position={[0, 1.35, 0]} castShadow>
          <sphereGeometry args={[0.1, 12, 10]} />
          <meshStandardMaterial color={color} roughness={0.7} metalness={0.05} />
        </mesh>
      </group>

      {/* Neck */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 0.1, 8]} />
        <meshStandardMaterial color={color} roughness={0.8} metalness={0.05} />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.06, 0.35, 0]} castShadow>
        <capsuleGeometry args={[0.055, 0.35, 6, 8]} />
        <meshStandardMaterial color={color} roughness={0.8} metalness={0.05} />
      </mesh>
      <mesh position={[0.06, 0.35, 0]} castShadow>
        <capsuleGeometry args={[0.055, 0.35, 6, 8]} />
        <meshStandardMaterial color={color} roughness={0.8} metalness={0.05} />
      </mesh>

      {/* Left arm */}
      <mesh position={[-0.2, 0.9, 0]} rotation={[0, 0, 0.15]} castShadow>
        <capsuleGeometry args={[0.035, 0.3, 6, 8]} />
        <meshStandardMaterial color={color} roughness={0.8} metalness={0.05} />
      </mesh>

      {/* Right arm - if holding wine, bent upward */}
      {holdingWine ? (
        <group>
          <mesh position={[0.2, 0.9, 0.05]} rotation={[-0.8, 0, -0.2]} castShadow>
            <capsuleGeometry args={[0.035, 0.2, 6, 8]} />
            <meshStandardMaterial color={color} roughness={0.8} metalness={0.05} />
          </mesh>
          {/* Wine glass */}
          <group position={[0.22, 1.05, 0.15]}>
            <mesh>
              <sphereGeometry args={[0.025, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshPhysicalMaterial color="#ffffff" transmission={0.8} roughness={0.05} transparent opacity={0.3} />
            </mesh>
            <mesh position={[0, -0.04, 0]}>
              <cylinderGeometry args={[0.003, 0.003, 0.04, 6]} />
              <meshPhysicalMaterial color="#ffffff" transmission={0.7} roughness={0.1} transparent opacity={0.3} />
            </mesh>
            <mesh position={[0, -0.005, 0]}>
              <sphereGeometry args={[0.02, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2.5]} />
              <meshStandardMaterial color="#6a1525" roughness={0.1} metalness={0.1} />
            </mesh>
          </group>
        </group>
      ) : (
        <mesh position={[0.2, 0.9, 0]} rotation={[0, 0, -0.15]} castShadow>
          <capsuleGeometry args={[0.035, 0.3, 6, 8]} />
          <meshStandardMaterial color={color} roughness={0.8} metalness={0.05} />
        </mesh>
      )}
    </group>
  )
}

export default function GalleryPeople() {
  return (
    <group>
      {/* Person looking at left wall painting 1 */}
      <Person
        position={[-8, 0, -3]}
        rotation={-Math.PI / 2}
        looking="forward"
        color="#1a1a1a"
      />

      {/* Person at central column, looking at left face, holding wine */}
      <Person
        position={[-3, 0, 1]}
        rotation={Math.PI / 2}
        looking="left"
        holdingWine
        color="#2d2d2d"
      />

      {/* Two people chatting near the wine bar area */}
      <Person
        position={[6, 0, 7]}
        rotation={-Math.PI * 0.7}
        holdingWine
        color="#1e1e1e"
      />
      <Person
        position={[7.2, 0, 6.5]}
        rotation={Math.PI * 0.8}
        holdingWine
        color="#333333"
      />

      {/* Person looking at right wall */}
      <Person
        position={[8, 0, 0]}
        rotation={Math.PI / 2}
        looking="right"
        color="#252525"
      />

      {/* Person near back wall, contemplating */}
      <Person
        position={[3, 0, -7]}
        rotation={Math.PI}
        looking="left"
        color="#1c1c1c"
      />
    </group>
  )
}
