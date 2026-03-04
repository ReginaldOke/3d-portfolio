import { paintings } from '../data/paintings'

export default function GalleryLighting() {
  return (
    <>
      {/* Bright ambient — gallery should feel naturally lit */}
      <ambientLight intensity={0.5} color="#f5f2ef" />

      {/* Main skylight directional light */}
      <directionalLight
        position={[0, 10, 0]}
        intensity={0.8}
        color="#fff8f2"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={20}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-bias={-0.001}
      />

      {/* Secondary fill from window side */}
      <directionalLight position={[-6, 5, 10]} intensity={0.4} color="#ffecd2" />

      {/* Skylight point lights */}
      {[[-8, -6], [-8, 0], [-8, 6], [0, -6], [0, 0], [0, 6], [8, -6], [8, 0], [8, 6]].map(
        ([x, z], i) => (
          <pointLight key={`sl-${i}`} position={[x, 5.5, z]} intensity={0.4} color="#f0ecf5" distance={10} />
        )
      )}

      {/* Spotlights on each painting */}
      {paintings.map((painting) => {
        const spotPos: [number, number, number] = [...painting.position]
        spotPos[1] = 5.5
        const rx = painting.rotation[1]
        if (Math.abs(rx - Math.PI / 2) < 0.1) spotPos[0] += 3
        else if (Math.abs(rx + Math.PI / 2) < 0.1) spotPos[0] -= 3
        else if (Math.abs(rx) < 0.1) spotPos[2] += 3
        else spotPos[2] -= 3

        return (
          <spotLight
            key={painting.id}
            position={spotPos}
            target-position={painting.position}
            intensity={3.5}
            color="#fff8f0"
            angle={0.5}
            penumbra={0.7}
            distance={12}
            castShadow={false}
          />
        )
      })}

      {/* Warm accent near wine bar */}
      <pointLight position={[6, 2, 7]} intensity={0.3} color="#e8d5b7" distance={6} />
      {/* Window light bounce */}
      <pointLight position={[-4, 1, 8]} intensity={0.3} color="#dce5f0" distance={8} />
    </>
  )
}
