import { useMemo } from 'react'
import * as THREE from 'three'

function WineBottle({ position, color = '#2d1f1f' }: { position: [number, number, number]; color?: string }) {
  return (
    <group position={position}>
      {/* Body */}
      <mesh castShadow>
        <cylinderGeometry args={[0.035, 0.04, 0.28, 12]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.3} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.015, 0.025, 0.15, 12]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.3} />
      </mesh>
      {/* Cap */}
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.016, 0.016, 0.02, 12]} />
        <meshStandardMaterial color="#c4a35a" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Label */}
      <mesh position={[0, 0.02, 0.041]} rotation={[0, 0, 0]}>
        <planeGeometry args={[0.05, 0.06]} />
        <meshStandardMaterial color="#f5f0e8" roughness={0.8} />
      </mesh>
    </group>
  )
}

function WineGlass({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Bowl */}
      <mesh castShadow>
        <sphereGeometry args={[0.03, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.9}
          roughness={0.05}
          thickness={0.5}
          transparent
          opacity={0.3}
        />
      </mesh>
      {/* Stem */}
      <mesh position={[0, -0.06, 0]}>
        <cylinderGeometry args={[0.003, 0.003, 0.07, 8]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.8} roughness={0.1} transparent opacity={0.3} />
      </mesh>
      {/* Base */}
      <mesh position={[0, -0.095, 0]}>
        <cylinderGeometry args={[0.02, 0.025, 0.005, 12]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.8} roughness={0.1} transparent opacity={0.4} />
      </mesh>
      {/* Wine inside */}
      <mesh position={[0, -0.005, 0]}>
        <sphereGeometry args={[0.025, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2.5]} />
        <meshStandardMaterial color="#5a1020" roughness={0.1} metalness={0.1} />
      </mesh>
    </group>
  )
}

function CheeseWedge({ position, rotation = [0, 0, 0], color = '#f5d67a' }: {
  position: [number, number, number]
  rotation?: [number, number, number]
  color?: string
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow>
        <boxGeometry args={[0.08, 0.05, 0.06]} />
        <meshStandardMaterial color={color} roughness={0.8} metalness={0.0} />
      </mesh>
    </group>
  )
}

export default function WineBar() {
  return (
    <group position={[6, 0, 8]}>
      {/* Bar counter */}
      <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 0.06, 0.7]} />
        <meshStandardMaterial color="#2a2218" roughness={0.35} metalness={0.05} />
      </mesh>

      {/* Bar front panel */}
      <mesh position={[0, 0.45, 0.32]} castShadow>
        <boxGeometry args={[2.5, 0.9, 0.04]} />
        <meshStandardMaterial color="#1a1512" roughness={0.5} metalness={0.05} />
      </mesh>

      {/* Bar legs */}
      {[[-1.2, 0.45, -0.15], [1.2, 0.45, -0.15]].map((pos, i) => (
        <mesh key={`bar-leg-${i}`} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.06, 0.9, 0.06]} />
          <meshStandardMaterial color="#1a1512" roughness={0.5} metalness={0.1} />
        </mesh>
      ))}

      {/* Shelf behind bar */}
      <mesh position={[0, 0.55, -0.15]} castShadow>
        <boxGeometry args={[2.4, 0.03, 0.3]} />
        <meshStandardMaterial color="#2a2218" roughness={0.4} metalness={0.05} />
      </mesh>

      {/* Wine bottles on shelf */}
      <WineBottle position={[-0.8, 0.7, -0.15]} color="#2d1f1f" />
      <WineBottle position={[-0.6, 0.7, -0.15]} color="#1a3320" />
      <WineBottle position={[-0.4, 0.7, -0.15]} color="#2d1f1f" />
      <WineBottle position={[0.3, 0.7, -0.15]} color="#3a2020" />
      <WineBottle position={[0.5, 0.7, -0.15]} color="#1a3320" />

      {/* Bottles on counter */}
      <WineBottle position={[-0.5, 1.07, -0.1]} color="#3a2020" />
      <WineBottle position={[0.7, 1.07, -0.1]} color="#1a3320" />

      {/* Wine glasses */}
      <WineGlass position={[-0.15, 1.03, 0.05]} />
      <WineGlass position={[0.1, 1.03, 0.1]} />
      <WineGlass position={[0.35, 1.03, 0.0]} />

      {/* Cheese board */}
      <mesh position={[0.1, 0.945, -0.05]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 0.015, 24]} />
        <meshStandardMaterial color="#b8956a" roughness={0.7} metalness={0.0} />
      </mesh>

      {/* Cheeses on board */}
      <CheeseWedge position={[0.05, 0.975, -0.05]} rotation={[0, 0.3, 0]} color="#f5d67a" />
      <CheeseWedge position={[0.15, 0.975, -0.02]} rotation={[0, -0.5, 0]} color="#e8c862" />
      <CheeseWedge position={[0.08, 0.975, -0.1]} rotation={[0, 1.2, 0]} color="#f0e0a0" />

      {/* Small accent light above bar */}
      <pointLight position={[0, 2.5, 0]} intensity={0.8} color="#ffecd2" distance={4} />

      {/* Bar stools */}
      {[-0.8, 0, 0.8].map((x, i) => (
        <group key={`stool-${i}`} position={[x, 0, 0.65]}>
          {/* Seat */}
          <mesh position={[0, 0.65, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.14, 0.04, 16]} />
            <meshStandardMaterial color="#1a1512" roughness={0.4} metalness={0.1} />
          </mesh>
          {/* Leg */}
          <mesh position={[0, 0.325, 0]}>
            <cylinderGeometry args={[0.015, 0.02, 0.65, 8]} />
            <meshStandardMaterial color="#2a2218" roughness={0.3} metalness={0.3} />
          </mesh>
          {/* Base */}
          <mesh position={[0, 0.01, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.02, 16]} />
            <meshStandardMaterial color="#2a2218" roughness={0.3} metalness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
