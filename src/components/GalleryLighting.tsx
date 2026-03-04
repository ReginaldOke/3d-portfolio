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
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.001}
      />

      {/* Secondary fill */}
      <directionalLight position={[-3, 5, 8]} intensity={0.3} color="#ffecd2" />

      {/* Overhead point lights along gallery */}
      {[[-3, -5], [-3, 0], [-3, 5], [3, -5], [3, 0], [3, 5]].map(
        ([x, z], i) => (
          <pointLight key={`sl-${i}`} position={[x, 4.5, z]} intensity={0.3} color="#f0ecf5" distance={8} />
        )
      )}

      {/* Spotlights on each painting */}
      {paintings.map((painting) => {
        const spotPos: [number, number, number] = [...painting.position]
        spotPos[1] = 4.5
        const rx = painting.rotation[1]
        if (Math.abs(rx - Math.PI / 2) < 0.1) spotPos[0] += 2
        else if (Math.abs(rx + Math.PI / 2) < 0.1) spotPos[0] -= 2
        else if (Math.abs(rx) < 0.1) spotPos[2] += 2
        else spotPos[2] -= 2

        return (
          <spotLight
            key={painting.id}
            position={spotPos}
            target-position={painting.position}
            intensity={3.5}
            color="#fff8f0"
            angle={0.5}
            penumbra={0.7}
            distance={8}
            castShadow={false}
          />
        )
      })}
    </>
  )
}
