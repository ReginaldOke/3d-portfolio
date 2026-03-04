import { useMemo } from 'react'
import * as THREE from 'three'

export default function GalleryRoom() {
  const W = 24 // width (x)
  const D = 20 // depth (z)
  const H = 6  // height (y)

  const wallMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#f8f6f3', roughness: 0.92, metalness: 0.0 }), [])
  const floorMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#c8c4be', roughness: 0.45, metalness: 0.02 }), [])
  const ceilMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.95, metalness: 0.0 }), [])
  const trimMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#eae7e2', roughness: 0.5, metalness: 0.02 }), [])
  const darkTrimMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#2a2a2a', roughness: 0.3, metalness: 0.5 }), [])

  // Skylight grid
  const skylights = useMemo(() => {
    const items: [number, number][] = []
    for (let x = -8; x <= 8; x += 8) {
      for (let z = -6; z <= 6; z += 6) {
        items.push([x, z])
      }
    }
    return items
  }, [])

  return (
    <group>
      {/* ── FLOOR ── polished concrete */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[W, D]} />
        <primitive object={floorMat} attach="material" />
      </mesh>

      {/* Subtle floor tile grid */}
      {Array.from({ length: Math.floor(W / 2) + 1 }).map((_, i) => (
        <mesh key={`fgx-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[-W / 2 + i * 2, 0.002, 0]}>
          <planeGeometry args={[0.01, D]} />
          <meshBasicMaterial color="#b8b4ae" />
        </mesh>
      ))}
      {Array.from({ length: Math.floor(D / 2) + 1 }).map((_, i) => (
        <mesh key={`fgz-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, -D / 2 + i * 2]}>
          <planeGeometry args={[W, 0.01]} />
          <meshBasicMaterial color="#b8b4ae" />
        </mesh>
      ))}

      {/* ── CEILING ── */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, H, 0]}>
        <planeGeometry args={[W, D]} />
        <primitive object={ceilMat} attach="material" />
      </mesh>

      {/* Skylight panels */}
      {skylights.map(([x, z], i) => (
        <group key={`sky-${i}`} position={[x, H - 0.01, z]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[5, 3.5]} />
            <meshBasicMaterial color="#e8ecf5" />
          </mesh>
          {/* Dark frame */}
          <mesh position={[0, -0.02, -1.8]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[5.2, 0.12]} />
            <meshBasicMaterial color="#1a1a1a" />
          </mesh>
          <mesh position={[0, -0.02, 1.8]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[5.2, 0.12]} />
            <meshBasicMaterial color="#1a1a1a" />
          </mesh>
          <mesh position={[-2.55, -0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.12, 3.7]} />
            <meshBasicMaterial color="#1a1a1a" />
          </mesh>
          <mesh position={[2.55, -0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.12, 3.7]} />
            <meshBasicMaterial color="#1a1a1a" />
          </mesh>
          {/* Cross dividers */}
          <mesh position={[0, -0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[5, 0.06]} />
            <meshBasicMaterial color="#1a1a1a" />
          </mesh>
          <mesh position={[0, -0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.06, 3.5]} />
            <meshBasicMaterial color="#1a1a1a" />
          </mesh>
        </group>
      ))}

      {/* ── WALLS ── */}
      <mesh position={[-W / 2, H / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[D, H]} />
        <primitive object={wallMat} attach="material" />
      </mesh>
      <mesh position={[W / 2, H / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[D, H]} />
        <primitive object={wallMat} attach="material" />
      </mesh>
      <mesh position={[0, H / 2, -D / 2]} receiveShadow>
        <planeGeometry args={[W, H]} />
        <primitive object={wallMat} attach="material" />
      </mesh>
      <mesh position={[0, H / 2, D / 2]} rotation={[0, Math.PI, 0]} receiveShadow>
        <planeGeometry args={[W, H]} />
        <primitive object={wallMat} attach="material" />
      </mesh>

      {/* ── CENTRAL PARTITION COLUMN ── */}
      <mesh position={[0, H / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, H, 7]} />
        <primitive object={wallMat} attach="material" />
      </mesh>
      <mesh position={[0, H - 0.05, 0]}>
        <boxGeometry args={[0.7, 0.1, 7.2]} />
        <primitive object={trimMat} attach="material" />
      </mesh>
      <mesh position={[0, 0.075, 0]}>
        <boxGeometry args={[0.65, 0.15, 7.1]} />
        <primitive object={trimMat} attach="material" />
      </mesh>

      {/* Light strip at base of central column */}
      <mesh position={[-0.26, 0.02, 0]}>
        <boxGeometry args={[0.01, 0.04, 6.8]} />
        <meshBasicMaterial color="#fff8f0" />
      </mesh>
      <mesh position={[0.26, 0.02, 0]}>
        <boxGeometry args={[0.01, 0.04, 6.8]} />
        <meshBasicMaterial color="#fff8f0" />
      </mesh>

      {/* ── BASEBOARDS ── */}
      <mesh position={[-W / 2 + 0.05, 0.06, 0]}>
        <boxGeometry args={[0.1, 0.12, D]} />
        <primitive object={trimMat} attach="material" />
      </mesh>
      <mesh position={[W / 2 - 0.05, 0.06, 0]}>
        <boxGeometry args={[0.1, 0.12, D]} />
        <primitive object={trimMat} attach="material" />
      </mesh>
      <mesh position={[0, 0.06, -D / 2 + 0.05]}>
        <boxGeometry args={[W, 0.12, 0.1]} />
        <primitive object={trimMat} attach="material" />
      </mesh>
      <mesh position={[0, 0.06, D / 2 - 0.05]}>
        <boxGeometry args={[W, 0.12, 0.1]} />
        <primitive object={trimMat} attach="material" />
      </mesh>

      {/* ── DARK CEILING EDGE TRIM ── */}
      <mesh position={[-W / 2 + 0.03, H - 0.03, 0]}>
        <boxGeometry args={[0.06, 0.06, D]} />
        <primitive object={darkTrimMat} attach="material" />
      </mesh>
      <mesh position={[W / 2 - 0.03, H - 0.03, 0]}>
        <boxGeometry args={[0.06, 0.06, D]} />
        <primitive object={darkTrimMat} attach="material" />
      </mesh>
      <mesh position={[0, H - 0.03, -D / 2 + 0.03]}>
        <boxGeometry args={[W, 0.06, 0.06]} />
        <primitive object={darkTrimMat} attach="material" />
      </mesh>
      <mesh position={[0, H - 0.03, D / 2 - 0.03]}>
        <boxGeometry args={[W, 0.06, 0.06]} />
        <primitive object={darkTrimMat} attach="material" />
      </mesh>

      {/* ── BENCHES ── */}
      <group position={[-5, 0, 0]}>
        <mesh position={[0, 0.42, 0]} castShadow>
          <boxGeometry args={[1.8, 0.05, 0.45]} />
          <meshStandardMaterial color="#1a1815" roughness={0.35} metalness={0.1} />
        </mesh>
        {[[-0.75, 0.2, 0], [0.75, 0.2, 0]].map((pos, i) => (
          <mesh key={`bl-${i}`} position={pos as [number, number, number]} castShadow>
            <boxGeometry args={[0.05, 0.4, 0.4]} />
            <meshStandardMaterial color="#2a2520" roughness={0.5} metalness={0.2} />
          </mesh>
        ))}
      </group>

      {/* ── SCULPTURE PEDESTALS ── */}
      {[[-8, -6], [8, 5]].map(([x, z], i) => (
        <group key={`ped-${i}`} position={[x, 0, z]}>
          <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.6, 1.0, 0.6]} />
            <meshStandardMaterial color="#f0ede8" roughness={0.85} metalness={0.0} />
          </mesh>
          <mesh position={[0, 1.15, 0]} castShadow>
            <sphereGeometry args={[0.18, 16, 12]} />
            <meshStandardMaterial color="#2a2520" roughness={0.3} metalness={0.6} />
          </mesh>
          <mesh position={[0.06, 1.38, 0.02]} castShadow>
            <sphereGeometry args={[0.09, 12, 8]} />
            <meshStandardMaterial color="#2a2520" roughness={0.3} metalness={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
