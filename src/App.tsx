import { Suspense, useState, useCallback, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import GalleryScene from './components/GalleryScene'
import LoadingScreen from './components/LoadingScreen'
import NavigationUI from './components/NavigationUI'

// Navigation is now unified:
// - Scroll / chevrons → guided tour (moves between stops)
// - WASD / arrow keys → free walk mode
// - If user scrolls while in free walk → snap to nearest tour stop

export type NavMode = 'guided' | 'free'

export default function App() {
  const [navMode, setNavMode] = useState<NavMode>('guided')
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentStop, setCurrentStop] = useState(0)

  const handleLoaded = useCallback(() => setIsLoaded(true), [])

  return (
    <div className="w-full h-full relative">
      {!isLoaded && <LoadingScreen />}

      <Canvas
        shadows
        camera={{ fov: 60, near: 0.1, far: 100, position: [0, 1.65, 8] }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          pixelRatio: Math.min(window.devicePixelRatio, 2),
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <GalleryScene
            navMode={navMode}
            setNavMode={setNavMode}
            onLoaded={handleLoaded}
            currentStop={currentStop}
            setCurrentStop={setCurrentStop}
          />
        </Suspense>
      </Canvas>

      {isLoaded && (
        <NavigationUI
          navMode={navMode}
          currentStop={currentStop}
          setCurrentStop={setCurrentStop}
        />
      )}
    </div>
  )
}
